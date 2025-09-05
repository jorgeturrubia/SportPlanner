using SportPlanner.Models;
using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public interface IPlanningService
{
    Task<IEnumerable<PlanningDto>> GetUserPlanningsAsync(Guid userId);
    Task<IEnumerable<PlanningDto>> GetFilteredPlanningsAsync(Guid userId, PlanningFilterDto filter);
    Task<PlanningDto?> GetPlanningAsync(string planningId, Guid userId);
    Task<PlanningDto> CreatePlanningAsync(CreatePlanningRequest request, Guid userId);
    Task<PlanningDto> UpdatePlanningAsync(string planningId, UpdatePlanningRequest request, Guid userId);
    Task DeletePlanningAsync(string planningId, Guid userId);
    Task<bool> UserCanAccessPlanningAsync(string planningId, Guid userId);
    Task<int> CalculateTotalSessionsAsync(DateTime startDate, DateTime endDate, List<Models.DayOfWeek> trainingDays);
    Task<PlanningDto> UpdatePlanningStatusAsync(string planningId, PlanningStatus status, Guid userId);
}