using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;
using System.Security.Claims;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TeamsController : ControllerBase
{
    private readonly ITeamService _teamService;
    private readonly ILogger<TeamsController> _logger;

    public TeamsController(ITeamService teamService, ILogger<TeamsController> logger)
    {
        _teamService = teamService;
        _logger = logger;
    }

    // GET: api/teams
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeamDto>>> GetTeams()
    {
        try
        {
            var userId = GetCurrentUserId();
            var teams = await _teamService.GetUserTeamsAsync(userId);
            return Ok(teams);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting teams for user");
            return StatusCode(500, "An error occurred while retrieving teams");
        }
    }

    // GET: api/teams/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TeamDto>> GetTeam(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var team = await _teamService.GetTeamAsync(id, userId);

            if (team == null)
            {
                return NotFound($"Team with ID {id} not found or access denied");
            }

            return Ok(team);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting team {TeamId}", id);
            return StatusCode(500, "An error occurred while retrieving the team");
        }
    }

    // POST: api/teams
    [HttpPost]
    public async Task<ActionResult<TeamDto>> CreateTeam(CreateTeamRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var team = await _teamService.CreateTeamAsync(request, userId);

            return CreatedAtAction(nameof(GetTeam), new { id = team.Id }, team);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating team");
            return StatusCode(500, "An error occurred while creating the team");
        }
    }

    // PUT: api/teams/5
    [HttpPut("{id}")]
    public async Task<ActionResult<TeamDto>> UpdateTeam(Guid id, UpdateTeamRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var team = await _teamService.UpdateTeamAsync(id, request, userId);

            return Ok(team);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Team with ID {id} not found");
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid("You do not have permission to update this team");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating team {TeamId}", id);
            return StatusCode(500, "An error occurred while updating the team");
        }
    }

    // DELETE: api/teams/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _teamService.DeleteTeamAsync(id, userId);

            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Team with ID {id} not found");
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid("You do not have permission to delete this team");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting team {TeamId}", id);
            return StatusCode(500, "An error occurred while deleting the team");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        return userId;
    }
}