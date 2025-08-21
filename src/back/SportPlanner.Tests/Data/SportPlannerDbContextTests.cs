using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Api.Data;
using SportPlanner.Api.Models;

namespace SportPlanner.Tests.Data;

public class SportPlannerDbContextTests : IDisposable
{
    private readonly SportPlannerDbContext _context;

    public SportPlannerDbContextTests()
    {
        var options = new DbContextOptionsBuilder<SportPlannerDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        
        _context = new SportPlannerDbContext(options);
        _context.Database.EnsureCreated();
    }

    [Fact]
    public void DbContext_ShouldHaveCorrectDbSets()
    {
        // Assert
        _context.Sports.Should().NotBeNull();
        _context.Teams.Should().NotBeNull();
        _context.TeamMembers.Should().NotBeNull();
    }

    [Fact]
    public async Task DbContext_ShouldSeedDefaultSports()
    {
        // Act
        var sports = await _context.Sports.ToListAsync();

        // Assert
        sports.Should().NotBeEmpty();
        sports.Should().HaveCount(5);
        
        var football = sports.FirstOrDefault(s => s.Name == "Fútbol");
        football.Should().NotBeNull();
        football!.Category.Should().Be("Deportes de Equipo");
        football.DefaultMaxPlayers.Should().Be(25);
        
        var basketball = sports.FirstOrDefault(s => s.Name == "Baloncesto");
        basketball.Should().NotBeNull();
        basketball!.DefaultMaxPlayers.Should().Be(15);
        
        var tennis = sports.FirstOrDefault(s => s.Name == "Tenis");
        tennis.Should().NotBeNull();
        tennis!.Category.Should().Be("Deportes Individuales");
    }

    [Fact]
    public async Task DbContext_ShouldEnforceTeamNameUniquenessPerUser()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var sport = await _context.Sports.FirstAsync();
        
        var team1 = new Team
        {
            Name = "Team A",
            SportId = sport.Id,
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A",
            CreatedByUserId = userId
        };
        
        var team2 = new Team
        {
            Name = "Team A", // Same name, same user - should fail
            SportId = sport.Id,
            Category = "Sub-18",
            Gender = "Masculino", 
            Level = "B",
            CreatedByUserId = userId
        };

        // Act
        _context.Teams.Add(team1);
        await _context.SaveChangesAsync();
        
        _context.Teams.Add(team2);
        var saveAction = async () => await _context.SaveChangesAsync();

        // Assert
        await saveAction.Should().ThrowAsync<Exception>();
    }

    [Fact]
    public async Task DbContext_ShouldAllowSameTeamNameForDifferentUsers()
    {
        // Arrange
        var userId1 = Guid.NewGuid();
        var userId2 = Guid.NewGuid();
        var sport = await _context.Sports.FirstAsync();
        
        var team1 = new Team
        {
            Name = "Team A",
            SportId = sport.Id,
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A",
            CreatedByUserId = userId1
        };
        
        var team2 = new Team
        {
            Name = "Team A", // Same name, different user - should succeed
            SportId = sport.Id,
            Category = "Sub-18",
            Gender = "Masculino",
            Level = "B",
            CreatedByUserId = userId2
        };

        // Act
        _context.Teams.Add(team1);
        _context.Teams.Add(team2);
        await _context.SaveChangesAsync();

        // Assert
        var teams = await _context.Teams.ToListAsync();
        teams.Should().HaveCount(2);
        teams.All(t => t.Name == "Team A").Should().BeTrue();
    }

    [Fact]
    public async Task DbContext_ShouldEnforceTeamMemberUniquenessPerTeam()
    {
        // Arrange
        var sport = await _context.Sports.FirstAsync();
        var team = new Team
        {
            Name = "Test Team",
            SportId = sport.Id,
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A",
            CreatedByUserId = Guid.NewGuid()
        };
        
        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        var userId = Guid.NewGuid();
        var member1 = new TeamMember
        {
            TeamId = team.Id,
            UserId = userId,
            UserName = "John Doe",
            UserEmail = "john@example.com",
            Role = TeamMemberRole.Player
        };
        
        var member2 = new TeamMember
        {
            TeamId = team.Id,
            UserId = userId, // Same user, same team - should fail
            UserName = "John Doe",
            UserEmail = "john@example.com",
            Role = TeamMemberRole.Coach
        };

        // Act
        _context.TeamMembers.Add(member1);
        await _context.SaveChangesAsync();
        
        _context.TeamMembers.Add(member2);
        var saveAction = async () => await _context.SaveChangesAsync();

        // Assert
        await saveAction.Should().ThrowAsync<Exception>();
    }

    [Fact]
    public async Task DbContext_ShouldEnforceJerseyNumberUniquenessPerTeam()
    {
        // Arrange
        var sport = await _context.Sports.FirstAsync();
        var team = new Team
        {
            Name = "Test Team",
            SportId = sport.Id,
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A",
            CreatedByUserId = Guid.NewGuid()
        };
        
        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        var member1 = new TeamMember
        {
            TeamId = team.Id,
            UserId = Guid.NewGuid(),
            UserName = "John Doe",
            UserEmail = "john@example.com",
            Role = TeamMemberRole.Player,
            JerseyNumber = "10"
        };
        
        var member2 = new TeamMember
        {
            TeamId = team.Id,
            UserId = Guid.NewGuid(),
            UserName = "Jane Smith",
            UserEmail = "jane@example.com",
            Role = TeamMemberRole.Player,
            JerseyNumber = "10" // Same jersey number - should fail
        };

        // Act
        _context.TeamMembers.Add(member1);
        await _context.SaveChangesAsync();
        
        _context.TeamMembers.Add(member2);
        var saveAction = async () => await _context.SaveChangesAsync();

        // Assert
        await saveAction.Should().ThrowAsync<Exception>();
    }

    [Fact]
    public async Task DbContext_ShouldAllowNullJerseyNumbers()
    {
        // Arrange
        var sport = await _context.Sports.FirstAsync();
        var team = new Team
        {
            Name = "Test Team",
            SportId = sport.Id,
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A",
            CreatedByUserId = Guid.NewGuid()
        };
        
        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        var member1 = new TeamMember
        {
            TeamId = team.Id,
            UserId = Guid.NewGuid(),
            UserName = "John Doe",
            UserEmail = "john@example.com",
            Role = TeamMemberRole.Coach,
            JerseyNumber = null
        };
        
        var member2 = new TeamMember
        {
            TeamId = team.Id,
            UserId = Guid.NewGuid(),
            UserName = "Jane Smith",
            UserEmail = "jane@example.com",
            Role = TeamMemberRole.AssistantCoach,
            JerseyNumber = null
        };

        // Act
        _context.TeamMembers.Add(member1);
        _context.TeamMembers.Add(member2);
        await _context.SaveChangesAsync();

        // Assert
        var members = await _context.TeamMembers.ToListAsync();
        members.Should().HaveCount(2);
        members.All(m => m.JerseyNumber == null).Should().BeTrue();
    }

    [Fact]
    public async Task DbContext_ShouldCascadeDeleteTeamMembers()
    {
        // Arrange
        var sport = await _context.Sports.FirstAsync();
        var team = new Team
        {
            Name = "Test Team",
            SportId = sport.Id,
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A",
            CreatedByUserId = Guid.NewGuid()
        };
        
        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        var member = new TeamMember
        {
            TeamId = team.Id,
            UserId = Guid.NewGuid(),
            UserName = "John Doe",
            UserEmail = "john@example.com",
            Role = TeamMemberRole.Player
        };
        
        _context.TeamMembers.Add(member);
        await _context.SaveChangesAsync();

        // Act
        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();

        // Assert
        var remainingMembers = await _context.TeamMembers.ToListAsync();
        remainingMembers.Should().BeEmpty();
    }

    [Fact]
    public async Task DbContext_ShouldRestrictSportDeletion()
    {
        // Arrange
        var sport = await _context.Sports.FirstAsync();
        var team = new Team
        {
            Name = "Test Team",
            SportId = sport.Id,
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A",
            CreatedByUserId = Guid.NewGuid()
        };
        
        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        // Act
        _context.Sports.Remove(sport);
        var saveAction = async () => await _context.SaveChangesAsync();

        // Assert
        await saveAction.Should().ThrowAsync<Exception>();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}