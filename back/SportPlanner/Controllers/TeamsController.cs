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

    [HttpGet("{id}/plan-proposals")]
    [Authorize]
    public async Task<IActionResult> GetPlanProposals(int id, [FromQuery] int? overrideLevelId, [FromQuery] int? overrideCategoryId)
    {
        var team = await _db.Teams.FindAsync(id);
        if (team == null) return NotFound();

        var levelId = overrideLevelId ?? team.TeamLevelId;
        var categoryId = overrideCategoryId ?? team.TeamCategoryId;
        var sportId = team.SportId;
        if (!sportId.HasValue) return BadRequest("Team does not specify a sport.");

        // Get active concepts for this sport
        var concepts = await _db.SportConcepts
            .Where(sc => sc.SportId == sportId && sc.IsActive)
            .ToListAsync();

        var proposals = new List<ConceptProposalDto>();
        foreach (var sc in concepts)
        {
            // find best matching interpretation: exact team > category > level > default
            var interpretation = await _db.ConceptInterpretations
                .Where(ci => ci.SportConceptId == sc.Id)
                .OrderByDescending(ci => ci.TeamId == id ? 3 : 0)
                .ThenByDescending(ci => (ci.TeamCategoryId.HasValue && categoryId.HasValue && ci.TeamCategoryId == categoryId) ? 2 : 0)
                .ThenByDescending(ci => (ci.TeamLevelId.HasValue && levelId.HasValue && ci.TeamLevelId == levelId) ? 1 : 0)
                .FirstOrDefaultAsync();

            decimal priorityMultiplier = interpretation?.PriorityMultiplier ?? 1.0m;
            var score = sc.ProgressWeight * priorityMultiplier; // simple scoring model

            var dto = _mapper.Map<SportConceptDto>(sc);
            var proposal = new ConceptProposalDto
            {
                Concept = dto,
                Score = Math.Round(score, 2),
                IsSuggested = interpretation?.IsSuggested ?? false
            };
            proposals.Add(proposal);
        }

        var ordered = proposals.OrderByDescending(p => p.Score).ThenByDescending(p => p.IsSuggested).ToList();
        return Ok(ordered);
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
    public async Task<IActionResult> GetMyTeams()
    {
        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null) return Forbid();

        // Get organizations the user belongs to
        var userOrgIds = await _db.OrganizationMemberships
            .Where(om => om.UserSupabaseId == user.Id)
            .Select(om => om.OrganizationId)
            .ToListAsync();

        var teams = await _db.Teams
            .Include(t => t.TeamCategory)
            .Include(t => t.TeamLevel)
            .Where(t => t.OwnerUserSupabaseId == user.Id || (t.OrganizationId.HasValue && userOrgIds.Contains(t.OrganizationId.Value)))
            .ToListAsync();

        return Ok(teams);
    }
}
