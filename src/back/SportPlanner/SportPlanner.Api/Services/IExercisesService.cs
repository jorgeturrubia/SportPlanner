using SportPlanner.Api.Dtos;
using SportPlanner.Api.Models;

namespace SportPlanner.Api.Services;

/// <summary>
/// Service interface for managing exercises
/// </summary>
public interface IExercisesService
{
    /// <summary>
    /// Get all exercises with optional filtering and pagination
    /// </summary>
    /// <param name="filters">Filter and pagination parameters</param>
    /// <returns>Paginated list of exercises</returns>
    Task<ExercisesListResponseDto> GetExercisesAsync(ExerciseFilterDto filters);

    /// <summary>
    /// Get exercise by ID
    /// </summary>
    /// <param name="id">Exercise ID</param>
    /// <returns>Exercise details or null if not found</returns>
    Task<ExerciseResponseDto?> GetExerciseByIdAsync(Guid id);

    /// <summary>
    /// Create a new exercise
    /// </summary>
    /// <param name="createDto">Exercise creation data</param>
    /// <param name="userId">ID of the user creating the exercise</param>
    /// <returns>Created exercise</returns>
    Task<ExerciseResponseDto> CreateExerciseAsync(CreateExerciseDto createDto, Guid userId);

    /// <summary>
    /// Update an existing exercise
    /// </summary>
    /// <param name="id">Exercise ID</param>
    /// <param name="updateDto">Exercise update data</param>
    /// <param name="userId">ID of the user updating the exercise</param>
    /// <returns>Updated exercise or null if not found</returns>
    Task<ExerciseResponseDto?> UpdateExerciseAsync(Guid id, UpdateExerciseDto updateDto, Guid userId);

    /// <summary>
    /// Delete an exercise
    /// </summary>
    /// <param name="id">Exercise ID</param>
    /// <param name="userId">ID of the user deleting the exercise</param>
    /// <returns>True if deleted successfully, false if not found</returns>
    Task<bool> DeleteExerciseAsync(Guid id, Guid userId);

    /// <summary>
    /// Get exercises by category
    /// </summary>
    /// <param name="category">Exercise category</param>
    /// <returns>List of exercises in the specified category</returns>
    Task<List<ExerciseResponseDto>> GetExercisesByCategoryAsync(ExerciseCategory category);

    /// <summary>
    /// Get exercises by sport
    /// </summary>
    /// <param name="sport">Sport name</param>
    /// <returns>List of exercises for the specified sport</returns>
    Task<List<ExerciseResponseDto>> GetExercisesBySportAsync(string sport);

    /// <summary>
    /// Get exercises by objective
    /// </summary>
    /// <param name="objectiveId">Objective ID</param>
    /// <returns>List of exercises for the specified objective</returns>
    Task<List<ExerciseResponseDto>> GetExercisesByObjectiveAsync(Guid objectiveId);

    /// <summary>
    /// Search exercises by name or description
    /// </summary>
    /// <param name="query">Search query</param>
    /// <returns>List of matching exercises</returns>
    Task<List<ExerciseResponseDto>> SearchExercisesAsync(string query);

    /// <summary>
    /// Get verified exercises
    /// </summary>
    /// <param name="limit">Number of exercises to return</param>
    /// <returns>List of verified exercises</returns>
    Task<List<ExerciseResponseDto>> GetVerifiedExercisesAsync(int limit = 20);

    /// <summary>
    /// Add media to an exercise
    /// </summary>
    /// <param name="exerciseId">Exercise ID</param>
    /// <param name="mediaDto">Media data</param>
    /// <param name="userId">ID of the user adding the media</param>
    /// <returns>Created media or null if exercise not found</returns>
    Task<ExerciseMediaDto?> AddExerciseMediaAsync(Guid exerciseId, CreateExerciseMediaDto mediaDto, Guid userId);

    /// <summary>
    /// Add a review to an exercise
    /// </summary>
    /// <param name="exerciseId">Exercise ID</param>
    /// <param name="reviewDto">Review data</param>
    /// <param name="userId">ID of the user adding the review</param>
    /// <param name="userName">Name of the user adding the review</param>
    /// <returns>Created review or null if exercise not found</returns>
    Task<ExerciseReviewDto?> AddExerciseReviewAsync(Guid exerciseId, CreateExerciseReviewDto reviewDto, Guid userId, string userName);

    /// <summary>
    /// Increment usage count for an exercise
    /// </summary>
    /// <param name="id">Exercise ID</param>
    /// <returns>True if updated successfully</returns>
    Task<bool> IncrementUsageCountAsync(Guid id);

    /// <summary>
    /// Update exercise rating based on reviews
    /// </summary>
    /// <param name="id">Exercise ID</param>
    /// <returns>True if updated successfully</returns>
    Task<bool> UpdateRatingAsync(Guid id);
}