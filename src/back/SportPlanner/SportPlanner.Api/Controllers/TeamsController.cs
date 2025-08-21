using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Api.Dtos;
using SportPlanner.Api.Exceptions;
using SportPlanner.Api.Models;
using SportPlanner.Api.Services;
using System.Security.Claims;

namespace SportPlanner.Api.Controllers;

/// <summary>
/// Controller for managing teams
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TeamsController : ControllerBase
{
    private readonly ITeamsService _teamsService;

    public TeamsController(ITeamsService teamsService)
    {
        _teamsService = teamsService;
    }

    /// <summary>
    /// Get all teams for the current user
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeamResponseDto>>> GetTeams(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] Guid? sportId = null,
        [FromQuery] TeamStatus? status = null)
    {
        var userId = GetUserId();
        var (teams, totalCount) = await _teamsService.GetTeamsAsync(userId, page, pageSize, search, sportId, status);

        Response.Headers.Add("X-Total-Count", totalCount.ToString());
        Response.Headers.Add("X-Page-Number", page.ToString());

        return Ok(teams);
    }

    /// <summary>
    /// Get a specific team by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TeamResponseDto>> GetTeam(Guid id)
    {
        var userId = GetUserId();
        var team = await _teamsService.GetTeamAsync(id, userId);

        if (team == null)
        {
            return NotFound(new { message = "Equipo no encontrado" });
        }

        return Ok(team);
    }

    /// <summary>
    /// Create a new team
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TeamResponseDto>> CreateTeam(CreateTeamDto createTeamDto)
    {
        try
        {
            var userId = GetUserId();
            var team = await _teamsService.CreateTeamAsync(createTeamDto, userId);
            return CreatedAtAction(nameof(GetTeam), new { id = team.Id }, team);
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing team
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<TeamResponseDto>> UpdateTeam(Guid id, UpdateTeamDto updateTeamDto)
    {
        try
        {
            var userId = GetUserId();
            var team = await _teamsService.UpdateTeamAsync(id, updateTeamDto, userId);

            if (team == null)
            {
                return NotFound(new { message = "Equipo no encontrado" });
            }

            return Ok(team);
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete a team
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(Guid id)
    {
        var userId = GetUserId();
        var deleted = await _teamsService.DeleteTeamAsync(id, userId);

        if (!deleted)
        {
            return NotFound(new { message = "Equipo no encontrado" });
        }

        return NoContent();
    }

    /// <summary>
    /// Check if user can create more teams
    /// </summary>
    [HttpGet("can-create")]
    public async Task<ActionResult<bool>> CanCreateTeam()
    {
        var userId = GetUserId();
        var canCreate = await _teamsService.CanCreateTeamAsync(userId);
        return Ok(new { canCreate });
    }

    /// <summary>
    /// Get all available sports
    /// </summary>
    [HttpGet("sports")]
    public async Task<ActionResult<IEnumerable<SportResponseDto>>> GetSports()
    {
        var sports = await _teamsService.GetSportsAsync();
        return Ok(sports);
    }

    /// <summary>
    /// Get team members
    /// </summary>
    [HttpGet("{teamId}/members")]
    public async Task<ActionResult<IEnumerable<TeamMemberResponseDto>>> GetTeamMembers(Guid teamId)
    {
        try
        {
            var userId = GetUserId();
            var members = await _teamsService.GetTeamMembersAsync(teamId, userId);
            return Ok(members);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Add a member to a team
    /// </summary>
    [HttpPost("{teamId}/members")]
    public async Task<ActionResult<TeamMemberResponseDto>> AddTeamMember(Guid teamId, AddTeamMemberDto addMemberDto)
    {
        try
        {
            var userId = GetUserId();
            var member = await _teamsService.AddTeamMemberAsync(teamId, addMemberDto, userId);
            return CreatedAtAction(nameof(GetTeamMembers), new { teamId }, member);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update a team member
    /// </summary>
    [HttpPut("{teamId}/members/{memberId}")]
    public async Task<ActionResult<TeamMemberResponseDto>> UpdateTeamMember(
        Guid teamId, 
        Guid memberId, 
        UpdateTeamMemberDto updateMemberDto)
    {
        try
        {
            var userId = GetUserId();
            var member = await _teamsService.UpdateTeamMemberAsync(teamId, memberId, updateMemberDto, userId);

            if (member == null)
            {
                return NotFound(new { message = "Miembro del equipo no encontrado" });
            }

            return Ok(member);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Remove a member from a team
    /// </summary>
    [HttpDelete("{teamId}/members/{memberId}")]
    public async Task<IActionResult> RemoveTeamMember(Guid teamId, Guid memberId)
    {
        var userId = GetUserId();
        var removed = await _teamsService.RemoveTeamMemberAsync(teamId, memberId, userId);

        if (!removed)
        {
            return NotFound(new { message = "Miembro del equipo no encontrado" });
        }

        return NoContent();
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("ID de usuario no válido");
        }

        return userId;
    }
}