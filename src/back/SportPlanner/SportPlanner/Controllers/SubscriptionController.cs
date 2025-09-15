using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubscriptionController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;
    private readonly IUserContextService _userContextService;
    private readonly ISupabaseService _supabaseService;
    private readonly ILogger<SubscriptionController> _logger;

    public SubscriptionController(
        ISubscriptionService subscriptionService,
        IUserContextService userContextService,
        ISupabaseService supabaseService,
        ILogger<SubscriptionController> logger)
    {
        _subscriptionService = subscriptionService;
        _userContextService = userContextService;
        _supabaseService = supabaseService;
        _logger = logger;
    }

    [HttpGet("status")]
    [AllowAnonymous] // TEMPORAL: Para debugging
    public async Task<ActionResult<UserSubscriptionStatusResponse>> GetSubscriptionStatus()
    {
        try
        {
            Guid? userId = null;

            // Try to get user ID from context first (if authorized)
            userId = _userContextService.GetCurrentUserId();

            // If not authorized, try to extract from JWT token
            if (userId == null)
            {
                var token = ExtractTokenFromHeader();
                if (!string.IsNullOrEmpty(token))
                {
                    try
                    {
                        var userDto = await _supabaseService.GetUserFromTokenAsync(token);
                        userId = userDto.Id;
                        _logger.LogInformation("Extracted user ID from token: {UserId}", userId);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to extract user from token");
                        return Unauthorized("Invalid token");
                    }
                }
            }

            if (userId == null)
            {
                return Unauthorized("No user context available");
            }

            var status = await _subscriptionService.GetUserSubscriptionStatusAsync(userId.Value);
            return Ok(status);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting subscription status");
            return StatusCode(500, "Internal server error");
        }
    }

    private string? ExtractTokenFromHeader()
    {
        var authHeader = Request.Headers.Authorization.FirstOrDefault();

        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return null;
        }

        return authHeader["Bearer ".Length..].Trim();
    }

    [HttpGet("available")]
    [AllowAnonymous]
    public async Task<ActionResult<List<AvailableSubscriptionResponse>>> GetAvailableSubscriptions()
    {
        try
        {
            var subscriptions = await _subscriptionService.GetAvailableSubscriptionsAsync();
            return Ok(subscriptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available subscriptions");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("sport-types")]
    [AllowAnonymous]
    public async Task<ActionResult<List<SportTypeResponse>>> GetSportTypes()
    {
        try
        {
            var sportTypes = await _subscriptionService.GetSportTypesAsync();
            return Ok(sportTypes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting sport types");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<SubscriptionResponse>>> GetUserSubscriptions()
    {
        try
        {
            var userId = _userContextService.GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var subscriptions = await _subscriptionService.GetUserSubscriptionsAsync(userId.Value);
            return Ok(subscriptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user subscriptions");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{subscriptionId}")]
    public async Task<ActionResult<SubscriptionResponse>> GetSubscription(Guid subscriptionId)
    {
        try
        {
            var userId = _userContextService.GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var subscription = await _subscriptionService.GetSubscriptionByIdAsync(userId.Value, subscriptionId);
            if (subscription == null)
            {
                return NotFound();
            }

            return Ok(subscription);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting subscription {SubscriptionId}", subscriptionId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<SubscriptionResponse>> CreateSubscription([FromBody] CreateSubscriptionRequest request)
    {
        try
        {
            var userId = _userContextService.GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subscription = await _subscriptionService.CreateSubscriptionAsync(userId.Value, request);
            return CreatedAtAction(nameof(GetSubscription), new { subscriptionId = subscription.Id }, subscription);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid subscription request");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating subscription");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{subscriptionId}")]
    public async Task<ActionResult<SubscriptionResponse>> UpdateSubscription(
        Guid subscriptionId, 
        [FromBody] UpdateSubscriptionRequest request)
    {
        try
        {
            var userId = _userContextService.GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subscription = await _subscriptionService.UpdateSubscriptionAsync(userId.Value, subscriptionId, request);
            if (subscription == null)
            {
                return NotFound();
            }

            return Ok(subscription);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid subscription update request");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating subscription {SubscriptionId}", subscriptionId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{subscriptionId}/cancel")]
    public async Task<ActionResult> CancelSubscription(Guid subscriptionId)
    {
        try
        {
            var userId = _userContextService.GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _subscriptionService.CancelSubscriptionAsync(userId.Value, subscriptionId);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error canceling subscription {SubscriptionId}", subscriptionId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("can-access-dashboard")]
    public async Task<ActionResult<bool>> CanAccessDashboard()
    {
        try
        {
            var userId = _userContextService.GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var canAccess = await _subscriptionService.CanAccessDashboardAsync(userId.Value);
            return Ok(canAccess);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking dashboard access");
            return StatusCode(500, "Internal server error");
        }
    }
}
