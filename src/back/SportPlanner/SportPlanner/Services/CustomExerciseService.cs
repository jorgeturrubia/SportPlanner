using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public class CustomExerciseService : ICustomExerciseService
{
    private readonly SportPlannerDbContext _context;
    private readonly ILogger<CustomExerciseService> _logger;

    public CustomExerciseService(SportPlannerDbContext context, ILogger<CustomExerciseService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<CustomExerciseDto>> GetUserCustomExercisesAsync(Guid userId)
    {
        try
        {
            var exercises = await _context.CustomExercises
                .Include(e => e.CreatedBy)
                .Where(e => e.IsActive && (e.CreatedByUserId == userId || e.IsPublic))
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();

            return exercises.Select(MapToCustomExerciseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting custom exercises for user {UserId}", userId);
            throw;
        }
    }

    public async Task<IEnumerable<CustomExerciseDto>> GetFilteredCustomExercisesAsync(Guid userId, CustomExerciseFilterDto filter)
    {
        try
        {
            var query = _context.CustomExercises
                .Include(e => e.CreatedBy)
                .Where(e => e.IsActive && (e.CreatedByUserId == userId || e.IsPublic));

            // Apply filters
            if (filter.Category.HasValue)
                query = query.Where(e => e.Category == filter.Category.Value);

            if (filter.Difficulty.HasValue)
                query = query.Where(e => e.Difficulty == filter.Difficulty.Value);

            if (filter.MinDuration.HasValue)
                query = query.Where(e => e.DurationMinutes >= filter.MinDuration.Value);

            if (filter.MaxDuration.HasValue)
                query = query.Where(e => e.DurationMinutes <= filter.MaxDuration.Value);

            if (filter.MinPlayers.HasValue)
                query = query.Where(e => e.MinPlayers >= filter.MinPlayers.Value);

            if (filter.MaxPlayers.HasValue)
                query = query.Where(e => e.MaxPlayers <= filter.MaxPlayers.Value);

            if (filter.IsPublic.HasValue)
                query = query.Where(e => e.IsPublic == filter.IsPublic.Value);

            if (filter.IsCustom.HasValue)
                query = query.Where(e => e.IsCustom == filter.IsCustom.Value);

            if (!string.IsNullOrEmpty(filter.Tag))
                query = query.Where(e => e.Tags.Contains(filter.Tag));

            if (!string.IsNullOrEmpty(filter.Equipment))
                query = query.Where(e => e.Equipment.Contains(filter.Equipment));

            if (!string.IsNullOrEmpty(filter.Search))
                query = query.Where(e => e.Name.Contains(filter.Search) || 
                                       e.Description.Contains(filter.Search) ||
                                       e.Instructions.Contains(filter.Search));

            var exercises = await query
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();

            return exercises.Select(MapToCustomExerciseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting filtered custom exercises for user {UserId}", userId);
            throw;
        }
    }

    public async Task<CustomExerciseDto?> GetCustomExerciseAsync(string exerciseId, Guid userId)
    {
        try
        {
            if (!int.TryParse(exerciseId, out int id))
            {
                return null;
            }

            var exercise = await _context.CustomExercises
                .Include(e => e.CreatedBy)
                .FirstOrDefaultAsync(e => e.Id == id && e.IsActive &&
                                        (e.CreatedByUserId == userId || e.IsPublic));

            return exercise != null ? MapToCustomExerciseDto(exercise) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting custom exercise {ExerciseId} for user {UserId}", exerciseId, userId);
            throw;
        }
    }

    public async Task<CustomExerciseDto> CreateCustomExerciseAsync(CreateCustomExerciseRequest request, Guid userId)
    {
        try
        {
            var exercise = new CustomExercise
            {
                Name = request.Name,
                Description = request.Description,
                Instructions = request.Instructions,
                Category = request.Category,
                Difficulty = request.Difficulty,
                DurationMinutes = request.DurationMinutes,
                MinPlayers = request.MinPlayers,
                MaxPlayers = request.MaxPlayers,
                Equipment = request.Equipment,
                Tags = request.Tags,
                IsPublic = request.IsPublic,
                IsCustom = true,
                UsageCount = 0,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.CustomExercises.Add(exercise);
            await _context.SaveChangesAsync();

            // Reload the exercise with includes for proper DTO mapping
            var createdExercise = await _context.CustomExercises
                .Include(e => e.CreatedBy)
                .FirstAsync(e => e.Id == exercise.Id);

            _logger.LogInformation("Custom exercise {ExerciseName} created successfully by user {UserId}", request.Name, userId);
            return MapToCustomExerciseDto(createdExercise);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating custom exercise for user {UserId}", userId);
            throw;
        }
    }

    public async Task<CustomExerciseDto> UpdateCustomExerciseAsync(string exerciseId, UpdateCustomExerciseRequest request, Guid userId)
    {
        try
        {
            if (!int.TryParse(exerciseId, out int id))
            {
                throw new KeyNotFoundException($"Custom exercise with ID {exerciseId} not found");
            }

            var exercise = await _context.CustomExercises
                .Include(e => e.CreatedBy)
                .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

            if (exercise == null)
            {
                throw new KeyNotFoundException($"Custom exercise with ID {exerciseId} not found");
            }

            // Check if user has permission to update this exercise
            if (!await UserCanAccessCustomExerciseAsync(exerciseId, userId))
            {
                throw new UnauthorizedAccessException("User does not have permission to update this custom exercise");
            }

            // Update exercise properties
            exercise.Name = request.Name;
            exercise.Description = request.Description;
            exercise.Instructions = request.Instructions;
            exercise.Category = request.Category;
            exercise.Difficulty = request.Difficulty;
            exercise.DurationMinutes = request.DurationMinutes;
            exercise.MinPlayers = request.MinPlayers;
            exercise.MaxPlayers = request.MaxPlayers;
            exercise.Equipment = request.Equipment;
            exercise.Tags = request.Tags;
            exercise.IsPublic = request.IsPublic;
            exercise.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Custom exercise {ExerciseId} updated successfully by user {UserId}", exerciseId, userId);
            return MapToCustomExerciseDto(exercise);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating custom exercise {ExerciseId} for user {UserId}", exerciseId, userId);
            throw;
        }
    }

    public async Task DeleteCustomExerciseAsync(string exerciseId, Guid userId)
    {
        try
        {
            if (!int.TryParse(exerciseId, out int id))
            {
                throw new KeyNotFoundException($"Custom exercise with ID {exerciseId} not found");
            }

            var exercise = await _context.CustomExercises
                .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

            if (exercise == null)
            {
                throw new KeyNotFoundException($"Custom exercise with ID {exerciseId} not found");
            }

            // Check if user has permission to delete this exercise
            if (!await UserCanAccessCustomExerciseAsync(exerciseId, userId))
            {
                throw new UnauthorizedAccessException("User does not have permission to delete this custom exercise");
            }

            // Soft delete
            exercise.IsActive = false;
            exercise.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Custom exercise {ExerciseId} deleted successfully by user {UserId}", exerciseId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting custom exercise {ExerciseId} for user {UserId}", exerciseId, userId);
            throw;
        }
    }

    public async Task<bool> UserCanAccessCustomExerciseAsync(string exerciseId, Guid userId)
    {
        try
        {
            if (!int.TryParse(exerciseId, out int id))
            {
                return false;
            }

            return await _context.CustomExercises
                .AnyAsync(e => e.Id == id && e.IsActive && e.CreatedByUserId == userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking user access to custom exercise {ExerciseId} for user {UserId}", exerciseId, userId);
            return false;
        }
    }

    public async Task<bool> AnyAsync(string exerciseId)
    {
        try
        {
            if (!int.TryParse(exerciseId, out int id))
            {
                return false;
            }

            return await _context.CustomExercises
                .AnyAsync(e => e.Id == id && e.IsActive);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking custom exercise access for exercise {ExerciseId}", exerciseId);
            return false;
        }
    }

    public async Task IncrementUsageCountAsync(string exerciseId)
    {
        try
        {
            if (!int.TryParse(exerciseId, out int id))
            {
                return;
            }

            var exercise = await _context.CustomExercises
                .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

            if (exercise != null)
            {
                exercise.UsageCount++;
                exercise.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error incrementing usage count for custom exercise {ExerciseId}", exerciseId);
        }
    }

    private static CustomExerciseDto MapToCustomExerciseDto(CustomExercise exercise)
    {
        return new CustomExerciseDto
        {
            Id = exercise.Id.ToString(),
            Name = exercise.Name,
            Description = exercise.Description,
            Instructions = exercise.Instructions,
            Category = exercise.Category,
            Difficulty = exercise.Difficulty,
            DurationMinutes = exercise.DurationMinutes,
            MinPlayers = exercise.MinPlayers,
            MaxPlayers = exercise.MaxPlayers,
            Equipment = exercise.Equipment,
            Tags = exercise.Tags,
            IsPublic = exercise.IsPublic,
            IsCustom = exercise.IsCustom,
            UsageCount = exercise.UsageCount,
            CreatedBy = exercise.CreatedBy?.Id.ToString() ?? string.Empty,
            CreatedAt = exercise.CreatedAt,
            UpdatedAt = exercise.UpdatedAt,
            IsActive = exercise.IsActive
        };
    }
}
