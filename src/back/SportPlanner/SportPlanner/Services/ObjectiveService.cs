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

            // Apply filters
            if (filter.Priority.HasValue)
                query = query.Where(o => o.Priority == filter.Priority.Value);

            if (filter.Status.HasValue)
                query = query.Where(o => o.Status == filter.Status.Value);

            if (filter.TeamId.HasValue)
                query = query.Where(o => o.TeamId == filter.TeamId.Value);

            if (filter.DueBefore.HasValue)
                query = query.Where(o => o.DueDate <= filter.DueBefore.Value);

            if (filter.DueAfter.HasValue)
                query = query.Where(o => o.DueDate >= filter.DueAfter.Value);

            if (filter.MinProgress.HasValue)
                query = query.Where(o => o.Progress >= filter.MinProgress.Value);

            if (filter.MaxProgress.HasValue)
                query = query.Where(o => o.Progress <= filter.MaxProgress.Value);

            if (!string.IsNullOrEmpty(filter.Tag))
                query = query.Where(o => o.Tags.Contains(filter.Tag));

            if (!string.IsNullOrEmpty(filter.Search))
                query = query.Where(o => o.Name.Contains(filter.Search) || o.Description.Contains(filter.Search));

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

    public async Task<ObjectiveDto?> GetObjectiveAsync(int objectiveId, Guid userId)
    {
        try
        {
            var objective = await _context.Objectives
                .Include(o => o.Team)
                .Include(o => o.CreatedBy)
                .FirstOrDefaultAsync(o => o.Id == objectiveId && o.IsActive && o.CreatedByUserId == userId);

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
            if (request.TeamId.HasValue)
            {
                var hasTeamAccess = await _context.Teams
                    .AnyAsync(t => t.Id == request.TeamId.Value && t.IsActive && 
                                  (t.CreatedByUserId == userId || 
                                   t.UserTeams.Any(ut => ut.UserId == userId && ut.IsActive)));

                if (!hasTeamAccess)
                {
                    throw new UnauthorizedAccessException("User does not have access to the specified team");
                }
            }

            var objective = new Objective
            {
                Name = request.Name,
                Description = request.Description,
                Priority = request.Priority,
                Status = request.Status,
                Progress = request.Progress,
                DueDate = request.DueDate,
                TeamId = request.TeamId,
                Tags = request.Tags,
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

            _logger.LogInformation("Objective {ObjectiveName} created successfully by user {UserId}", request.Name, userId);
            return MapToObjectiveDto(createdObjective);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating objective for user {UserId}", userId);
            throw;
        }
    }

    public async Task<ObjectiveDto> UpdateObjectiveAsync(int objectiveId, UpdateObjectiveRequest request, Guid userId)
    {
        try
        {
            var objective = await _context.Objectives
                .Include(o => o.Team)
                .Include(o => o.CreatedBy)
                .FirstOrDefaultAsync(o => o.Id == objectiveId && o.IsActive);

            if (objective == null)
            {
                throw new KeyNotFoundException($"Objective with ID {objectiveId} not found");
            }

            // Check if user has permission to update this objective
            if (!await UserCanAccessObjectiveAsync(objectiveId, userId))
            {
                throw new UnauthorizedAccessException("User does not have permission to update this objective");
            }

            // Validate team access if specified
            if (request.TeamId.HasValue)
            {
                var hasTeamAccess = await _context.Teams
                    .AnyAsync(t => t.Id == request.TeamId.Value && t.IsActive && 
                                  (t.CreatedByUserId == userId || 
                                   t.UserTeams.Any(ut => ut.UserId == userId && ut.IsActive)));

                if (!hasTeamAccess)
                {
                    throw new UnauthorizedAccessException("User does not have access to the specified team");
                }
            }

            // Update objective properties
            objective.Name = request.Name;
            objective.Description = request.Description;
            objective.Priority = request.Priority;
            objective.Status = request.Status;
            objective.Progress = request.Progress;
            objective.DueDate = request.DueDate;
            objective.TeamId = request.TeamId;
            objective.Tags = request.Tags;
            objective.UpdatedAt = DateTime.UtcNow;

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

    public async Task DeleteObjectiveAsync(int objectiveId, Guid userId)
    {
        try
        {
            var objective = await _context.Objectives
                .FirstOrDefaultAsync(o => o.Id == objectiveId && o.IsActive);

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

    public async Task<bool> UserCanAccessObjectiveAsync(int objectiveId, Guid userId)
    {
        try
        {
            return await _context.Objectives
                .AnyAsync(o => o.Id == objectiveId && o.IsActive && o.CreatedByUserId == userId);
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
            Name = objective.Name,
            Description = objective.Description,
            Priority = objective.Priority,
            Status = objective.Status,
            Progress = objective.Progress,
            DueDate = objective.DueDate,
            TeamId = objective.TeamId,
            TeamName = objective.Team?.Name ?? string.Empty,
            Tags = objective.Tags,
            CreatedBy = $"{objective.CreatedBy?.FirstName} {objective.CreatedBy?.LastName}".Trim(),
            CreatedAt = objective.CreatedAt,
            UpdatedAt = objective.UpdatedAt,
            IsActive = objective.IsActive
        };
    }
}