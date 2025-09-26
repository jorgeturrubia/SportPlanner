using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public class ObjectiveService : IObjectiveService
{
    private readonly SportPlannerDbContext _context;
    private readonly ILogger<ObjectiveService> _logger;

    public ObjectiveService(SportPlannerDbContext context, ILogger<ObjectiveService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<ObjectiveDto>> GetUserObjectivesAsync(Guid userId)
    {
        try
        {
            var objectives = await _context.Objectives
                .Include(o => o.Team)
                .Include(o => o.CreatedBy)
                .Where(o => o.IsActive && o.CreatedByUserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return objectives.Select(MapToObjectiveDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting objectives for user {UserId}", userId);
            throw;
        }
    }

    public async Task<IEnumerable<ObjectiveDto>> GetFilteredObjectivesAsync(Guid userId, ObjectiveFilterDto filter)
    {
        try
        {
            var query = _context.Objectives
                .Include(o => o.Team)
                .Include(o => o.CreatedBy)
                .Where(o => o.IsActive && o.CreatedByUserId == userId);

         

            if (!string.IsNullOrEmpty(filter.TeamId) && Guid.TryParse(filter.TeamId, out var filterTeamGuid))
                query = query.Where(o => o.TeamId == filterTeamGuid);

          


            if (!string.IsNullOrEmpty(filter.Tag))
            query = query.Where(o => o.Tags.Contains(filter.Tag));

            if (!string.IsNullOrEmpty(filter.Search))
                query = query.Where(o => o.Title.Contains(filter.Search) || o.Description.Contains(filter.Search));

            var objectives = await query
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return objectives.Select(MapToObjectiveDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting filtered objectives for user {UserId}", userId);
            throw;
        }
    }

    public async Task<ObjectiveDto?> GetObjectiveAsync(string objectiveId, Guid userId)
    {
        try
        {
            if (!int.TryParse(objectiveId, out int id))
            {
                return null;
            }

            var objective = await _context.Objectives
                .Include(o => o.Team)
                .Include(o => o.CreatedBy)
                .FirstOrDefaultAsync(o => o.Id == id && o.IsActive && o.CreatedByUserId == userId);

            return objective != null ? MapToObjectiveDto(objective) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting objective {ObjectiveId} for user {UserId}", objectiveId, userId);
            throw;
        }
    }

    public async Task<ObjectiveDto> CreateObjectiveAsync(CreateObjectiveRequest request, Guid userId)
    {
        try
        {
            // Validate team access if specified
            Guid? teamIdGuid = null;
            if (!string.IsNullOrEmpty(request.TeamId) && Guid.TryParse(request.TeamId, out var parsedTeamId))
            {
                teamIdGuid = parsedTeamId;
                var hasTeamAccess = await _context.Teams
                    .AnyAsync(t => t.Id == teamIdGuid.Value && t.IsActive && 
                                  (t.CreatedByUserId == userId || 
                                   t.UserTeams.Any(ut => ut.UserId == userId && ut.IsActive)));

                if (!hasTeamAccess)
                {
                    throw new UnauthorizedAccessException("User does not have access to the specified team");
                }
            }

            var objective = new Objective
            {
                Title = request.Title,
                Description = request.Description,
              
                TeamId = teamIdGuid,
                Tags = request.Tags ?? string.Empty,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Objectives.Add(objective);
            await _context.SaveChangesAsync();

            // Reload the objective with includes for proper DTO mapping
            var createdObjective = await _context.Objectives
                .Include(o => o.Team)
                .Include(o => o.CreatedBy)
                .FirstAsync(o => o.Id == objective.Id);

            _logger.LogInformation("Objective {ObjectiveName} created successfully by user {UserId}", request.Title, userId);
            return MapToObjectiveDto(createdObjective);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating objective for user {UserId}", userId);
            throw;
        }
    }

    public async Task<ObjectiveDto> UpdateObjectiveAsync(string objectiveId, UpdateObjectiveRequest request, Guid userId)
    {
        try
        {
            if (!int.TryParse(objectiveId, out int id))
            {
                throw new KeyNotFoundException($"Objective with ID {objectiveId} not found");
            }

            var objective = await _context.Objectives
                .Include(o => o.Team)
                .Include(o => o.CreatedBy)
                .FirstOrDefaultAsync(o => o.Id == id && o.IsActive);

            if (objective == null)
            {
                throw new KeyNotFoundException($"Objective with ID {objectiveId} not found");
            }

            // Check if user has permission to update this objective
            if (!await UserCanAccessObjectiveAsync(objectiveId, userId))
            {
                throw new UnauthorizedAccessException("User does not have permission to update this objective");
            }

         

            // Update objective properties
            objective.Title = request.Title;
            objective.Description = request.Description;
            
            objective.Tags = request.Tags ?? string.Empty;
            objective.UpdatedAt = DateTime.UtcNow;

            // Set CompletedDate when status changes to Completed
          

            await _context.SaveChangesAsync();

            _logger.LogInformation("Objective {ObjectiveId} updated successfully by user {UserId}", objectiveId, userId);
            return MapToObjectiveDto(objective);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating objective {ObjectiveId} for user {UserId}", objectiveId, userId);
            throw;
        }
    }

    public async Task DeleteObjectiveAsync(string objectiveId, Guid userId)
    {
        try
        {
            if (!int.TryParse(objectiveId, out int id))
            {
                throw new KeyNotFoundException($"Objective with ID {objectiveId} not found");
            }

            var objective = await _context.Objectives
                .FirstOrDefaultAsync(o => o.Id == id && o.IsActive);

            if (objective == null)
            {
                throw new KeyNotFoundException($"Objective with ID {objectiveId} not found");
            }

            // Check if user has permission to delete this objective
            if (!await UserCanAccessObjectiveAsync(objectiveId, userId))
            {
                throw new UnauthorizedAccessException("User does not have permission to delete this objective");
            }

            // Soft delete
            objective.IsActive = false;
            objective.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Objective {ObjectiveId} deleted successfully by user {UserId}", objectiveId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting objective {ObjectiveId} for user {UserId}", objectiveId, userId);
            throw;
        }
    }

    public async Task<bool> UserCanAccessObjectiveAsync(string objectiveId, Guid userId)
    {
        try
        {
            if (!int.TryParse(objectiveId, out int id))
            {
                return false;
            }

            return await _context.Objectives
                .AnyAsync(o => o.Id == id && o.IsActive && o.CreatedByUserId == userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking objective access for objective {ObjectiveId} and user {UserId}", objectiveId, userId);
            return false;
        }
    }

    private static ObjectiveDto MapToObjectiveDto(Objective objective)
    {
        return new ObjectiveDto
        {
            Id = objective.Id,
            Title = objective.Title,
            Description = objective.Description,
            TeamId = objective.TeamId?.ToString(),
            Tags = objective.Tags,
            CreatedBy = objective.CreatedBy?.Id.ToString() ?? string.Empty,
            CreatedAt = objective.CreatedAt,
            UpdatedAt = objective.UpdatedAt,
            IsActive = objective.IsActive
        };
    }
}
