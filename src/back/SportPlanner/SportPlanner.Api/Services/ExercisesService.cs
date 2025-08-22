using Microsoft.EntityFrameworkCore;
using SportPlanner.Api.Data;
using SportPlanner.Api.Dtos;
using SportPlanner.Api.Models;
using SportPlanner.Api.Exceptions;
using System.Text.Json;

namespace SportPlanner.Api.Services;

/// <summary>
/// Service for managing exercises
/// </summary>
public class ExercisesService : IExercisesService
{
    private readonly SportPlannerDbContext _context;
    private readonly ILogger<ExercisesService> _logger;

    public ExercisesService(SportPlannerDbContext context, ILogger<ExercisesService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ExercisesListResponseDto> GetExercisesAsync(ExerciseFilterDto filters)
    {
        try
        {
            var query = _context.Exercises
                .Include(e => e.Reviews)
                .Include(e => e.Media)
                .AsQueryable();

            // Apply filters
            if (filters.Category.HasValue)
                query = query.Where(e => e.Category == filters.Category.Value);

            if (filters.Difficulty.HasValue)
                query = query.Where(e => e.Difficulty == filters.Difficulty.Value);

            if (!string.IsNullOrEmpty(filters.Sport))
                query = query.Where(e => e.Sport.ToLower().Contains(filters.Sport.ToLower()));

            if (filters.IsPublic.HasValue)
                query = query.Where(e => e.IsPublic == filters.IsPublic.Value);

            if (filters.IsVerified.HasValue)
                query = query.Where(e => e.IsVerified == filters.IsVerified.Value);

            if (filters.MinDuration.HasValue)
                query = query.Where(e => e.Duration >= filters.MinDuration.Value);

            if (filters.MaxDuration.HasValue)
                query = query.Where(e => e.Duration <= filters.MaxDuration.Value);

            if (!string.IsNullOrEmpty(filters.Search))
            {
                var searchLower = filters.Search.ToLower();
                query = query.Where(e => e.Name.ToLower().Contains(searchLower) || 
                                       e.Description.ToLower().Contains(searchLower));
            }

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination
            var page = filters.Page ?? 1;
            var limit = Math.Min(filters.Limit ?? 10, 100);
            var skip = (page - 1) * limit;

            var exercises = await query
                .OrderByDescending(e => e.IsVerified)
                .ThenByDescending(e => e.Rating)
                .ThenByDescending(e => e.UsageCount)
                .Skip(skip)
                .Take(limit)
                .ToListAsync();

            var exerciseDtos = exercises.Select(MapToResponseDto).ToList();

            return new ExercisesListResponseDto
            {
                Exercises = exerciseDtos,
                TotalCount = totalCount,
                Page = page,
                Limit = limit
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving exercises with filters");
            throw new BusinessException("Error retrieving exercises");
        }
    }

    public async Task<ExerciseResponseDto?> GetExerciseByIdAsync(Guid id)
    {
        try
        {
            var exercise = await _context.Exercises
                .Include(e => e.Reviews)
                .Include(e => e.Media)
                .FirstOrDefaultAsync(e => e.Id == id);

            return exercise != null ? MapToResponseDto(exercise) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving exercise {ExerciseId}", id);
            throw new BusinessException($"Error retrieving exercise {id}");
        }
    }

    public async Task<ExerciseResponseDto> CreateExerciseAsync(CreateExerciseDto createDto, Guid userId)
    {
        try
        {
            var exercise = new Exercise
            {
                Name = createDto.Name,
                Description = createDto.Description,
                Category = createDto.Category,
                Difficulty = createDto.Difficulty,
                Duration = createDto.Duration,
                MinParticipants = createDto.MinParticipants,
                MaxParticipants = createDto.MaxParticipants,
                TargetAgeGroup = JsonSerializer.Serialize(createDto.TargetAgeGroup),
                Sport = createDto.Sport,
                Objectives = JsonSerializer.Serialize(createDto.Objectives),
                Instructions = JsonSerializer.Serialize(createDto.Instructions),
                SafetyNotes = JsonSerializer.Serialize(createDto.SafetyNotes),
                Equipment = JsonSerializer.Serialize(createDto.Equipment),
                Variations = JsonSerializer.Serialize(createDto.Variations),
                Tags = JsonSerializer.Serialize(createDto.Tags),
                SpaceRequired = createDto.SpaceRequired,
                IsPublic = createDto.IsPublic,
                CreatedByUserId = userId,
                Status = ExerciseStatus.Published
            };

            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created new exercise {ExerciseId} by user {UserId}", exercise.Id, userId);

            return MapToResponseDto(exercise);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating exercise for user {UserId}", userId);
            throw new BusinessException("Error creating exercise");
        }
    }

    public async Task<ExerciseResponseDto?> UpdateExerciseAsync(Guid id, UpdateExerciseDto updateDto, Guid userId)
    {
        try
        {
            var exercise = await _context.Exercises
                .Include(e => e.Reviews)
                .Include(e => e.Media)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exercise == null)
                return null;

            // Check if user has permission to update
            if (exercise.CreatedByUserId != userId)
                throw new BusinessException("You don't have permission to update this exercise");

            // Update properties if provided
            if (!string.IsNullOrEmpty(updateDto.Name))
                exercise.Name = updateDto.Name;

            if (!string.IsNullOrEmpty(updateDto.Description))
                exercise.Description = updateDto.Description;

            if (updateDto.Category.HasValue)
                exercise.Category = updateDto.Category.Value;

            if (updateDto.Difficulty.HasValue)
                exercise.Difficulty = updateDto.Difficulty.Value;

            if (updateDto.Status.HasValue)
                exercise.Status = updateDto.Status.Value;

            if (updateDto.Duration.HasValue)
                exercise.Duration = updateDto.Duration.Value;

            if (updateDto.MinParticipants.HasValue)
                exercise.MinParticipants = updateDto.MinParticipants.Value;

            if (updateDto.MaxParticipants.HasValue)
                exercise.MaxParticipants = updateDto.MaxParticipants.Value;

            if (updateDto.TargetAgeGroup != null)
                exercise.TargetAgeGroup = JsonSerializer.Serialize(updateDto.TargetAgeGroup);

            if (!string.IsNullOrEmpty(updateDto.Sport))
                exercise.Sport = updateDto.Sport;

            if (updateDto.Objectives != null)
                exercise.Objectives = JsonSerializer.Serialize(updateDto.Objectives);

            if (updateDto.Instructions != null)
                exercise.Instructions = JsonSerializer.Serialize(updateDto.Instructions);

            if (updateDto.SafetyNotes != null)
                exercise.SafetyNotes = JsonSerializer.Serialize(updateDto.SafetyNotes);

            if (updateDto.Equipment != null)
                exercise.Equipment = JsonSerializer.Serialize(updateDto.Equipment);

            if (updateDto.Variations != null)
                exercise.Variations = JsonSerializer.Serialize(updateDto.Variations);

            if (updateDto.Tags != null)
                exercise.Tags = JsonSerializer.Serialize(updateDto.Tags);

            if (!string.IsNullOrEmpty(updateDto.SpaceRequired))
                exercise.SpaceRequired = updateDto.SpaceRequired;

            if (updateDto.IsPublic.HasValue)
                exercise.IsPublic = updateDto.IsPublic.Value;

            if (updateDto.IsVerified.HasValue)
                exercise.IsVerified = updateDto.IsVerified.Value;

            exercise.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated exercise {ExerciseId} by user {UserId}", id, userId);

            return MapToResponseDto(exercise);
        }
        catch (BusinessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating exercise {ExerciseId} for user {UserId}", id, userId);
            throw new BusinessException("Error updating exercise");
        }
    }

    public async Task<bool> DeleteExerciseAsync(Guid id, Guid userId)
    {
        try
        {
            var exercise = await _context.Exercises
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exercise == null)
                return false;

            // Check if user has permission to delete
            if (exercise.CreatedByUserId != userId)
                throw new BusinessException("You don't have permission to delete this exercise");

            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted exercise {ExerciseId} by user {UserId}", id, userId);

            return true;
        }
        catch (BusinessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting exercise {ExerciseId} for user {UserId}", id, userId);
            throw new BusinessException("Error deleting exercise");
        }
    }

    public async Task<List<ExerciseResponseDto>> GetExercisesByCategoryAsync(ExerciseCategory category)
    {
        try
        {
            var exercises = await _context.Exercises
                .Include(e => e.Reviews)
                .Include(e => e.Media)
                .Where(e => e.Category == category && e.IsPublic)
                .OrderByDescending(e => e.IsVerified)
                .ThenByDescending(e => e.Rating)
                .ThenByDescending(e => e.UsageCount)
                .ToListAsync();

            return exercises.Select(MapToResponseDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving exercises by category {Category}", category);
            throw new BusinessException($"Error retrieving exercises by category {category}");
        }
    }

    public async Task<List<ExerciseResponseDto>> GetExercisesBySportAsync(string sport)
    {
        try
        {
            var exercises = await _context.Exercises
                .Include(e => e.Reviews)
                .Include(e => e.Media)
                .Where(e => e.Sport.ToLower() == sport.ToLower() && e.IsPublic)
                .OrderByDescending(e => e.IsVerified)
                .ThenByDescending(e => e.Rating)
                .ThenByDescending(e => e.UsageCount)
                .ToListAsync();

            return exercises.Select(MapToResponseDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving exercises by sport {Sport}", sport);
            throw new BusinessException($"Error retrieving exercises by sport {sport}");
        }
    }

    public async Task<List<ExerciseResponseDto>> GetExercisesByObjectiveAsync(Guid objectiveId)
    {
        try
        {
            var objectiveIdString = objectiveId.ToString();
            var exercises = await _context.Exercises
                .Include(e => e.Reviews)
                .Include(e => e.Media)
                .Where(e => e.Objectives.Contains(objectiveIdString) && e.IsPublic)
                .OrderByDescending(e => e.IsVerified)
                .ThenByDescending(e => e.Rating)
                .ThenByDescending(e => e.UsageCount)
                .ToListAsync();

            return exercises.Select(MapToResponseDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving exercises by objective {ObjectiveId}", objectiveId);
            throw new BusinessException($"Error retrieving exercises by objective {objectiveId}");
        }
    }

    public async Task<List<ExerciseResponseDto>> SearchExercisesAsync(string query)
    {
        try
        {
            var searchLower = query.ToLower();
            var exercises = await _context.Exercises
                .Include(e => e.Reviews)
                .Include(e => e.Media)
                .Where(e => (e.Name.ToLower().Contains(searchLower) || 
                           e.Description.ToLower().Contains(searchLower)) && 
                           e.IsPublic)
                .OrderByDescending(e => e.IsVerified)
                .ThenByDescending(e => e.Rating)
                .ThenByDescending(e => e.UsageCount)
                .Take(50)
                .ToListAsync();

            return exercises.Select(MapToResponseDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching exercises with query {Query}", query);
            throw new BusinessException("Error searching exercises");
        }
    }

    public async Task<List<ExerciseResponseDto>> GetVerifiedExercisesAsync(int limit = 20)
    {
        try
        {
            var exercises = await _context.Exercises
                .Include(e => e.Reviews)
                .Include(e => e.Media)
                .Where(e => e.IsVerified && e.IsPublic)
                .OrderByDescending(e => e.Rating)
                .ThenByDescending(e => e.UsageCount)
                .Take(Math.Min(limit, 100))
                .ToListAsync();

            return exercises.Select(MapToResponseDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving verified exercises");
            throw new BusinessException("Error retrieving verified exercises");
        }
    }

    public async Task<ExerciseMediaDto?> AddExerciseMediaAsync(Guid exerciseId, CreateExerciseMediaDto mediaDto, Guid userId)
    {
        try
        {
            var exercise = await _context.Exercises
                .FirstOrDefaultAsync(e => e.Id == exerciseId);

            if (exercise == null)
                return null;

            // Check if user has permission to add media
            if (exercise.CreatedByUserId != userId)
                throw new BusinessException("You don't have permission to add media to this exercise");

            var media = new ExerciseMedia
            {
                ExerciseId = exerciseId,
                Type = mediaDto.Type,
                Url = mediaDto.Url,
                Caption = mediaDto.Caption,
                Order = mediaDto.Order
            };

            _context.ExerciseMedia.Add(media);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Added media {MediaId} to exercise {ExerciseId} by user {UserId}", media.Id, exerciseId, userId);

            return new ExerciseMediaDto
            {
                Id = media.Id,
                Type = media.Type,
                Url = media.Url,
                Caption = media.Caption,
                Order = media.Order
            };
        }
        catch (BusinessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding media to exercise {ExerciseId} for user {UserId}", exerciseId, userId);
            throw new BusinessException("Error adding media to exercise");
        }
    }

    public async Task<ExerciseReviewDto?> AddExerciseReviewAsync(Guid exerciseId, CreateExerciseReviewDto reviewDto, Guid userId, string userName)
    {
        try
        {
            var exercise = await _context.Exercises
                .FirstOrDefaultAsync(e => e.Id == exerciseId);

            if (exercise == null)
                return null;

            // Check if user already reviewed this exercise
            var existingReview = await _context.ExerciseReviews
                .FirstOrDefaultAsync(r => r.ExerciseId == exerciseId && r.UserId == userId);

            if (existingReview != null)
                throw new BusinessException("You have already reviewed this exercise");

            var review = new ExerciseReview
            {
                ExerciseId = exerciseId,
                UserId = userId,
                UserName = userName,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment
            };

            _context.ExerciseReviews.Add(review);
            await _context.SaveChangesAsync();

            // Update exercise rating
            await UpdateRatingAsync(exerciseId);

            _logger.LogInformation("Added review {ReviewId} to exercise {ExerciseId} by user {UserId}", review.Id, exerciseId, userId);

            return new ExerciseReviewDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserName = review.UserName,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }
        catch (BusinessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding review to exercise {ExerciseId} for user {UserId}", exerciseId, userId);
            throw new BusinessException("Error adding review to exercise");
        }
    }

    public async Task<bool> IncrementUsageCountAsync(Guid id)
    {
        try
        {
            var exercise = await _context.Exercises
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exercise == null)
                return false;

            exercise.UsageCount++;
            exercise.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error incrementing usage count for exercise {ExerciseId}", id);
            return false;
        }
    }

    public async Task<bool> UpdateRatingAsync(Guid id)
    {
        try
        {
            var exercise = await _context.Exercises
                .Include(e => e.Reviews)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exercise == null)
                return false;

            if (exercise.Reviews.Count > 0)
            {
                exercise.Rating = (decimal)exercise.Reviews.Average(r => r.Rating);
            }
            else
            {
                exercise.Rating = 0;
            }

            exercise.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating rating for exercise {ExerciseId}", id);
            return false;
        }
    }

    private static ExerciseResponseDto MapToResponseDto(Exercise exercise)
    {
        return new ExerciseResponseDto
        {
            Id = exercise.Id,
            Name = exercise.Name,
            Description = exercise.Description,
            Category = exercise.Category,
            Difficulty = exercise.Difficulty,
            Status = exercise.Status,
            Duration = exercise.Duration,
            MinParticipants = exercise.MinParticipants,
            MaxParticipants = exercise.MaxParticipants,
            TargetAgeGroup = JsonSerializer.Deserialize<List<string>>(exercise.TargetAgeGroup) ?? new List<string>(),
            Sport = exercise.Sport,
            Objectives = JsonSerializer.Deserialize<List<string>>(exercise.Objectives) ?? new List<string>(),
            Instructions = JsonSerializer.Deserialize<List<string>>(exercise.Instructions) ?? new List<string>(),
            SafetyNotes = JsonSerializer.Deserialize<List<string>>(exercise.SafetyNotes) ?? new List<string>(),
            Equipment = JsonSerializer.Deserialize<List<string>>(exercise.Equipment) ?? new List<string>(),
            Variations = JsonSerializer.Deserialize<List<string>>(exercise.Variations) ?? new List<string>(),
            Tags = JsonSerializer.Deserialize<List<string>>(exercise.Tags) ?? new List<string>(),
            SpaceRequired = exercise.SpaceRequired,
            IsPublic = exercise.IsPublic,
            IsVerified = exercise.IsVerified,
            CreatedByUserId = exercise.CreatedByUserId,
            CreatedAt = exercise.CreatedAt,
            UpdatedAt = exercise.UpdatedAt,
            UsageCount = exercise.UsageCount,
            Rating = exercise.Rating,
            Media = exercise.Media?.Select(m => new ExerciseMediaDto
            {
                Id = m.Id,
                Type = m.Type,
                Url = m.Url,
                Caption = m.Caption,
                Order = m.Order
            }).ToList() ?? new List<ExerciseMediaDto>(),
            Reviews = exercise.Reviews?.Select(r => new ExerciseReviewDto
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = r.UserName,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList() ?? new List<ExerciseReviewDto>()
        };
    }
}