using Microsoft.EntityFrameworkCore;
using SportPlanner.Api.Data;
using SportPlanner.Api.Dtos;
using SportPlanner.Api.Models;
using SportPlanner.Api.Exceptions;
using System.Text.Json;

namespace SportPlanner.Api.Services;

/// <summary>
/// Service for managing training objectives
/// </summary>
public class ObjectivesService : IObjectivesService
{
    private readonly SportPlannerDbContext _context;
    private readonly ILogger<ObjectivesService> _logger;

    public ObjectivesService(SportPlannerDbContext context, ILogger<ObjectivesService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ObjectivesListResponseDto> GetObjectivesAsync(ObjectiveFilterDto filters)
    {
        try
        {
            var query = _context.Objectives.AsQueryable();

            // Apply filters
            if (filters.Category.HasValue)
                query = query.Where(o => o.Category == filters.Category.Value);

            if (filters.Difficulty.HasValue)
                query = query.Where(o => o.Difficulty == filters.Difficulty.Value);

            if (!string.IsNullOrEmpty(filters.Sport))
                query = query.Where(o => o.Sport.ToLower().Contains(filters.Sport.ToLower()));

            if (filters.IsPublic.HasValue)
                query = query.Where(o => o.IsPublic == filters.IsPublic.Value);

            if (!string.IsNullOrEmpty(filters.Search))
            {
                var searchLower = filters.Search.ToLower();
                query = query.Where(o => o.Title.ToLower().Contains(searchLower) || 
                                       o.Description.ToLower().Contains(searchLower));
            }

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination
            var page = filters.Page ?? 1;
            var limit = Math.Min(filters.Limit ?? 10, 100); // Max 100 items per page
            var skip = (page - 1) * limit;

            var objectives = await query
                .OrderByDescending(o => o.UsageCount)
                .ThenByDescending(o => o.CreatedAt)
                .Skip(skip)
                .Take(limit)
                .ToListAsync();

            var objectiveDtos = objectives.Select(MapToResponseDto).ToList();

            return new ObjectivesListResponseDto
            {
                Objectives = objectiveDtos,
                TotalCount = totalCount,
                Page = page,
                Limit = limit
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving objectives with filters");
            throw new BusinessException("Error retrieving objectives");
        }
    }

    public async Task<ObjectiveResponseDto?> GetObjectiveByIdAsync(Guid id)
    {
        try
        {
            var objective = await _context.Objectives
                .FirstOrDefaultAsync(o => o.Id == id);

            return objective != null ? MapToResponseDto(objective) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving objective {ObjectiveId}", id);
            throw new BusinessException($"Error retrieving objective {id}");
        }
    }

    public async Task<ObjectiveResponseDto> CreateObjectiveAsync(CreateObjectiveDto createDto, Guid userId)
    {
        try
        {
            var objective = new Objective
            {
                Title = createDto.Title,
                Description = createDto.Description,
                Category = createDto.Category,
                Difficulty = createDto.Difficulty,
                EstimatedDuration = createDto.EstimatedDuration,
                TargetAgeGroup = createDto.TargetAgeGroup,
                Sport = createDto.Sport,
                Tags = JsonSerializer.Serialize(createDto.Tags),
                Prerequisites = createDto.Prerequisites != null ? JsonSerializer.Serialize(createDto.Prerequisites) : null,
                EquipmentNeeded = JsonSerializer.Serialize(createDto.EquipmentNeeded),
                MaxParticipants = createDto.MaxParticipants,
                MinParticipants = createDto.MinParticipants,
                IsPublic = createDto.IsPublic,
                CreatedByUserId = userId,
                Status = ObjectiveStatus.Active
            };

            _context.Objectives.Add(objective);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created new objective {ObjectiveId} by user {UserId}", objective.Id, userId);

            return MapToResponseDto(objective);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating objective for user {UserId}", userId);
            throw new BusinessException("Error creating objective");
        }
    }

    public async Task<ObjectiveResponseDto?> UpdateObjectiveAsync(Guid id, UpdateObjectiveDto updateDto, Guid userId)
    {
        try
        {
            var objective = await _context.Objectives
                .FirstOrDefaultAsync(o => o.Id == id);

            if (objective == null)
                return null;

            // Check if user has permission to update
            if (objective.CreatedByUserId != userId)
                throw new BusinessException("You don't have permission to update this objective");

            // Update properties if provided
            if (!string.IsNullOrEmpty(updateDto.Title))
                objective.Title = updateDto.Title;

            if (!string.IsNullOrEmpty(updateDto.Description))
                objective.Description = updateDto.Description;

            if (updateDto.Category.HasValue)
                objective.Category = updateDto.Category.Value;

            if (updateDto.Difficulty.HasValue)
                objective.Difficulty = updateDto.Difficulty.Value;

            if (updateDto.Status.HasValue)
                objective.Status = updateDto.Status.Value;

            if (updateDto.EstimatedDuration.HasValue)
                objective.EstimatedDuration = updateDto.EstimatedDuration.Value;

            if (!string.IsNullOrEmpty(updateDto.TargetAgeGroup))
                objective.TargetAgeGroup = updateDto.TargetAgeGroup;

            if (!string.IsNullOrEmpty(updateDto.Sport))
                objective.Sport = updateDto.Sport;

            if (updateDto.Tags != null)
                objective.Tags = JsonSerializer.Serialize(updateDto.Tags);

            if (updateDto.Prerequisites != null)
                objective.Prerequisites = JsonSerializer.Serialize(updateDto.Prerequisites);

            if (updateDto.EquipmentNeeded != null)
                objective.EquipmentNeeded = JsonSerializer.Serialize(updateDto.EquipmentNeeded);

            if (updateDto.MaxParticipants.HasValue)
                objective.MaxParticipants = updateDto.MaxParticipants.Value;

            if (updateDto.MinParticipants.HasValue)
                objective.MinParticipants = updateDto.MinParticipants.Value;

            if (updateDto.IsPublic.HasValue)
                objective.IsPublic = updateDto.IsPublic.Value;

            objective.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated objective {ObjectiveId} by user {UserId}", id, userId);

            return MapToResponseDto(objective);
        }
        catch (BusinessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating objective {ObjectiveId} for user {UserId}", id, userId);
            throw new BusinessException("Error updating objective");
        }
    }

    public async Task<bool> DeleteObjectiveAsync(Guid id, Guid userId)
    {
        try
        {
            var objective = await _context.Objectives
                .FirstOrDefaultAsync(o => o.Id == id);

            if (objective == null)
                return false;

            // Check if user has permission to delete
            if (objective.CreatedByUserId != userId)
                throw new BusinessException("You don't have permission to delete this objective");

            _context.Objectives.Remove(objective);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted objective {ObjectiveId} by user {UserId}", id, userId);

            return true;
        }
        catch (BusinessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting objective {ObjectiveId} for user {UserId}", id, userId);
            throw new BusinessException("Error deleting objective");
        }
    }

    public async Task<List<ObjectiveResponseDto>> GetObjectivesByCategoryAsync(ObjectiveCategory category)
    {
        try
        {
            var objectives = await _context.Objectives
                .Where(o => o.Category == category && o.IsPublic)
                .OrderByDescending(o => o.Rating)
                .ThenByDescending(o => o.UsageCount)
                .ToListAsync();

            return objectives.Select(MapToResponseDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving objectives by category {Category}", category);
            throw new BusinessException($"Error retrieving objectives by category {category}");
        }
    }

    public async Task<List<ObjectiveResponseDto>> GetObjectivesBySportAsync(string sport)
    {
        try
        {
            var objectives = await _context.Objectives
                .Where(o => o.Sport.ToLower() == sport.ToLower() && o.IsPublic)
                .OrderByDescending(o => o.Rating)
                .ThenByDescending(o => o.UsageCount)
                .ToListAsync();

            return objectives.Select(MapToResponseDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving objectives by sport {Sport}", sport);
            throw new BusinessException($"Error retrieving objectives by sport {sport}");
        }
    }

    public async Task<List<ObjectiveResponseDto>> SearchObjectivesAsync(string query)
    {
        try
        {
            var searchLower = query.ToLower();
            var objectives = await _context.Objectives
                .Where(o => (o.Title.ToLower().Contains(searchLower) || 
                           o.Description.ToLower().Contains(searchLower)) && 
                           o.IsPublic)
                .OrderByDescending(o => o.Rating)
                .ThenByDescending(o => o.UsageCount)
                .Take(50) // Limit search results
                .ToListAsync();

            return objectives.Select(MapToResponseDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching objectives with query {Query}", query);
            throw new BusinessException("Error searching objectives");
        }
    }

    public async Task<List<ObjectiveResponseDto>> GetPopularObjectivesAsync(int limit = 10)
    {
        try
        {
            var objectives = await _context.Objectives
                .Where(o => o.IsPublic)
                .OrderByDescending(o => o.UsageCount)
                .ThenByDescending(o => o.Rating)
                .Take(Math.Min(limit, 100)) // Max 100 objectives
                .ToListAsync();

            return objectives.Select(MapToResponseDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving popular objectives");
            throw new BusinessException("Error retrieving popular objectives");
        }
    }

    public async Task<bool> IncrementUsageCountAsync(Guid id)
    {
        try
        {
            var objective = await _context.Objectives
                .FirstOrDefaultAsync(o => o.Id == id);

            if (objective == null)
                return false;

            objective.UsageCount++;
            objective.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error incrementing usage count for objective {ObjectiveId}", id);
            return false;
        }
    }

    public async Task<bool> UpdateRatingAsync(Guid id, decimal rating)
    {
        try
        {
            var objective = await _context.Objectives
                .FirstOrDefaultAsync(o => o.Id == id);

            if (objective == null)
                return false;

            objective.Rating = Math.Max(0, Math.Min(5, rating)); // Ensure rating is between 0 and 5
            objective.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating rating for objective {ObjectiveId}", id);
            return false;
        }
    }

    private static ObjectiveResponseDto MapToResponseDto(Objective objective)
    {
        return new ObjectiveResponseDto
        {
            Id = objective.Id,
            Title = objective.Title,
            Description = objective.Description,
            Category = objective.Category,
            Difficulty = objective.Difficulty,
            Status = objective.Status,
            EstimatedDuration = objective.EstimatedDuration,
            TargetAgeGroup = objective.TargetAgeGroup,
            Sport = objective.Sport,
            Tags = JsonSerializer.Deserialize<List<string>>(objective.Tags) ?? new List<string>(),
            Prerequisites = !string.IsNullOrEmpty(objective.Prerequisites) 
                ? JsonSerializer.Deserialize<List<string>>(objective.Prerequisites) 
                : null,
            EquipmentNeeded = JsonSerializer.Deserialize<List<string>>(objective.EquipmentNeeded) ?? new List<string>(),
            MaxParticipants = objective.MaxParticipants,
            MinParticipants = objective.MinParticipants,
            IsPublic = objective.IsPublic,
            CreatedByUserId = objective.CreatedByUserId,
            CreatedAt = objective.CreatedAt,
            UpdatedAt = objective.UpdatedAt,
            Rating = objective.Rating,
            UsageCount = objective.UsageCount
        };
    }
}