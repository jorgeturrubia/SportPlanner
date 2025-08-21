using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SportPlanner.Api.Controllers;
using SportPlanner.Api.Dtos;
using SportPlanner.Api.Exceptions;
using SportPlanner.Api.Models;
using SportPlanner.Api.Services;
using System.Security.Claims;

namespace SportPlanner.Tests.Controllers;

public class TeamsControllerTests
{
    private readonly Mock<ITeamsService> _mockTeamsService;
    private readonly TeamsController _controller;
    private readonly Guid _userId = Guid.NewGuid();

    public TeamsControllerTests()
    {
        _mockTeamsService = new Mock<ITeamsService>();
        _controller = new TeamsController(_mockTeamsService.Object);

        // Setup user context
        var claims = new List<Claim>
        {
            new("sub", _userId.ToString())
        };
        var identity = new ClaimsIdentity(claims, "Test");
        var claimsPrincipal = new ClaimsPrincipal(identity);
        
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };
    }

    [Fact]
    public async Task GetTeams_ShouldReturnTeamsWithPaginationHeaders()
    {
        // Arrange
        var teams = new List<TeamResponseDto>
        {
            new() { Id = Guid.NewGuid(), Name = "Team 1" },
            new() { Id = Guid.NewGuid(), Name = "Team 2" }
        };
        var totalCount = 10;
        
        _mockTeamsService.Setup(s => s.GetTeamsAsync(_userId, 1, 10, null, null, null))
            .ReturnsAsync((teams, totalCount));

        // Act
        var result = await _controller.GetTeams();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedTeams = okResult.Value.Should().BeAssignableTo<IEnumerable<TeamResponseDto>>().Subject;
        returnedTeams.Should().HaveCount(2);
        
        _controller.Response.Headers["X-Total-Count"].Should().Contain(totalCount.ToString());
        _controller.Response.Headers["X-Page-Number"].Should().Contain("1");
    }

    [Fact]
    public async Task GetTeams_WithFilters_ShouldPassFiltersToService()
    {
        // Arrange
        var sportId = Guid.NewGuid();
        var status = TeamStatus.Active;
        var search = "test";
        
        _mockTeamsService.Setup(s => s.GetTeamsAsync(_userId, 2, 20, search, sportId, status))
            .ReturnsAsync((new List<TeamResponseDto>(), 0));

        // Act
        await _controller.GetTeams(2, 20, search, sportId, status);

        // Assert
        _mockTeamsService.Verify(s => s.GetTeamsAsync(_userId, 2, 20, search, sportId, status), Times.Once);
    }

    [Fact]
    public async Task GetTeam_WithValidId_ShouldReturnTeam()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        var team = new TeamResponseDto { Id = teamId, Name = "Test Team" };
        
        _mockTeamsService.Setup(s => s.GetTeamAsync(teamId, _userId))
            .ReturnsAsync(team);

        // Act
        var result = await _controller.GetTeam(teamId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedTeam = okResult.Value.Should().BeOfType<TeamResponseDto>().Subject;
        returnedTeam.Id.Should().Be(teamId);
    }

    [Fact]
    public async Task GetTeam_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        
        _mockTeamsService.Setup(s => s.GetTeamAsync(teamId, _userId))
            .ReturnsAsync((TeamResponseDto?)null);

        // Act
        var result = await _controller.GetTeam(teamId);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task CreateTeam_WithValidDto_ShouldReturnCreatedTeam()
    {
        // Arrange
        var createDto = new CreateTeamDto
        {
            Name = "New Team",
            SportId = Guid.NewGuid(),
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A"
        };
        
        var createdTeam = new TeamResponseDto { Id = Guid.NewGuid(), Name = createDto.Name };
        
        _mockTeamsService.Setup(s => s.CreateTeamAsync(createDto, _userId))
            .ReturnsAsync(createdTeam);

        // Act
        var result = await _controller.CreateTeam(createDto);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        var returnedTeam = createdResult.Value.Should().BeOfType<TeamResponseDto>().Subject;
        returnedTeam.Id.Should().Be(createdTeam.Id);
    }

    [Fact]
    public async Task CreateTeam_WithBusinessException_ShouldReturnBadRequest()
    {
        // Arrange
        var createDto = new CreateTeamDto
        {
            Name = "New Team",
            SportId = Guid.NewGuid(),
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A"
        };
        
        _mockTeamsService.Setup(s => s.CreateTeamAsync(createDto, _userId))
            .ThrowsAsync(new BusinessException("Has alcanzado el límite de equipos"));

        // Act
        var result = await _controller.CreateTeam(createDto);

        // Assert
        var badRequestResult = result.Result.Should().BeOfType<BadRequestObjectResult>().Subject;
        var error = badRequestResult.Value.Should().BeAssignableTo<object>().Subject;
        error.Should().BeEquivalentTo(new { message = "Has alcanzado el límite de equipos" });
    }

    [Fact]
    public async Task CreateTeam_WithValidationException_ShouldReturnBadRequest()
    {
        // Arrange
        var createDto = new CreateTeamDto
        {
            Name = "New Team",
            SportId = Guid.NewGuid(),
            Category = "Sub-16",
            Gender = "Masculino",
            Level = "A"
        };
        
        _mockTeamsService.Setup(s => s.CreateTeamAsync(createDto, _userId))
            .ThrowsAsync(new ValidationException("Ya tienes un equipo con ese nombre"));

        // Act
        var result = await _controller.CreateTeam(createDto);

        // Assert
        var badRequestResult = result.Result.Should().BeOfType<BadRequestObjectResult>().Subject;
        var error = badRequestResult.Value.Should().BeAssignableTo<object>().Subject;
        error.Should().BeEquivalentTo(new { message = "Ya tienes un equipo con ese nombre" });
    }

    [Fact]
    public async Task UpdateTeam_WithValidDto_ShouldReturnUpdatedTeam()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        var updateDto = new UpdateTeamDto { Name = "Updated Team" };
        var updatedTeam = new TeamResponseDto { Id = teamId, Name = "Updated Team" };
        
        _mockTeamsService.Setup(s => s.UpdateTeamAsync(teamId, updateDto, _userId))
            .ReturnsAsync(updatedTeam);

        // Act
        var result = await _controller.UpdateTeam(teamId, updateDto);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedTeam = okResult.Value.Should().BeOfType<TeamResponseDto>().Subject;
        returnedTeam.Name.Should().Be("Updated Team");
    }

    [Fact]
    public async Task UpdateTeam_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        var updateDto = new UpdateTeamDto { Name = "Updated Team" };
        
        _mockTeamsService.Setup(s => s.UpdateTeamAsync(teamId, updateDto, _userId))
            .ReturnsAsync((TeamResponseDto?)null);

        // Act
        var result = await _controller.UpdateTeam(teamId, updateDto);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task DeleteTeam_WithValidId_ShouldReturnNoContent()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        
        _mockTeamsService.Setup(s => s.DeleteTeamAsync(teamId, _userId))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteTeam(teamId);

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task DeleteTeam_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        
        _mockTeamsService.Setup(s => s.DeleteTeamAsync(teamId, _userId))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteTeam(teamId);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task CanCreateTeam_ShouldReturnCanCreateStatus()
    {
        // Arrange
        _mockTeamsService.Setup(s => s.CanCreateTeamAsync(_userId))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.CanCreateTeam();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var response = okResult.Value.Should().BeAssignableTo<object>().Subject;
        response.Should().BeEquivalentTo(new { canCreate = true });
    }

    [Fact]
    public async Task GetSports_ShouldReturnSports()
    {
        // Arrange
        var sports = new List<SportResponseDto>
        {
            new() { Id = Guid.NewGuid(), Name = "Fútbol" },
            new() { Id = Guid.NewGuid(), Name = "Baloncesto" }
        };
        
        _mockTeamsService.Setup(s => s.GetSportsAsync())
            .ReturnsAsync(sports);

        // Act
        var result = await _controller.GetSports();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedSports = okResult.Value.Should().BeAssignableTo<IEnumerable<SportResponseDto>>().Subject;
        returnedSports.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetTeamMembers_WithValidTeamId_ShouldReturnMembers()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        var members = new List<TeamMemberResponseDto>
        {
            new() { Id = Guid.NewGuid(), UserName = "Player 1" },
            new() { Id = Guid.NewGuid(), UserName = "Player 2" }
        };
        
        _mockTeamsService.Setup(s => s.GetTeamMembersAsync(teamId, _userId))
            .ReturnsAsync(members);

        // Act
        var result = await _controller.GetTeamMembers(teamId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedMembers = okResult.Value.Should().BeAssignableTo<IEnumerable<TeamMemberResponseDto>>().Subject;
        returnedMembers.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetTeamMembers_WithInvalidTeamId_ShouldReturnNotFound()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        
        _mockTeamsService.Setup(s => s.GetTeamMembersAsync(teamId, _userId))
            .ThrowsAsync(new NotFoundException("Equipo no encontrado"));

        // Act
        var result = await _controller.GetTeamMembers(teamId);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task AddTeamMember_WithValidDto_ShouldReturnCreatedMember()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        var addMemberDto = new AddTeamMemberDto
        {
            UserId = Guid.NewGuid(),
            UserName = "John Doe",
            UserEmail = "john@example.com",
            Role = TeamMemberRole.Player
        };
        
        var createdMember = new TeamMemberResponseDto
        {
            Id = Guid.NewGuid(),
            UserName = addMemberDto.UserName,
            Role = addMemberDto.Role
        };
        
        _mockTeamsService.Setup(s => s.AddTeamMemberAsync(teamId, addMemberDto, _userId))
            .ReturnsAsync(createdMember);

        // Act
        var result = await _controller.AddTeamMember(teamId, addMemberDto);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        var returnedMember = createdResult.Value.Should().BeOfType<TeamMemberResponseDto>().Subject;
        returnedMember.UserName.Should().Be("John Doe");
    }

    [Fact]
    public async Task AddTeamMember_WithValidationException_ShouldReturnBadRequest()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        var addMemberDto = new AddTeamMemberDto
        {
            UserId = Guid.NewGuid(),
            UserName = "John Doe",
            UserEmail = "john@example.com",
            Role = TeamMemberRole.Player
        };
        
        _mockTeamsService.Setup(s => s.AddTeamMemberAsync(teamId, addMemberDto, _userId))
            .ThrowsAsync(new ValidationException("El usuario ya es miembro del equipo"));

        // Act
        var result = await _controller.AddTeamMember(teamId, addMemberDto);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task UpdateTeamMember_WithValidDto_ShouldReturnUpdatedMember()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        var memberId = Guid.NewGuid();
        var updateMemberDto = new UpdateTeamMemberDto { JerseyNumber = "10" };
        var updatedMember = new TeamMemberResponseDto
        {
            Id = memberId,
            JerseyNumber = "10"
        };
        
        _mockTeamsService.Setup(s => s.UpdateTeamMemberAsync(teamId, memberId, updateMemberDto, _userId))
            .ReturnsAsync(updatedMember);

        // Act
        var result = await _controller.UpdateTeamMember(teamId, memberId, updateMemberDto);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedMember = okResult.Value.Should().BeOfType<TeamMemberResponseDto>().Subject;
        returnedMember.JerseyNumber.Should().Be("10");
    }

    [Fact]
    public async Task UpdateTeamMember_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        var memberId = Guid.NewGuid();
        var updateMemberDto = new UpdateTeamMemberDto { JerseyNumber = "10" };
        
        _mockTeamsService.Setup(s => s.UpdateTeamMemberAsync(teamId, memberId, updateMemberDto, _userId))
            .ReturnsAsync((TeamMemberResponseDto?)null);

        // Act
        var result = await _controller.UpdateTeamMember(teamId, memberId, updateMemberDto);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task RemoveTeamMember_WithValidIds_ShouldReturnNoContent()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        var memberId = Guid.NewGuid();
        
        _mockTeamsService.Setup(s => s.RemoveTeamMemberAsync(teamId, memberId, _userId))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.RemoveTeamMember(teamId, memberId);

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task RemoveTeamMember_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var teamId = Guid.NewGuid();
        var memberId = Guid.NewGuid();
        
        _mockTeamsService.Setup(s => s.RemoveTeamMemberAsync(teamId, memberId, _userId))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.RemoveTeamMember(teamId, memberId);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }
}