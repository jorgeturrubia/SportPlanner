using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Services;

public interface ITrainingSessionService
{
    Task<TrainingSession> CreateAsync(TrainingSessionCreateDto dto);
    Task<TrainingSession> CreateFromPlanAsync(int scheduleId, TrainingSessionCreateDto dto);
    Task<TrainingSession?> GetByIdAsync(int id);
}
