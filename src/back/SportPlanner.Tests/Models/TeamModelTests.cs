using FluentAssertions;
using SportPlanner.Api.Models;

namespace SportPlanner.Tests.Models;

public class TeamModelTests
{
    [Fact]
    public void Team_ShouldInitializeWithDefaultValues()
    {
        // Act
        var team = new Team();

        // Assert
        team.Id.Should().NotBeEmpty();
        team.Name.Should().BeEmpty();
        team.Category.Should().BeEmpty();
        team.Gender.Should().BeEmpty();
        team.Level.Should().BeEmpty();
        team.MaxPlayers.Should().Be(20);
        team.Status.Should().Be(TeamStatus.Active);
        team.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));
        team.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));
        team.TeamMembers.Should().BeEmpty();
    }

    [Fact]
    public void Team_ShouldSetPropertiesCorrectly()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        var sportId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var name = "Real Madrid Sub-16";
        var category = "Sub-16";
        var gender = "Masculino";
        var level = "A";
        var description = "Equipo de fútbol juvenil";
        var maxPlayers = 25;
        var status = TeamStatus.Active;

        // Act
        var team = new Team
        {
            Id = teamId,
            Name = name,
            SportId = sportId,
            Category = category,
            Gender = gender,
            Level = level,
            Description = description,
            MaxPlayers = maxPlayers,
            Status = status,
            CreatedByUserId = userId
        };

        // Assert
        team.Id.Should().Be(teamId);
        team.Name.Should().Be(name);
        team.SportId.Should().Be(sportId);
        team.Category.Should().Be(category);
        team.Gender.Should().Be(gender);
        team.Level.Should().Be(level);
        team.Description.Should().Be(description);
        team.MaxPlayers.Should().Be(maxPlayers);
        team.Status.Should().Be(status);
        team.CreatedByUserId.Should().Be(userId);
    }

    [Theory]
    [InlineData(TeamStatus.Active)]
    [InlineData(TeamStatus.Inactive)]
    [InlineData(TeamStatus.Suspended)]
    [InlineData(TeamStatus.Archived)]
    public void Team_ShouldAcceptAllValidStatuses(TeamStatus status)
    {
        // Arrange & Act
        var team = new Team { Status = status };

        // Assert
        team.Status.Should().Be(status);
    }

    [Fact]
    public void Team_ShouldMaintainTeamMembersCollection()
    {
        // Arrange
        var team = new Team();
        var member1 = new TeamMember { Id = Guid.NewGuid() };
        var member2 = new TeamMember { Id = Guid.NewGuid() };

        // Act
        team.TeamMembers.Add(member1);
        team.TeamMembers.Add(member2);

        // Assert
        team.TeamMembers.Should().HaveCount(2);
        team.TeamMembers.Should().Contain(member1);
        team.TeamMembers.Should().Contain(member2);
    }
}

public class SportModelTests
{
    [Fact]
    public void Sport_ShouldInitializeWithDefaultValues()
    {
        // Act
        var sport = new Sport();

        // Assert
        sport.Id.Should().NotBeEmpty();
        sport.Name.Should().BeEmpty();
        sport.Category.Should().BeEmpty();
        sport.DefaultMaxPlayers.Should().Be(20);
        sport.IsActive.Should().BeTrue();
        sport.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));
        sport.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));
        sport.Teams.Should().BeEmpty();
    }

    [Fact]
    public void Sport_ShouldSetPropertiesCorrectly()
    {
        // Arrange
        var sportId = Guid.NewGuid();
        var name = "Fútbol";
        var description = "Deporte rey";
        var category = "Deportes de Equipo";
        var defaultMaxPlayers = 25;

        // Act
        var sport = new Sport
        {
            Id = sportId,
            Name = name,
            Description = description,
            Category = category,
            DefaultMaxPlayers = defaultMaxPlayers,
            IsActive = false
        };

        // Assert
        sport.Id.Should().Be(sportId);
        sport.Name.Should().Be(name);
        sport.Description.Should().Be(description);
        sport.Category.Should().Be(category);
        sport.DefaultMaxPlayers.Should().Be(defaultMaxPlayers);
        sport.IsActive.Should().BeFalse();
    }

    [Fact]
    public void Sport_ShouldMaintainTeamsCollection()
    {
        // Arrange
        var sport = new Sport();
        var team1 = new Team { Id = Guid.NewGuid() };
        var team2 = new Team { Id = Guid.NewGuid() };

        // Act
        sport.Teams.Add(team1);
        sport.Teams.Add(team2);

        // Assert
        sport.Teams.Should().HaveCount(2);
        sport.Teams.Should().Contain(team1);
        sport.Teams.Should().Contain(team2);
    }
}

public class TeamMemberModelTests
{
    [Fact]
    public void TeamMember_ShouldInitializeWithDefaultValues()
    {
        // Act
        var teamMember = new TeamMember();

        // Assert
        teamMember.Id.Should().NotBeEmpty();
        teamMember.UserName.Should().BeEmpty();
        teamMember.UserEmail.Should().BeEmpty();
        teamMember.Role.Should().Be(TeamMemberRole.Player);
        teamMember.Status.Should().Be(TeamMemberStatus.Active);
        teamMember.JoinedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));
        teamMember.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));
    }

    [Fact]
    public void TeamMember_ShouldSetPropertiesCorrectly()
    {
        // Arrange
        var memberId = Guid.NewGuid();
        var teamId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var userName = "Juan Pérez";
        var userEmail = "juan@example.com";
        var role = TeamMemberRole.Coach;
        var jerseyNumber = "10";
        var position = "Delantero";
        var status = TeamMemberStatus.Active;
        var notes = "Jugador estrella";

        // Act
        var teamMember = new TeamMember
        {
            Id = memberId,
            TeamId = teamId,
            UserId = userId,
            UserName = userName,
            UserEmail = userEmail,
            Role = role,
            JerseyNumber = jerseyNumber,
            Position = position,
            Status = status,
            Notes = notes
        };

        // Assert
        teamMember.Id.Should().Be(memberId);
        teamMember.TeamId.Should().Be(teamId);
        teamMember.UserId.Should().Be(userId);
        teamMember.UserName.Should().Be(userName);
        teamMember.UserEmail.Should().Be(userEmail);
        teamMember.Role.Should().Be(role);
        teamMember.JerseyNumber.Should().Be(jerseyNumber);
        teamMember.Position.Should().Be(position);
        teamMember.Status.Should().Be(status);
        teamMember.Notes.Should().Be(notes);
    }

    [Theory]
    [InlineData(TeamMemberRole.Player)]
    [InlineData(TeamMemberRole.Coach)]
    [InlineData(TeamMemberRole.AssistantCoach)]
    [InlineData(TeamMemberRole.Manager)]
    public void TeamMember_ShouldAcceptAllValidRoles(TeamMemberRole role)
    {
        // Arrange & Act
        var teamMember = new TeamMember { Role = role };

        // Assert
        teamMember.Role.Should().Be(role);
    }

    [Theory]
    [InlineData(TeamMemberStatus.Active)]
    [InlineData(TeamMemberStatus.Inactive)]
    [InlineData(TeamMemberStatus.Suspended)]
    [InlineData(TeamMemberStatus.Removed)]
    public void TeamMember_ShouldAcceptAllValidStatuses(TeamMemberStatus status)
    {
        // Arrange & Act
        var teamMember = new TeamMember { Status = status };

        // Assert
        teamMember.Status.Should().Be(status);
    }
}