using SportPlanner.Api.Dtos;
using SportPlanner.Api.Models;

namespace SportPlanner.Api.Services;

/// <summary>
/// Service interface for managing training objectives
/// </summary>
public interface IObjectivesService
{
    /// <summary>
    /// Get all objectives with optional filtering and pagination
    /// </summary>
    /// <param name="filters">Filter and pagination parameters</param>
    /// <returns>Paginated list of objectives</returns>
    Task<ObjectivesListResponseDto> GetObjectivesAsync(ObjectiveFilterDto filters);

    /// <summary>
    /// Get objective by ID
    /// </summary>
    /// <param name="id">Objective ID</param>
    /// <returns>Objective details or null if not found</returns>
    Task<ObjectiveResponseDto?> GetObjectiveByIdAsync(Guid id);

    /// <summary>
    /// Create a new objective
    /// </summary>
    /// <param name="createDto">Objective creation data</param>
    /// <param name="userId">ID of the user creating the objective</param>
    /// <returns>Created objective</returns>
    Task<ObjectiveResponseDto> CreateObjectiveAsync(CreateObjectiveDto createDto, Guid userId);

    /// <summary>
    /// Update an existing objective
    /// </summary>
    /// <param name="id">Objective ID</param>
    /// <param name="updateDto">Objective update data</param>
    /// <param name="userId">ID of the user updating the objective</param>
    /// <returns>Updated objective or null if not found</returns>
    Task<ObjectiveResponseDto?> UpdateObjectiveAsync(Guid id, UpdateObjectiveDto updateDto, Guid userId);

    /// <summary>
    /// Delete an objective
    /// </summary>
    /// <param name="id">Objective ID</param>
    /// <param name="userId">ID of the user deleting the objective</param>
    /// <returns>True if deleted successfully, false if not found</returns>
    Task<bool> DeleteObjectiveAsync(Guid id, Guid userId);

    /// <summary>
    /// Get objectives by category
    /// </summary>
    /// <param name="category">Objective category</param>
    /// <returns>List of objectives in the specified category</returns>
    Task<List<ObjectiveResponseDto>> GetObjectivesByCategoryAsync(ObjectiveCategory category);

    /// <summary>
    /// Get objectives by sport
    /// </summary>
    /// <param name="sport">Sport name</param>
    /// <returns>List of objectives for the specified sport</returns>
    Task<List<ObjectiveResponseDto>> GetObjectivesBySportAsync(string sport);

    /// <summary>
    /// Search objectives by title or description
    /// </summary>
    /// <param name="query">Search query</param>
    /// <returns>List of matching objectives</returns>
    Task<List<ObjectiveResponseDto>> SearchObjectivesAsync(string query);

    /// <summary>
    /// Get popular objectives (most used)
    /// </summary>
    /// <param name="limit">Number of objectives to return</param>
    /// <returns>List of popular objectives</returns>
    Task<List<ObjectiveResponseDto>> GetPopularObjectivesAsync(int limit = 10);

    /// <summary>
    /// Increment usage count for an objective
    /// </summary>
    /// <param name="id">Objective ID</param>
    /// <returns>True if updated successfully</returns>
    Task<bool> IncrementUsageCountAsync(Guid id);

    /// <summary>
    /// Update objective rating
    /// </summary>
    /// <param name="id">Objective ID</param>
    /// <param name="rating">New rating value</param>
    /// <returns>True if updated successfully</returns>
    Task<bool> UpdateRatingAsync(Guid id, decimal rating);
}