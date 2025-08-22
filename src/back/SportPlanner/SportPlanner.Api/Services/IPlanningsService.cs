using SportPlanner.Api.Dtos;
using SportPlanner.Api.Models;

namespace SportPlanner.Api.Services;

/// <summary>
/// Service interface for managing training plannings
/// </summary>
public interface IPlanningsService
{
    /// <summary>
    /// Get all plannings with optional filtering and pagination
    /// </summary>
    /// <param name="filters">Filter and pagination parameters</param>
    /// <returns>Paginated list of plannings</returns>
    Task<PlanningsListResponseDto> GetPlanningsAsync(PlanningFilterDto filters);

    /// <summary>
    /// Get planning by ID
    /// </summary>
    /// <param name="id">Planning ID</param>
    /// <returns>Planning details or null if not found</returns>
    Task<PlanningResponseDto?> GetPlanningByIdAsync(Guid id);

    /// <summary>
    /// Create a new planning
    /// </summary>
    /// <param name="createDto">Planning creation data</param>
    /// <param name="userId">ID of the user creating the planning</param>
    /// <returns>Created planning</returns>
    Task<PlanningResponseDto> CreatePlanningAsync(CreatePlanningDto createDto, Guid userId);

    /// <summary>
    /// Update an existing planning
    /// </summary>
    /// <param name="id">Planning ID</param>
    /// <param name="updateDto">Planning update data</param>
    /// <param name="userId">ID of the user updating the planning</param>
    /// <returns>Updated planning or null if not found</returns>
    Task<PlanningResponseDto?> UpdatePlanningAsync(Guid id, UpdatePlanningDto updateDto, Guid userId);

    /// <summary>
    /// Delete a planning
    /// </summary>
    /// <param name="id">Planning ID</param>
    /// <param name="userId">ID of the user deleting the planning</param>
    /// <returns>True if deleted successfully, false if not found</returns>
    Task<bool> DeletePlanningAsync(Guid id, Guid userId);

    /// <summary>
    /// Get plannings by team
    /// </summary>
    /// <param name="teamId">Team ID</param>
    /// <returns>List of plannings for the specified team</returns>
    Task<List<PlanningResponseDto>> GetPlanningsByTeamAsync(Guid teamId);

    /// <summary>
    /// Get active plannings for a team
    /// </summary>
    /// <param name="teamId">Team ID</param>
    /// <returns>List of active plannings</returns>
    Task<List<PlanningResponseDto>> GetActivePlanningsByTeamAsync(Guid teamId);

    /// <summary>
    /// Create planning from template
    /// </summary>
    /// <param name="templateId">Template ID</param>
    /// <param name="teamId">Team ID</param>
    /// <param name="startDate">Planning start date</param>
    /// <param name="userId">ID of the user creating the planning</param>
    /// <returns>Created planning or null if template not found</returns>
    Task<PlanningResponseDto?> CreatePlanningFromTemplateAsync(Guid templateId, Guid teamId, DateTime startDate, Guid userId);

    /// <summary>
    /// Get planning statistics
    /// </summary>
    /// <param name="id">Planning ID</param>
    /// <returns>Planning statistics or null if not found</returns>
    Task<object?> GetPlanningStatsAsync(Guid id);

    /// <summary>
    /// Update planning progress
    /// </summary>
    /// <param name="id">Planning ID</param>
    /// <returns>True if updated successfully</returns>
    Task<bool> UpdatePlanningProgressAsync(Guid id);
}

/// <summary>
/// Service interface for managing training sessions
/// </summary>
public interface ITrainingSessionsService
{
    /// <summary>
    /// Get all sessions for a planning
    /// </summary>
    /// <param name="planningId">Planning ID</param>
    /// <returns>List of sessions</returns>
    Task<List<TrainingSessionDto>> GetSessionsAsync(Guid planningId);

    /// <summary>
    /// Get session by ID
    /// </summary>
    /// <param name="planningId">Planning ID</param>
    /// <param name="sessionId">Session ID</param>
    /// <returns>Session details or null if not found</returns>
    Task<TrainingSessionDto?> GetSessionByIdAsync(Guid planningId, Guid sessionId);

    /// <summary>
    /// Create a new session
    /// </summary>
    /// <param name="planningId">Planning ID</param>
    /// <param name="createDto">Session creation data</param>
    /// <param name="userId">ID of the user creating the session</param>
    /// <returns>Created session or null if planning not found</returns>
    Task<TrainingSessionDto?> CreateSessionAsync(Guid planningId, CreateTrainingSessionDto createDto, Guid userId);

    /// <summary>
    /// Update a session
    /// </summary>
    /// <param name="planningId">Planning ID</param>
    /// <param name="sessionId">Session ID</param>
    /// <param name="updateDto">Session update data</param>
    /// <param name="userId">ID of the user updating the session</param>
    /// <returns>Updated session or null if not found</returns>
    Task<TrainingSessionDto?> UpdateSessionAsync(Guid planningId, Guid sessionId, UpdateTrainingSessionDto updateDto, Guid userId);

    /// <summary>
    /// Delete a session
    /// </summary>
    /// <param name="planningId">Planning ID</param>
    /// <param name="sessionId">Session ID</param>
    /// <param name="userId">ID of the user deleting the session</param>
    /// <returns>True if deleted successfully, false if not found</returns>
    Task<bool> DeleteSessionAsync(Guid planningId, Guid sessionId, Guid userId);

    /// <summary>
    /// Mark session as completed
    /// </summary>
    /// <param name="planningId">Planning ID</param>
    /// <param name="sessionId">Session ID</param>
    /// <param name="notes">Completion notes</param>
    /// <param name="userId">ID of the user completing the session</param>
    /// <returns>Updated session or null if not found</returns>
    Task<TrainingSessionDto?> CompleteSessionAsync(Guid planningId, Guid sessionId, string? notes, Guid userId);

    /// <summary>
    /// Update session attendance
    /// </summary>
    /// <param name="planningId">Planning ID</param>
    /// <param name="sessionId">Session ID</param>
    /// <param name="attendance">Attendance records</param>
    /// <param name="userId">ID of the user updating attendance</param>
    /// <returns>Updated session or null if not found</returns>
    Task<TrainingSessionDto?> UpdateAttendanceAsync(Guid planningId, Guid sessionId, List<CreateAttendanceRecordDto> attendance, Guid userId);
}

/// <summary>
/// Service interface for managing planning templates
/// </summary>
public interface IPlanningTemplatesService
{
    /// <summary>
    /// Get all planning templates
    /// </summary>
    /// <returns>List of planning templates</returns>
    Task<List<PlanningTemplateDto>> GetTemplatesAsync();

    /// <summary>
    /// Get template by ID
    /// </summary>
    /// <param name="id">Template ID</param>
    /// <returns>Template details or null if not found</returns>
    Task<PlanningTemplateDto?> GetTemplateByIdAsync(Guid id);

    /// <summary>
    /// Create a new planning template
    /// </summary>
    /// <param name="createDto">Template creation data</param>
    /// <param name="userId">ID of the user creating the template</param>
    /// <returns>Created template</returns>
    Task<PlanningTemplateDto> CreateTemplateAsync(CreatePlanningTemplateDto createDto, Guid userId);

    /// <summary>
    /// Update an existing template
    /// </summary>
    /// <param name="id">Template ID</param>
    /// <param name="updateDto">Template update data</param>
    /// <param name="userId">ID of the user updating the template</param>
    /// <returns>Updated template or null if not found</returns>
    Task<PlanningTemplateDto?> UpdateTemplateAsync(Guid id, CreatePlanningTemplateDto updateDto, Guid userId);

    /// <summary>
    /// Delete a template
    /// </summary>
    /// <param name="id">Template ID</param>
    /// <param name="userId">ID of the user deleting the template</param>
    /// <returns>True if deleted successfully, false if not found</returns>
    Task<bool> DeleteTemplateAsync(Guid id, Guid userId);

    /// <summary>
    /// Increment usage count for a template
    /// </summary>
    /// <param name="id">Template ID</param>
    /// <returns>True if updated successfully</returns>
    Task<bool> IncrementUsageCountAsync(Guid id);
}