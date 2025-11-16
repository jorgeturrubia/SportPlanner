using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Services;
using SportPlanner.Application.DTOs;
using Xunit;

namespace SportPlanner.Tests.Services;

public class TrainingSessionServiceTests
{
    private AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateFromPlan_PicksEasiestFirst()
    {
        using var db = CreateDbContext();
        var sessionService = new TrainingSessionService(db);

        var schedule = new TrainingSchedule { StartDate = DateTime.UtcNow.Date, EndDate = DateTime.UtcNow.Date.AddDays(30), Team = new Team { Name = "TeamX" } };
        db.TrainingSchedules.Add(schedule);
        await db.SaveChangesAsync();

        var c1 = new SportConcept { Name = "HardSkill", DifficultyLevel = new DifficultyLevel { Name = "Hard", Rank = 4 }, ProgressWeight = 10 };
        var c2 = new SportConcept { Name = "EasySkill", DifficultyLevel = new DifficultyLevel { Name = "Beginner", Rank = 1 }, ProgressWeight = 90 };
        db.SportConcepts.AddRange(c1, c2);
        await db.SaveChangesAsync();

        schedule.PlanConcepts.Add(new PlanConcept { SportConceptId = c1.Id });
        schedule.PlanConcepts.Add(new PlanConcept { SportConceptId = c2.Id });
        await db.SaveChangesAsync();

        var dto = new TrainingSessionCreateDto
        {
            TrainingScheduleId = schedule.Id,
            StartAt = DateTime.UtcNow,
            Duration = TimeSpan.FromMinutes(60),
            AvailableTimeMinutes = 30
        };

        var session = await sessionService.CreateFromPlanAsync(schedule.Id, dto);
        Assert.NotNull(session);
        Assert.True(session.SessionConcepts.Count > 0);
        // Verify that the easiest skill (c2) was picked before c1
        var first = session.SessionConcepts.OrderBy(sc => sc.Order).First();
        Assert.Equal(c2.Id, first.SportConceptId);
    }
}
