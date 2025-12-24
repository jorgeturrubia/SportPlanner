using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Application.DTOs.Team;
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
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Teams.Add(team);
        await _db.SaveChangesAsync(); // Save team first to get its ID

        // Create the initial TeamSeason link
        if (dto.SeasonId.HasValue)
        {
            var teamSeason = new TeamSeason
            {
                TeamId = team.Id,
                SeasonId = dto.SeasonId.Value,
                TeamLevelId = dto.TeamLevelId,
                TeamCategoryId = dto.TeamCategoryId,
                TechnicalLevel = dto.CurrentTechnicalLevel,
                TacticalLevel = dto.CurrentTacticalLevel,
                PhotoUrl = null // Initial photo url is null
            };
            _db.TeamSeasons.Add(teamSeason);
            await _db.SaveChangesAsync();

            // Load relations for response
            await _db.Entry(teamSeason).Reference(ts => ts.TeamLevel).LoadAsync();
            await _db.Entry(teamSeason).Reference(ts => ts.TeamCategory).LoadAsync();

            // Construct result manually to safeguard against missing map configs
            var resultDto = _mapper.Map<TeamDto>(team);
            // Overwrite season specific fields
            resultDto.TeamLevelId = teamSeason.TeamLevelId;
            resultDto.TeamLevel = _mapper.Map<TeamLevelDto>(teamSeason.TeamLevel);
            resultDto.TeamCategory = _mapper.Map<TeamCategoryDto>(teamSeason.TeamCategory);
            resultDto.CurrentTechnicalLevel = teamSeason.TechnicalLevel;
            resultDto.CurrentTacticalLevel = teamSeason.TacticalLevel;
            resultDto.PhotoUrl = teamSeason.PhotoUrl;

            return CreatedAtAction(nameof(Get), new { id = team.Id }, resultDto);
        }

        // If no season data, return basic team info
        return CreatedAtAction(nameof(Get), new { id = team.Id }, _mapper.Map<TeamDto>(team));
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> Get(int id, [FromQuery] int? seasonId)
    {
        var team = await _db.Teams
            .Include(t => t.TeamSeasons).ThenInclude(ts => ts.TeamCategory)
            .Include(t => t.TeamSeasons).ThenInclude(ts => ts.TeamLevel)
            .Include(t => t.Sport)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (team == null) return NotFound();

        // Map to DTO
        TeamSeason? seasonData = null;
        if (seasonId.HasValue)
        {
            seasonData = team.TeamSeasons.FirstOrDefault(ts => ts.SeasonId == seasonId.Value);
        }
        else
        {
            seasonData = team.TeamSeasons.FirstOrDefault();
        }

        var dto = new TeamDto
        {
            Id = team.Id,
            Name = team.Name,
            TeamCategory = seasonData?.TeamCategory != null ? _mapper.Map<TeamCategoryDto>(seasonData.TeamCategory) : null,
            TeamLevelId = seasonData?.TeamLevelId,
            TeamLevel = seasonData?.TeamLevel != null ? _mapper.Map<TeamLevelDto>(seasonData.TeamLevel) : null,
            CurrentTechnicalLevel = seasonData?.TechnicalLevel ?? 0,
            CurrentTacticalLevel = seasonData?.TacticalLevel ?? 0,
            PhotoUrl = seasonData?.PhotoUrl
        };

        return Ok(dto);
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
        team.UpdatedAt = DateTime.UtcNow;

        if (dto.SeasonId.HasValue)
        {
            // Update specific season data
            var teamSeason = await _db.TeamSeasons.FirstOrDefaultAsync(ts => ts.TeamId == team.Id && ts.SeasonId == dto.SeasonId.Value);
            if (teamSeason != null)
            {
                if (dto.TeamCategoryId.HasValue) teamSeason.TeamCategoryId = dto.TeamCategoryId.Value;
                if (dto.TeamLevelId.HasValue) teamSeason.TeamLevelId = dto.TeamLevelId;
                teamSeason.TechnicalLevel = dto.CurrentTechnicalLevel;
                teamSeason.TacticalLevel = dto.CurrentTacticalLevel;
                if (dto.PhotoUrl != null) teamSeason.PhotoUrl = dto.PhotoUrl;
            }
            else
            {
                // Create new season entry if it doesn't exist for this team/season pair?
                // The task description implies we preserve history, but also user expects continuity.
                // If user "edits" a team in a season where it doesn't formally exist yet (edge case), create it?
                // For now, let's assume it should exist. If not, creating it is safer than crashing.
                teamSeason = new TeamSeason
                {
                    TeamId = team.Id,
                    SeasonId = dto.SeasonId.Value,
                    TeamLevelId = dto.TeamLevelId,
                    TechnicalLevel = dto.CurrentTechnicalLevel,
                    TacticalLevel = dto.CurrentTacticalLevel
                };
                _db.TeamSeasons.Add(teamSeason);
            }
        }

        await _db.SaveChangesAsync();
        return Ok(_mapper.Map<TeamDto>(team));
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
            .Include(t => t.TeamSeasons).ThenInclude(ts => ts.TeamCategory)
            .Include(t => t.TeamSeasons).ThenInclude(ts => ts.TeamLevel)
            .Include(t => t.Sport)
            .Where(t => t.OwnerUserSupabaseId == user.Id || (t.OrganizationId.HasValue && userOrgIds.Contains(t.OrganizationId.Value)));

        if (seasonId.HasValue)
        {
            query = query.Where(t => t.TeamSeasons.Any(ts => ts.SeasonId == seasonId.Value));
        }

        var teams = await query.ToListAsync();

        // Map to DTOs manually or via mapper if configured
        var teamDtos = teams.Select(t =>
        {
            // Try to find the specific season data if seasonId provided, 
            // OR find the latest/active one if not?
            // For now, if seasonId is provided, use that.
            // If not, maybe use the first one or leave empty?

            TeamSeason? seasonData = null;
            if (seasonId.HasValue)
            {
                seasonData = t.TeamSeasons.FirstOrDefault(ts => ts.SeasonId == seasonId.Value);
            }
            else
            {
                // Fallback: order by something? For now just take first or null
                seasonData = t.TeamSeasons.FirstOrDefault();
            }

            return new TeamDto
            {
                Id = t.Id,
                Name = t.Name,
                TeamCategory = seasonData?.TeamCategory != null ? _mapper.Map<TeamCategoryDto>(seasonData.TeamCategory) : null,
                TeamLevelId = seasonData?.TeamLevelId,
                TeamLevel = seasonData?.TeamLevel != null ? _mapper.Map<TeamLevelDto>(seasonData.TeamLevel) : null,
                CurrentTechnicalLevel = seasonData?.TechnicalLevel ?? 0,
                CurrentTacticalLevel = seasonData?.TacticalLevel ?? 0,
                PhotoUrl = seasonData?.PhotoUrl
            };
        }).ToList();

        return Ok(teamDtos);
    }
}
