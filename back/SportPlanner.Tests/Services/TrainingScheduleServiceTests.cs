using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Services;
using Xunit;

namespace SportPlanner.Tests.Services;

public class TrainingScheduleServiceTests
{
    private AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task GenerateOccurrences_ReturnsExpectedDates()
    {
        using var db = CreateDbContext();
        var service = new TrainingScheduleService(db);

        var team = new Team { Name = "Team A" };
        db.Teams.Add(team);
        await db.SaveChangesAsync();

        var schedule = new TrainingSchedule
        {
            TeamId = team.Id,
            StartDate = new DateTime(2025, 9, 1),
            EndDate = new DateTime(2025, 9, 14)
        };
        schedule.ScheduleDays.Add(new TrainingScheduleDay { DayOfWeek = DayOfWeek.Monday, StartTime = TimeSpan.FromHours(18)});
        schedule.ScheduleDays.Add(new TrainingScheduleDay { DayOfWeek = DayOfWeek.Wednesday, StartTime = TimeSpan.FromHours(18)});
        db.TrainingSchedules.Add(schedule);
        await db.SaveChangesAsync();

        var from = new DateTime(2025, 9, 1);
        var to = new DateTime(2025, 9, 14);
        var occurrences = await service.GenerateOccurrencesAsync(schedule.Id, from, to);

        Assert.True(occurrences.Count >= 4); // 2 weeks * 2 days
        Assert.Contains(occurrences, dt => dt.DayOfWeek == DayOfWeek.Monday);
        Assert.Contains(occurrences, dt => dt.DayOfWeek == DayOfWeek.Wednesday);
    }
}
