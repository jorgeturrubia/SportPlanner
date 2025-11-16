using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
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

    public TeamsController(AppDbContext db, IMapper mapper, IUserService userService)
    {
        _db = db;
        _mapper = mapper;
        _userService = userService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateTeamDto dto)
    {
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
}
