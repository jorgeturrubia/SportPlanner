using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Services;
using SportPlanner.Application.DTOs;
using Xunit;
using System.Threading.Tasks;
using System;

namespace SportPlanner.Tests.Services;

public class ConceptInterpretationServiceTests
{
    private AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task ResolveForTeam_PicksCorrectPrecedence()
    {
        using var db = CreateDbContext();
        var team = new Team { Name = "TeamX" };
        db.Teams.Add(team);
        await db.SaveChangesAsync();

        var concept = new SportConcept { Name = "Cambio" };
        db.SportConcepts.Add(concept);
        await db.SaveChangesAsync();

        var svc = new ConceptInterpretationService(db);
        // Add interpretation for TeamCategory
        var cat = new TeamCategory { Name = "U10" };
        db.TeamCategories.Add(cat);
        await db.SaveChangesAsync();

        var ciCat = new ConceptInterpretationCreateDto { SportConceptId = concept.Id, TeamCategoryId = cat.Id, DurationMultiplier = 1.2m };
        await svc.CreateAsync(ciCat);

        // Team has no category-> no match
        var result1 = await svc.ResolveForTeamAsync(concept.Id, team.Id);
        Assert.Null(result1);

        // Assign category and then resolve
        team.TeamCategoryId = cat.Id;
        db.Teams.Update(team);
        await db.SaveChangesAsync();

        var result2 = await svc.ResolveForTeamAsync(concept.Id, team.Id);
        Assert.NotNull(result2);
        Assert.Equal(1.2m, result2.DurationMultiplier);
    }
}
