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

    public async Task<TrainingSession> CreateAsync(TrainingSessionCreateDto dto)
    {
        var session = new TrainingSession
        {
            TrainingScheduleId = dto.TrainingScheduleId,
            StartAt = dto.StartAt,
            Duration = dto.Duration,
            CourtId = dto.CourtId
        };

        if (dto.SessionConcepts != null)
        {
            foreach (var sc in dto.SessionConcepts.OrderBy(x => x.Order))
            {
                session.SessionConcepts.Add(new SessionConcept
                {
                    SportConceptId = sc.SportConceptId,
                    Order = sc.Order,
                    PlannedDurationMinutes = sc.PlannedDurationMinutes,
                    Notes = sc.Notes
                });
            }
        }

        _db.TrainingSessions.Add(session);
        await _db.SaveChangesAsync();
        return session;
    }

    public async Task<TrainingSession> CreateFromPlanAsync(int scheduleId, TrainingSessionCreateDto dto)
    {
        // Basic algorithm: pick plan concepts from schedule, filter by phase/difficulty, sort by difficulty asc then weight desc
        var plan = await _db.TrainingSchedules
            .Include(s => s.PlanConcepts)
                .ThenInclude(pc => pc.SportConcept)
                    .ThenInclude(sc => sc.ConceptPhase)
            .Include(s => s.PlanConcepts)
                .ThenInclude(pc => pc.SportConcept)
                    .ThenInclude(sc => sc.DifficultyLevel)
            .FirstOrDefaultAsync(s => s.Id == scheduleId);
        if (plan == null) throw new ArgumentException("Schedule not found");

        var candidates = plan.PlanConcepts
            .Select(pc => pc.SportConcept!)
            .Where(sc => sc != null && sc.IsActive)
            .ToList();

        if (!string.IsNullOrEmpty(dto.Phase))
        {
            var phaseLower = dto.Phase!.ToLowerInvariant();
            candidates = candidates.Where(sc => sc.ConceptPhase == null || (sc.ConceptPhase.Name != null && sc.ConceptPhase.Name.ToLower() == phaseLower)).ToList();
        }

        if (dto.MaxDifficultyLevelId.HasValue)
        {
            var maxRank = (await _db.DifficultyLevels.FindAsync(dto.MaxDifficultyLevelId.Value))?.Rank ?? int.MaxValue;
            candidates = candidates.Where(sc => sc.DifficultyLevel == null || sc.DifficultyLevel!.Rank <= maxRank).ToList();
        }

        // sort: Difficulty Rank asc (easier first), ProgressWeight desc
        candidates = candidates.OrderBy(sc => sc.DifficultyLevel?.Rank ?? int.MaxValue).ThenByDescending(sc => sc.ProgressWeight).ToList();

        int available = dto.AvailableTimeMinutes ?? (int)dto.Duration.TotalMinutes;
        int order = 1;
        var session = new TrainingSession { TrainingScheduleId = scheduleId, StartAt = dto.StartAt, Duration = dto.Duration, CourtId = dto.CourtId };

        foreach (var c in candidates)
        {
            if (available <= 0) break;
            // choose default planned duration 10 minutes if missing
            int planned = c.IsActive ? 10 : 10;
            if (planned <= 0) continue;
            if (planned > available && available < 5) break; // do not add if not enough time

            var actual = planned > available ? available : planned;
            session.SessionConcepts.Add(new SessionConcept { SportConceptId = c.Id, Order = order++, PlannedDurationMinutes = actual });
            available -= actual;
        }

        _db.TrainingSessions.Add(session);
        await _db.SaveChangesAsync();
        return session;
    }

    public async Task<TrainingSession?> GetByIdAsync(int id)
    {
        return await _db.TrainingSessions
            .Include(ts => ts.SessionConcepts)
                .ThenInclude(sc => sc.SportConcept)
            .FirstOrDefaultAsync(ts => ts.Id == id);
    }
}
