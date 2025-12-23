using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Application.Validators;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly IUserService _userService;
    private readonly CreateTeamValidator _createTeamValidator;

    public TeamsController(AppDbContext db, IMapper mapper, IUserService userService, CreateTeamValidator createTeamValidator)
    {
        _db = db;
        _mapper = mapper;
        _userService = userService;
        _createTeamValidator = createTeamValidator;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateTeamDto dto)
    {
        // Manual validation to support async rules
        var validationResult = await _createTeamValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null) return Forbid();
        if (string.IsNullOrEmpty(dto.OwnerUserSupabaseId) && !dto.OrganizationId.HasValue)
            dto.OwnerUserSupabaseId = user.Id;

        // Validate org membership if organizationId used
        if (dto.OrganizationId.HasValue)
        {
            var isMember = await _db.OrganizationMemberships.AnyAsync(m => m.OrganizationId == dto.OrganizationId && m.UserSupabaseId == user.Id);
            if (!isMember) return Forbid();
        }

        // Ensure active subscription exists for owner or organization and sport
        var sub = await _db.Subscriptions.FirstOrDefaultAsync(s => s.SportId == dto.SportId && s.IsActive
            && ((dto.OrganizationId.HasValue && s.OrganizationId == dto.OrganizationId) || (!string.IsNullOrEmpty(dto.OwnerUserSupabaseId) && s.UserSupabaseId == dto.OwnerUserSupabaseId)));
        if (sub == null) return BadRequest("No active subscription exists for this sport.");

        // Enforce plan limits (we rely on validator too)
        if (sub.PlanId > 0)
        {
            var plan = await _db.SubscriptionPlans.FindAsync(sub.PlanId);
            if (plan != null && plan.MaxTeams.HasValue)
            {
                var count = await _db.Teams.CountAsync(t => (t.OrganizationId.HasValue ? t.OrganizationId == dto.OrganizationId : t.OwnerUserSupabaseId == dto.OwnerUserSupabaseId));
                if (count >= plan.MaxTeams.Value)
                    return BadRequest($"Plan limit reached. MaxTeams = {plan.MaxTeams.Value}");
            }
        }

        var team = new Team
        {
            Name = dto.Name,
            OwnerUserSupabaseId = dto.OwnerUserSupabaseId,
            OrganizationId = dto.OrganizationId,
            SubscriptionId = sub.Id,
            SportId = dto.SportId,
            TeamCategoryId = dto.TeamCategoryId,
            TeamLevelId = dto.TeamLevelId,
            CurrentTechnicalLevel = dto.CurrentTechnicalLevel,
            CurrentTacticalLevel = dto.CurrentTacticalLevel,
            SeasonId = dto.SeasonId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Teams.Add(team);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = team.Id }, team);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> Get(int id)
    {
        var team = await _db.Teams.FindAsync(id);
        if (team == null) return NotFound();
        return Ok(team);
    }


    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTeamDto dto)
    {
        var team = await _db.Teams.FindAsync(id);
        if (team == null) return NotFound();

        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null) return Forbid();

        // Check ownership
        if (team.OwnerUserSupabaseId != user.Id &&
            (!team.OrganizationId.HasValue || !await _db.OrganizationMemberships.AnyAsync(m => m.OrganizationId == team.OrganizationId && m.UserSupabaseId == user.Id)))
        {
            return Forbid();
        }

        team.Name = dto.Name;
        team.TeamCategoryId = dto.TeamCategoryId;
        team.TeamLevelId = dto.TeamLevelId;
        team.CurrentTechnicalLevel = dto.CurrentTechnicalLevel;
        team.CurrentTacticalLevel = dto.CurrentTacticalLevel;
        // SeasonId update could be added here if needed, but usually teams don't change season.
        team.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(team);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var team = await _db.Teams.FindAsync(id);
        if (team == null) return NotFound();

        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null) return Forbid();

        // Check ownership
        if (team.OwnerUserSupabaseId != user.Id &&
            (!team.OrganizationId.HasValue || !await _db.OrganizationMemberships.AnyAsync(m => m.OrganizationId == team.OrganizationId && m.UserSupabaseId == user.Id)))
        {
            return Forbid();
        }

        _db.Teams.Remove(team);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/toggle-active")]
    [Authorize]
    public async Task<IActionResult> ToggleActive(int id)
    {
        var team = await _db.Teams.FindAsync(id);
        if (team == null) return NotFound();

        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null) return Forbid();

        // Check ownership
        if (team.OwnerUserSupabaseId != user.Id &&
            (!team.OrganizationId.HasValue || !await _db.OrganizationMemberships.AnyAsync(m => m.OrganizationId == team.OrganizationId && m.UserSupabaseId == user.Id)))
        {
            return Forbid();
        }

        team.IsActive = !team.IsActive;
        team.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { IsActive = team.IsActive });
    }

    [HttpGet("my-teams")]
    [Authorize]
    public async Task<IActionResult> GetMyTeams([FromQuery] int? seasonId)
    {
        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null) return Forbid();

        // Get organizations the user belongs to
        var userOrgIds = await _db.OrganizationMemberships
            .Where(om => om.UserSupabaseId == user.Id)
            .Select(om => om.OrganizationId)
            .ToListAsync();

        var query = _db.Teams
            .Include(t => t.TeamCategory)
            .Include(t => t.TeamLevel)
            .Include(t => t.Sport)
            .Where(t => t.OwnerUserSupabaseId == user.Id || (t.OrganizationId.HasValue && userOrgIds.Contains(t.OrganizationId.Value)));

        if (seasonId.HasValue)
        {
            query = query.Where(t => t.SeasonId == seasonId.Value);
        }
        else
        {
            // Optional: if no season specified, simple logic could be "show everything" or "show active"
            // For now, allow everything if null.
            // Or, if filtering "No Season" is desired, value -1 could be used?
            // Let's stick to standard filter: null = all.
        }

        var teams = await query.ToListAsync();

        return Ok(teams);
    }
}
