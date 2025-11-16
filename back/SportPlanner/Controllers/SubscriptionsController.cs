using System;
using System.Linq;
using System.Security.Claims;
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
public class SubscriptionsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly IUserService _userService;

    private readonly IBillingService _billing;
    public SubscriptionsController(AppDbContext db, IMapper mapper, IUserService userService, IBillingService billing)
    {
        _db = db;
        _mapper = mapper;
        _userService = userService;
        _billing = billing;
    }

    // POST /api/subscriptions
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateSubscriptionDto dto)
    {
        // Resolve authenticated user
        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null)
            return Forbid();

        // If DTO doesn't specify a user, bind to caller
        if (string.IsNullOrEmpty(dto.UserSupabaseId) && !dto.OrganizationId.HasValue)
        {
            dto.UserSupabaseId = user.Id;
        }

        // Validate XOR: user or org
        if ((string.IsNullOrEmpty(dto.UserSupabaseId) && !dto.OrganizationId.HasValue) || (!string.IsNullOrEmpty(dto.UserSupabaseId) && dto.OrganizationId.HasValue))
        {
            return BadRequest("Subscription must be owned by either a user or an organization, but not both or neither.");
        }

        // Validate plan & sport existence
        var plan = await _db.SubscriptionPlans.FindAsync(dto.PlanId);
        if (plan == null || !plan.IsActive)
            return NotFound("Plan not found or not active.");
        var sport = await _db.Sports.FindAsync(dto.SportId);
        if (sport == null || !sport.IsActive)
            return NotFound("Sport not found or not active.");

        // Validate uniqueness: no active subscription for same user/org + sport
        if (!string.IsNullOrEmpty(dto.UserSupabaseId))
        {
            var existing = await _db.Subscriptions
                .AnyAsync(s => s.UserSupabaseId == dto.UserSupabaseId && s.SportId == dto.SportId && s.IsActive);
            if (existing)
                return Conflict("An active subscription already exists for this user and sport.");
        }
        else if (dto.OrganizationId.HasValue)
        {
            // verify user is owner/admin of org
            var org = await _db.Organizations.FindAsync(dto.OrganizationId.Value);
            if (org == null)
                return NotFound("Organization not found.");
            // TODO: enhance ownership check; we'll allow the owner's supabase ID or any org member for now
            var isMember = await _db.OrganizationMemberships.AnyAsync(m => m.OrganizationId == dto.OrganizationId.Value && m.UserSupabaseId == user.Id);
            if (!isMember)
                return Forbid();
            var existing = await _db.Subscriptions.AnyAsync(s => s.OrganizationId == dto.OrganizationId && s.SportId == dto.SportId && s.IsActive);
            if (existing)
                return Conflict("An active subscription already exists for this organization and sport.");
        }

        var subscription = _mapper.Map<Subscription>(dto);
        subscription.Status = SubscriptionStatus.Active;
        subscription.IsActive = true;
        subscription.CreatedAt = DateTime.UtcNow;
        subscription.UpdatedAt = DateTime.UtcNow;

        await using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
                _db.Subscriptions.Add(subscription);
                await _db.SaveChangesAsync();

            var history = new SubscriptionHistory
            {
                SubscriptionId = subscription.Id,
                OldPlanId = null,
                NewPlanId = subscription.PlanId,
                ChangeType = SubscriptionChangeType.Upgrade,
                RequestedAt = DateTime.UtcNow,
                EffectiveAt = subscription.StartDate
            };
            _db.SubscriptionHistories.Add(history);
            await _db.SaveChangesAsync();

            // Call billing service here. If billing fails, rollback and return 402
            var billingOk = await _billing.CreateSubscriptionAsync(subscription.UserSupabaseId, subscription.OrganizationId, subscription.PlanId, subscription.SportId);
            if (!billingOk)
            {
                await tx.RollbackAsync();
                return StatusCode(402, "Payment required or billing failed.");
            }
            await tx.CommitAsync();
        }
        catch (DbUpdateException ex)
        {
            await tx.RollbackAsync();
            return Problem(ex.Message);
        }

        // Reload with nav props to include Plan and Sport
        var resultSubscription = await _db.Subscriptions
            .Include(s => s.Plan)
            .Include(s => s.Sport)
            .FirstOrDefaultAsync(s => s.Id == subscription.Id);
        var result = _mapper.Map<SubscriptionDto>(resultSubscription);
        return CreatedAtAction(nameof(Get), new { id = subscription.Id }, result);
    }

    // GET /api/subscriptions/{id}
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> Get(int id)
    {
        var subscription = await _db.Subscriptions
            .Include(s => s.Plan)
            .Include(s => s.Sport)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (subscription == null)
            return NotFound();
        return Ok(_mapper.Map<SubscriptionDto>(subscription));
    }

    // POST /api/subscriptions/{id}/cancel
    [HttpPost("{id}/cancel")]
    [Authorize]
    public async Task<IActionResult> Cancel(int id)
    {
        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null)
            return Forbid();
        var subscription = await _db.Subscriptions
            .Include(s => s.Plan)
            .Include(s => s.Sport)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (subscription == null)
            return NotFound();
        // authorize: user is owner or organization member
        var isOwner = subscription.UserSupabaseId == user.Id;
        if (!isOwner && subscription.OrganizationId.HasValue)
        {
            var member = await _db.OrganizationMemberships.AnyAsync(m => m.OrganizationId == subscription.OrganizationId && m.UserSupabaseId == user.Id);
            if (!member) return Forbid();
        }

        if (!subscription.IsActive)
            return BadRequest("Subscription is not active.");

        subscription.CancelledAt = DateTime.UtcNow;
        subscription.IsActive = false; // block premium access immediately
        subscription.Status = SubscriptionStatus.Cancelled;
        subscription.RetentionEndsAt = subscription.CancelledAt?.AddDays(90);
        subscription.UpdatedAt = DateTime.UtcNow;

        var history = new SubscriptionHistory
        {
            SubscriptionId = subscription.Id,
            OldPlanId = subscription.PlanId,
            NewPlanId = subscription.PlanId,
            ChangeType = SubscriptionChangeType.Cancel,
            RequestedAt = DateTime.UtcNow,
            EffectiveAt = DateTime.UtcNow
        };
        _db.SubscriptionHistories.Add(history);
        await _db.SaveChangesAsync();

        // Call billing service to disable autobilling
        await _billing.CancelSubscriptionAsync(subscription.Id);

        return Ok(_mapper.Map<SubscriptionDto>(subscription));
    }

    // POST /api/subscriptions/{id}/reactivate
    [HttpPost("{id}/reactivate")]
    [Authorize]
    public async Task<IActionResult> Reactivate(int id)
    {
        var user = await _userService.GetOrCreateUserFromClaimsAsync(User);
        if (user == null)
            return Forbid();
        var subscription = await _db.Subscriptions
            .Include(s => s.Plan)
            .Include(s => s.Sport)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (subscription == null)
            return NotFound();
        // authorize
        var isOwner = subscription.UserSupabaseId == user.Id;
        if (!isOwner && subscription.OrganizationId.HasValue)
        {
            var member = await _db.OrganizationMemberships.AnyAsync(m => m.OrganizationId == subscription.OrganizationId && m.UserSupabaseId == user.Id);
            if (!member) return Forbid();
        }
        if (subscription.IsActive)
            return BadRequest("Subscription already active.");
        if (!subscription.RetentionEndsAt.HasValue || subscription.RetentionEndsAt.Value <= DateTime.UtcNow)
            return BadRequest("Subscription retention expired and cannot be reactivated.");

        subscription.IsActive = true;
        subscription.CancelledAt = null;
        subscription.RetentionEndsAt = null;
        subscription.Status = SubscriptionStatus.Active;
        subscription.UpdatedAt = DateTime.UtcNow;

        _db.SubscriptionHistories.Add(new SubscriptionHistory
        {
            SubscriptionId = subscription.Id,
            OldPlanId = subscription.PlanId,
            NewPlanId = subscription.PlanId,
            ChangeType = SubscriptionChangeType.Reactivate,
            RequestedAt = DateTime.UtcNow,
            EffectiveAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();

        // Call billing to resume billing
        await _billing.ReactivateSubscriptionAsync(subscription.Id);

        return Ok(_mapper.Map<SubscriptionDto>(subscription));
    }
}
