using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs.Player;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IUserService _userService;

    public PlayersController(AppDbContext db, IUserService userService)
    {
        _db = db;
        _userService = userService;
    }

    [HttpGet("team/{teamId}")]
    [Authorize]
    public async Task<IActionResult> GetByTeam(int teamId)
    {
        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null) return Forbid();

        // Verify user has access to this team
        var team = await _db.Teams.FindAsync(teamId);
        if (team == null) return NotFound("Team not found");

        var hasAccess = await HasTeamAccess(team, user.Id);
        if (!hasAccess) return Forbid();

        var players = await _db.Players
            .Where(p => p.TeamId == teamId)
            .OrderBy(p => p.LastName)
            .ThenBy(p => p.FirstName)
            .Select(p => new PlayerDto
            {
                Id = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                DateOfBirth = p.DateOfBirth,
                Email = p.Email,
                Phone = p.Phone,
                TeamId = p.TeamId,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();

        return Ok(players);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> Get(int id)
    {
        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null) return Forbid();

        var player = await _db.Players
            .Include(p => p.Team)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (player == null) return NotFound();

        var hasAccess = await HasTeamAccess(player.Team, user.Id);
        if (!hasAccess) return Forbid();

        var dto = new PlayerDto
        {
            Id = player.Id,
            FirstName = player.FirstName,
            LastName = player.LastName,
            DateOfBirth = player.DateOfBirth,
            Email = player.Email,
            Phone = player.Phone,
            TeamId = player.TeamId,
            IsActive = player.IsActive,
            CreatedAt = player.CreatedAt
        };

        return Ok(dto);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreatePlayerDto dto)
    {
        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null) return Forbid();

        // Validate team exists and user has access
        var team = await _db.Teams.FindAsync(dto.TeamId);
        if (team == null) return NotFound("Team not found");

        var hasAccess = await HasTeamAccess(team, user.Id);
        if (!hasAccess) return Forbid();

        // Validate required fields
        if (string.IsNullOrWhiteSpace(dto.FirstName))
            return BadRequest("First name is required");
        if (string.IsNullOrWhiteSpace(dto.LastName))
            return BadRequest("Last name is required");

        var player = new Player
        {
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            DateOfBirth = dto.DateOfBirth,
            Email = dto.Email?.Trim(),
            Phone = dto.Phone?.Trim(),
            TeamId = dto.TeamId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Players.Add(player);
        await _db.SaveChangesAsync();

        var resultDto = new PlayerDto
        {
            Id = player.Id,
            FirstName = player.FirstName,
            LastName = player.LastName,
            DateOfBirth = player.DateOfBirth,
            Email = player.Email,
            Phone = player.Phone,
            TeamId = player.TeamId,
            IsActive = player.IsActive,
            CreatedAt = player.CreatedAt
        };

        return CreatedAtAction(nameof(Get), new { id = player.Id }, resultDto);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePlayerDto dto)
    {
        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null) return Forbid();

        var player = await _db.Players
            .Include(p => p.Team)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (player == null) return NotFound();

        var hasAccess = await HasTeamAccess(player.Team, user.Id);
        if (!hasAccess) return Forbid();

        // Validate required fields
        if (string.IsNullOrWhiteSpace(dto.FirstName))
            return BadRequest("First name is required");
        if (string.IsNullOrWhiteSpace(dto.LastName))
            return BadRequest("Last name is required");

        player.FirstName = dto.FirstName.Trim();
        player.LastName = dto.LastName.Trim();
        player.DateOfBirth = dto.DateOfBirth;
        player.Email = dto.Email?.Trim();
        player.Phone = dto.Phone?.Trim();
        player.IsActive = dto.IsActive;
        player.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var resultDto = new PlayerDto
        {
            Id = player.Id,
            FirstName = player.FirstName,
            LastName = player.LastName,
            DateOfBirth = player.DateOfBirth,
            Email = player.Email,
            Phone = player.Phone,
            TeamId = player.TeamId,
            IsActive = player.IsActive,
            CreatedAt = player.CreatedAt
        };

        return Ok(resultDto);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null) return Forbid();

        var player = await _db.Players
            .Include(p => p.Team)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (player == null) return NotFound();

        var hasAccess = await HasTeamAccess(player.Team, user.Id);
        if (!hasAccess) return Forbid();

        _db.Players.Remove(player);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPatch("{id}/toggle-active")]
    [Authorize]
    public async Task<IActionResult> ToggleActive(int id)
    {
        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null) return Forbid();

        var player = await _db.Players
            .Include(p => p.Team)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (player == null) return NotFound();

        var hasAccess = await HasTeamAccess(player.Team, user.Id);
        if (!hasAccess) return Forbid();

        player.IsActive = !player.IsActive;
        player.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new { IsActive = player.IsActive });
    }

    private async Task<bool> HasTeamAccess(Team team, string userId)
    {
        // Check if user is owner
        if (team.OwnerUserSupabaseId == userId)
            return true;

        // Check if user belongs to the organization
        if (team.OrganizationId.HasValue)
        {
            var isMember = await _db.OrganizationMemberships
                .AnyAsync(m => m.OrganizationId == team.OrganizationId && m.UserSupabaseId == userId);
            if (isMember) return true;
        }

        // Check if user is a team member
        var isTeamMember = await _db.TeamMembers
            .AnyAsync(tm => tm.TeamId == team.Id && tm.UserSupabaseId == userId);

        return isTeamMember;
    }
}
