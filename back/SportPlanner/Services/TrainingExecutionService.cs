using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

public class TrainingExecutionService : ITrainingExecutionService
{
    private readonly AppDbContext _context;

    public TrainingExecutionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TrainingSession> GetExecutionStateAsync(int sessionId)
    {
        var session = await _context.TrainingSessions
            .Include(s => s.SessionConcepts)
                .ThenInclude(sc => sc.SportConcept)
            .Include(s => s.SessionExercises)
                .ThenInclude(se => se.Exercise)
            .Include(s => s.SessionExercises)
                .ThenInclude(se => se.SportConcept)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null) throw new ArgumentException("Session not found");
        return session;
    }

    public async Task<TrainingSession> StartSessionAsync(int sessionId)
    {
        var session = await _context.TrainingSessions
            .Include(s => s.SessionConcepts)
                .ThenInclude(sc => sc.SportConcept)
            .Include(s => s.SessionExercises)
                .ThenInclude(se => se.Exercise)
            .Include(s => s.SessionExercises)
                .ThenInclude(se => se.SportConcept)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null) throw new ArgumentException("Session not found");

        if (session.Status == TrainingSessionStatus.Planned)
        {
            session.Status = TrainingSessionStatus.InProgress;
            session.StartedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        return session;
    }

    public async Task<TrainingSession> FinishSessionAsync(int sessionId, int? rating, string? notes, List<string>? comments)
    {
        var session = await _context.TrainingSessions
            .Include(s => s.SessionConcepts)
                .ThenInclude(sc => sc.SportConcept)
            .Include(s => s.SessionExercises)
                .ThenInclude(se => se.Exercise)
            .Include(s => s.SessionExercises)
                .ThenInclude(se => se.SportConcept)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null) throw new ArgumentException("Session not found");

        session.Status = TrainingSessionStatus.Completed;
        session.FinishedAt = DateTime.UtcNow;
        session.FeedbackRating = rating;
        session.FeedbackNotes = notes;
        if (comments != null)
        {
            session.Comments = comments;
        }

        await _context.SaveChangesAsync();
        return session;
    }

    public async Task<TrainingSessionExercise> CompleteExerciseAsync(int sessionExerciseId, int durationMinutes, string? notes)
    {
        var exercise = await _context.TrainingSessionExercises.FindAsync(sessionExerciseId);
        if (exercise == null) throw new ArgumentException("Exercise not found");

        exercise.IsCompleted = true;
        exercise.ActualDurationMinutes = durationMinutes;
        exercise.FeedbackNotes = notes;

        await _context.SaveChangesAsync();
        return exercise;
    }
}
