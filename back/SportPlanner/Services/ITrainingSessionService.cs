using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Services;

public interface ITrainingSessionService
{
    Task<List<TrainingSession>> GetByTeamAsync(int teamId);
    Task<List<TrainingSession>> GetByDateRangeAsync(int teamId, DateTime start, DateTime end);
    Task<TrainingSession?> GetByIdAsync(int id);
    Task<TrainingSession> CreateAsync(CreateTrainingSessionDto dto);
    Task<TrainingSession> UpdateAsync(int id, CreateTrainingSessionDto dto);
    Task DeleteAsync(int id);
}
