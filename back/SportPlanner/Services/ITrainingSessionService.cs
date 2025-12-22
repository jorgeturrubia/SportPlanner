using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Services;

public interface ITrainingSessionService
{
    Task<List<TrainingSession>> GetByTeamAsync(int teamId);
    Task<TrainingSession?> GetByIdAsync(int id);
    Task<TrainingSession> CreateAsync(CreateTrainingSessionDto dto);
    Task<TrainingSession> UpdateAsync(int id, CreateTrainingSessionDto dto);
    Task DeleteAsync(int id);
}
