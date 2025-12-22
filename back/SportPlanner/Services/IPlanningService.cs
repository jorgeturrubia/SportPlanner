using SportPlanner.Application.DTOs.Planning;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SportPlanner.Services
{
    public interface IPlanningService
    {
        Task<IEnumerable<PlanningDto>> GetAllAsync();
        Task<PlanningDto?> GetByIdAsync(int id);
        Task<PlanningDto> CreateAsync(CreatePlanningDto createPlanningDto);
        Task<PlanningDto?> UpdateAsync(int id, UpdatePlanningDto updatePlanningDto);
        Task<bool> DeleteAsync(int id);
        Task<PlanMonitorDto?> GetPlanMonitorAsync(int planningId);
    }
}
