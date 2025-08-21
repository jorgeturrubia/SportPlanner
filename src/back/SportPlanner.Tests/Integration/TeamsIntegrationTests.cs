using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SportPlanner.Api.Data;
using SportPlanner.Api.Dtos;
using SportPlanner.Api.Models;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace SportPlanner.Tests.Integration;

public class TeamsIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly Guid _userId = Guid.NewGuid();

    public TeamsIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Testing");
            
            builder.ConfigureServices(services =>
            {
                // Remove the existing DbContext registration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<SportPlannerDbContext>));
                if (descriptor != null)
                    services.Remove(descriptor);

                // Add in-memory database for testing
                services.AddDbContext<SportPlannerDbContext>(options =>
                {
                    options.UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString());
                });
            });
        });

        _client = _factory.CreateClient();
        
        // Setup authentication (mock JWT token)
        var token = CreateMockJwtToken(_userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    [Fact]
    public async Task GetTeams_WithoutTeams_ShouldReturnEmptyList()
    {
        // Act
        var response = await _client.GetAsync("/api/teams");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var teams = await response.Content.ReadFromJsonAsync<List<TeamResponseDto>>();
        teams.Should().NotBeNull();
        teams.Should().BeEmpty();
        
        response.Headers.GetValues("X-Total-Count").First().Should().Be("0");
    }

    [Fact]
    public async Task GetTeams_WithTeams_ShouldReturnTeamsList()
    {
        // Arrange
        await SeedTestDataAsync();

        // Act
        var response = await _client.GetAsync("/api/teams");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var teams = await response.Content.ReadFromJsonAsync<List<TeamResponseDto>>();
        teams.Should().NotBeNull();
        teams.Should().HaveCount(1);
        teams![0].Name.Should().Be("Test Team");
    }

    [Fact]
    public async Task GetTeams_WithPagination_ShouldReturnPaginatedResults()
    {
        // Arrange
        await SeedMultipleTeamsAsync(5);

        // Act
        var response = await _client.GetAsync("/api/teams?page=1&pageSize=2");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var teams = await response.Content.ReadFromJsonAsync<List<TeamResponseDto>>();
        teams.Should().NotBeNull();
        teams.Should().HaveCount(2);
        
        response.Headers.GetValues("X-Total-Count").First().Should().Be("5");
        response.Headers.GetValues("X-Page-Number").First().Should().Be("1");
    }

    [Fact]
    public async Task GetTeams_WithSearchFilter_ShouldReturnFilteredResults()
    {
        // Arrange
        await SeedMultipleTeamsAsync(3);

        // Act
        var response = await _client.GetAsync("/api/teams?search=Team 1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var teams = await response.Content.ReadFromJsonAsync<List<TeamResponseDto>>();
        teams.Should().NotBeNull();
        teams.Should().HaveCount(1);
        teams![0].Name.Should().Be("Team 1");
    }

    [Fact]
    public async Task GetTeam_WithValidId_ShouldReturnTeam()
    {
        // Arrange
        var teamId = await SeedTestDataAsync();

        // Act
        var response = await _client.GetAsync($"/api/teams/{teamId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var team = await response.Content.ReadFromJsonAsync<TeamResponseDto>();
        team.Should().NotBeNull();
        team!.Id.Should().Be(teamId);
        team.Name.Should().Be("Test Team");
    }

    [Fact]
    public async Task GetTeam_WithInvalidId_ShouldReturnNotFound()
    {
        // Act
        var response = await _client.GetAsync($"/api/teams/{Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateTeam_WithValidData_ShouldCreateTeam()
    {
        // Arrange
        var sport = await GetFootballSportAsync();
        var createDto = new CreateTeamDto
        {
            Name = "New Test Team",
            SportId = sport.Id,
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A",
            Description = "Test team description",
            MaxPlayers = 22
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/teams", createDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var team = await response.Content.ReadFromJsonAsync<TeamResponseDto>();
        team.Should().NotBeNull();
        team!.Name.Should().Be("New Test Team");
        team.Sport.Name.Should().Be("Fútbol");
        team.Category.Should().Be("Sub-16");
        team.Gender.Should().Be("Masculino");
        team.Level.Should().Be("A");
        team.MaxPlayers.Should().Be(22);
        
        response.Headers.Location.Should().NotBeNull();
    }

    [Fact]
    public async Task CreateTeam_WithInvalidSport_ShouldReturnBadRequest()
    {
        // Arrange
        var createDto = new CreateTeamDto
        {
            Name = "Invalid Team",
            SportId = Guid.NewGuid(), // Non-existent sport
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/teams", createDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task CreateTeam_WhenLimitReached_ShouldReturnBadRequest()
    {
        // Arrange - Create a team first (assuming free tier limit is 1)
        await SeedTestDataAsync();
        
        var sport = await GetFootballSportAsync();
        var createDto = new CreateTeamDto
        {
            Name = "Second Team",
            SportId = sport.Id,
            Category = "Sub-18",
            Gender = "Masculino",
            Level = "B"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/teams", createDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.Content.ReadAsStringAsync();
        error.Should().Contain("límite de equipos");
    }

    [Fact]
    public async Task UpdateTeam_WithValidData_ShouldUpdateTeam()
    {
        // Arrange
        var teamId = await SeedTestDataAsync();
        var updateDto = new UpdateTeamDto
        {
            Name = "Updated Team Name",
            Category = "Sub-18",
            MaxPlayers = 24
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/teams/{teamId}", updateDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var team = await response.Content.ReadFromJsonAsync<TeamResponseDto>();
        team.Should().NotBeNull();
        team!.Name.Should().Be("Updated Team Name");
        team.Category.Should().Be("Sub-18");
        team.MaxPlayers.Should().Be(24);
    }

    [Fact]
    public async Task UpdateTeam_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var updateDto = new UpdateTeamDto { Name = "Updated Name" };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/teams/{Guid.NewGuid()}", updateDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteTeam_WithValidId_ShouldDeleteTeam()
    {
        // Arrange
        var teamId = await SeedTestDataAsync();

        // Act
        var response = await _client.DeleteAsync($"/api/teams/{teamId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        
        // Verify team is deleted
        var getResponse = await _client.GetAsync($"/api/teams/{teamId}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteTeam_WithInvalidId_ShouldReturnNotFound()
    {
        // Act
        var response = await _client.DeleteAsync($"/api/teams/{Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CanCreateTeam_WhenNoTeamsExist_ShouldReturnTrue()
    {
        // Act
        var response = await _client.GetAsync("/api/teams/can-create");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<object>();
        result.Should().NotBeNull();
        
        var json = JsonSerializer.Serialize(result);
        var canCreateResponse = JsonSerializer.Deserialize<Dictionary<string, bool>>(json);
        canCreateResponse!["canCreate"].Should().BeTrue();
    }

    [Fact]
    public async Task CanCreateTeam_WhenLimitReached_ShouldReturnFalse()
    {
        // Arrange
        await SeedTestDataAsync(); // Creates one team (assuming limit is 1)

        // Act
        var response = await _client.GetAsync("/api/teams/can-create");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<object>();
        result.Should().NotBeNull();
        
        var json = JsonSerializer.Serialize(result);
        var canCreateResponse = JsonSerializer.Deserialize<Dictionary<string, bool>>(json);
        canCreateResponse!["canCreate"].Should().BeFalse();
    }

    [Fact]
    public async Task GetSports_ShouldReturnAvailableSports()
    {
        // Act
        var response = await _client.GetAsync("/api/teams/sports");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var sports = await response.Content.ReadFromJsonAsync<List<SportResponseDto>>();
        sports.Should().NotBeNull();
        sports.Should().HaveCount(5); // Based on seeded data
        sports!.Any(s => s.Name == "Fútbol").Should().BeTrue();
        sports.Any(s => s.Name == "Baloncesto").Should().BeTrue();
    }

    private async Task<Guid> SeedTestDataAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<SportPlannerDbContext>();
        
        var football = await context.Sports.FirstAsync(s => s.Name == "Fútbol");
        
        var team = new Team
        {
            Name = "Test Team",
            SportId = football.Id,
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A",
            Description = "Test description",
            MaxPlayers = 20,
            CreatedByUserId = _userId
        };

        context.Teams.Add(team);
        await context.SaveChangesAsync();
        
        return team.Id;
    }

    private async Task SeedMultipleTeamsAsync(int count)
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<SportPlannerDbContext>();
        
        var football = await context.Sports.FirstAsync(s => s.Name == "Fútbol");
        
        for (int i = 1; i <= count; i++)
        {
            var team = new Team
            {
                Name = $"Team {i}",
                SportId = football.Id,
                Category = "Sub-16",
                Gender = "Masculino",
                Level = "A",
                CreatedByUserId = _userId
            };
            
            context.Teams.Add(team);
        }
        
        await context.SaveChangesAsync();
    }

    private async Task<Sport> GetFootballSportAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<SportPlannerDbContext>();
        return await context.Sports.FirstAsync(s => s.Name == "Fútbol");
    }

    private static string CreateMockJwtToken(Guid userId)
    {
        // This is a simplified mock token for testing
        // In real scenarios, you'd create a proper JWT token
        var claims = new[]
        {
            new Claim("sub", userId.ToString()),
            new Claim("email", "test@example.com")
        };
        
        var payload = Convert.ToBase64String(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new
        {
            sub = userId.ToString(),
            email = "test@example.com",
            exp = DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds()
        })));
        
        return $"header.{payload}.signature";
    }
}