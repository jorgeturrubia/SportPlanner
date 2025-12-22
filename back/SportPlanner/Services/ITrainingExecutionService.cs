using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Services;

public interface ITrainingExecutionService
{
    Task<TrainingSession> StartSessionAsync(int sessionId);
    Task<TrainingSession> FinishSessionAsync(int sessionId, int? rating, string? notes);
    Task<TrainingSessionExercise> CompleteExerciseAsync(int sessionExerciseId, int durationMinutes, string? notes);
    Task<TrainingSession> GetExecutionStateAsync(int sessionId);
}
