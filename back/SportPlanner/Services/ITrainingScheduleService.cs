using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Services;

public interface ITrainingScheduleService
{
    Task<TrainingSchedule> CreateAsync(TrainingScheduleCreateDto dto, int teamId);
    Task<List<DateTime>> GenerateOccurrencesAsync(int scheduleId, DateTime from, DateTime to);
    Task<TrainingSchedule?> GetByIdAsync(int scheduleId);
}
