using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

public class TrainingSessionService : ITrainingSessionService
{
    private readonly AppDbContext _db;

    public TrainingSessionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<TrainingSession>> GetByTeamAsync(int teamId)
    {
        return await _db.TrainingSessions
            .Where(ts => ts.TeamId == teamId)
            .OrderByDescending(ts => ts.Date)
            .ToListAsync();
    }

    public async Task<TrainingSession?> GetByIdAsync(int id)
    {
        return await _db.TrainingSessions
            .Include(ts => ts.SessionConcepts)
                .ThenInclude(sc => sc.SportConcept)
            .Include(ts => ts.SessionExercises)
                .ThenInclude(se => se.Exercise)
            .Include(ts => ts.SessionExercises)
                .ThenInclude(se => se.SportConcept)
            .FirstOrDefaultAsync(ts => ts.Id == id);
    }

    public async Task<TrainingSession> CreateAsync(CreateTrainingSessionDto dto)
    {
        var session = new TrainingSession
        {
            Name = dto.Name,
            TeamId = dto.TeamId,
            Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc),
            StartTime = dto.StartTime,
            Duration = dto.Duration,
            CourtId = dto.CourtId
        };

        if (dto.SessionConcepts != null)
        {
            foreach (var c in dto.SessionConcepts)
            {
                session.SessionConcepts.Add(new TrainingSessionConcept
                {
                    SportConceptId = c.SportConceptId,
                    Order = c.Order,
                    DurationMinutes = c.DurationMinutes
                });
            }
        }

        if (dto.SessionExercises != null)
        {
            foreach (var e in dto.SessionExercises)
            {
                session.SessionExercises.Add(new TrainingSessionExercise
                {
                    ExerciseId = e.ExerciseId,
                    CustomText = e.CustomText,
                    SportConceptId = e.SportConceptId,
                    Order = e.Order,
                    DurationMinutes = e.DurationMinutes
                });
            }
        }

        _db.TrainingSessions.Add(session);
        await _db.SaveChangesAsync();
        return session;
    }

    public async Task<TrainingSession> UpdateAsync(int id, CreateTrainingSessionDto dto)
    {
        var session = await _db.TrainingSessions
            .Include(ts => ts.SessionConcepts)
            .Include(ts => ts.SessionExercises)
            .FirstOrDefaultAsync(ts => ts.Id == id);

        if (session == null)
            throw new ArgumentException("Session not found");

        session.Name = dto.Name;
        session.Date = dto.Date;
        session.StartTime = dto.StartTime;
        session.Duration = dto.Duration;
        session.CourtId = dto.CourtId;
        session.UpdatedAt = DateTime.UtcNow;

        // Sync Concepts
        _db.TrainingSessionConcepts.RemoveRange(session.SessionConcepts);
        if (dto.SessionConcepts != null)
        {
            foreach (var c in dto.SessionConcepts)
            {
                session.SessionConcepts.Add(new TrainingSessionConcept
                {
                    SportConceptId = c.SportConceptId,
                    Order = c.Order,
                    DurationMinutes = c.DurationMinutes
                });
            }
        }

        // Sync Exercises
        _db.TrainingSessionExercises.RemoveRange(session.SessionExercises);
        if (dto.SessionExercises != null)
        {
            foreach (var e in dto.SessionExercises)
            {
                session.SessionExercises.Add(new TrainingSessionExercise
                {
                    ExerciseId = e.ExerciseId,
                    CustomText = e.CustomText,
                    SportConceptId = e.SportConceptId,
                    Order = e.Order,
                    DurationMinutes = e.DurationMinutes
                });
            }
        }

        await _db.SaveChangesAsync();
        return session;
    }

    public async Task DeleteAsync(int id)
    {
        var session = await _db.TrainingSessions.FindAsync(id);
        if (session != null)
        {
            _db.TrainingSessions.Remove(session);
            await _db.SaveChangesAsync();
        }
    }
}
