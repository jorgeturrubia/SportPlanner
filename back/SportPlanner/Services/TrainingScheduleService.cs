using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

public class TrainingScheduleService : ITrainingScheduleService
{
    private readonly AppDbContext _db;

    public TrainingScheduleService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<TrainingSchedule> CreateAsync(TrainingScheduleCreateDto dto, int teamId)
    {
        var schedule = new TrainingSchedule
        {
            Name = dto.Name,
            TeamId = teamId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate
        };

        var seenDays = new HashSet<DayOfWeek>();
        foreach (var dayDto in dto.ScheduleDays)
        {
            if (!Enum.TryParse<DayOfWeek>(dayDto.DayOfWeek, true, out var dow))
                throw new ArgumentException("Invalid DayOfWeek");

            var start = TimeSpan.Parse(dayDto.StartTime);
            TimeSpan? end = null;
            if (!string.IsNullOrEmpty(dayDto.EndTime)) end = TimeSpan.Parse(dayDto.EndTime);

            if (seenDays.Contains(dow)) throw new ArgumentException($"Duplicate day: {dow}");
            seenDays.Add(dow);
            schedule.ScheduleDays.Add(new TrainingScheduleDay
            {
                DayOfWeek = dow,
                StartTime = start,
                EndTime = end,
                CourtId = dayDto.CourtId
            });
        }

        // add plan concepts (just join records)
        var distinctIds = dto.PlanConceptIds.Distinct().ToList();
        if (distinctIds.Count != dto.PlanConceptIds.Count)
        {
            // duplicates found
        }
        foreach (var scId in distinctIds)
        {
            var exists = await _db.SportConcepts.AnyAsync(s => s.Id == scId);
            if (!exists)
                throw new ArgumentException($"SportConcept {scId} does not exist");
            schedule.PlanConcepts.Add(new PlanConcept { SportConceptId = scId });
        }

        _db.TrainingSchedules.Add(schedule);
        await _db.SaveChangesAsync();
        return schedule;
    }

    public async Task<List<DateTime>> GenerateOccurrencesAsync(int scheduleId, DateTime from, DateTime to)
    {
        var schedule = await _db.TrainingSchedules
            .Include(s => s.ScheduleDays)
            .FirstOrDefaultAsync(s => s.Id == scheduleId);
        if (schedule == null) throw new ArgumentException("Schedule not found");

        var occurrences = new List<DateTime>();

        var start = MaxDate(schedule.StartDate, from.Date);
        var end = MinDate(schedule.EndDate, to.Date);
        if (end < start) return occurrences;

        var diff = (end - start).Days;
        for (var i = 0; i <= diff; i++)
        {
            var current = start.AddDays(i);
            foreach (var day in schedule.ScheduleDays)
            {
                if (current.DayOfWeek == day.DayOfWeek)
                {
                    occurrences.Add(current.Date + day.StartTime);
                }
            }
        }

        return occurrences.OrderBy(o => o).ToList();
    }

    public async Task<TrainingSchedule?> GetByIdAsync(int scheduleId)
    {
        return await _db.TrainingSchedules
            .Include(s => s.ScheduleDays)
            .Include(s => s.PlanConcepts)
                .ThenInclude(pc => pc.SportConcept)
            .FirstOrDefaultAsync(s => s.Id == scheduleId);
    }

    private static DateTime MaxDate(DateTime a, DateTime b) => a > b ? a : b;
    private static DateTime MinDate(DateTime a, DateTime b) => a < b ? a : b;
}
