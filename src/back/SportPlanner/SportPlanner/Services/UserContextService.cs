using SportPlanner.Models;
using SportPlanner.Models.DTOs;
using System.Security.Claims;

namespace SportPlanner.Services;

public class UserContextService : IUserContextService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<UserContextService> _logger;

    public UserContextService(IHttpContextAccessor httpContextAccessor, ILogger<UserContextService> logger)
    {
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public UserDto? GetCurrentUser()
    {
        var context = _httpContextAccessor.HttpContext;
        if (context?.User?.Identity?.IsAuthenticated != true)
        {
            return null;
        }

        try
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return null;
            }

            return new UserDto
            {
                Id = userId.Value,
                Email = context.User.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty,
                FirstName = GetFirstName(),
                LastName = GetLastName(),
                SupabaseId = GetCurrentUserSupabaseId() ?? string.Empty,
                Role = GetCurrentUserRole() ?? UserRole.Coach,
                CreatedAt = DateTime.UtcNow, // This would ideally come from the database
                UpdatedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user from context");
            return null;
        }
    }

    public Guid? GetCurrentUserId()
    {
        var context = _httpContextAccessor.HttpContext;
        if (context?.User?.Identity?.IsAuthenticated != true)
        {
            _logger.LogWarning("GetCurrentUserId: User is not authenticated");
            return null;
        }

        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            _logger.LogWarning("GetCurrentUserId: No NameIdentifier claim found");
            return null;
        }

        if (Guid.TryParse(userIdClaim, out var userId))
        {
            _logger.LogInformation("GetCurrentUserId: Found user ID {UserId}", userId);
            return userId;
        }
        else
        {
            _logger.LogWarning("GetCurrentUserId: Invalid GUID format for user ID claim: {ClaimValue}", userIdClaim);
            return null;
        }
    }

    public string? GetCurrentUserSupabaseId()
    {
        var context = _httpContextAccessor.HttpContext;
        if (context?.User?.Identity?.IsAuthenticated != true)
        {
            return null;
        }

        return context.User.FindFirst("supabase_id")?.Value;
    }

    public UserRole? GetCurrentUserRole()
    {
        var context = _httpContextAccessor.HttpContext;
        if (context?.User?.Identity?.IsAuthenticated != true)
        {
            return null;
        }

        var roleClaim = context.User.FindFirst(ClaimTypes.Role)?.Value;
        if (string.IsNullOrEmpty(roleClaim))
        {
            return null;
        }

        return Enum.TryParse<UserRole>(roleClaim, out var role) ? role : null;
    }

    public bool IsAuthenticated()
    {
        var context = _httpContextAccessor.HttpContext;
        return context?.User?.Identity?.IsAuthenticated == true;
    }

    public bool HasRole(UserRole role)
    {
        var currentRole = GetCurrentUserRole();
        return currentRole == role;
    }

    public IEnumerable<Claim> GetUserClaims()
    {
        var context = _httpContextAccessor.HttpContext;
        if (context?.User?.Identity?.IsAuthenticated != true)
        {
            return Enumerable.Empty<Claim>();
        }

        return context.User.Claims;
    }

    private string GetFirstName()
    {
        var context = _httpContextAccessor.HttpContext;
        var fullName = context?.User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty;
        
        if (string.IsNullOrEmpty(fullName))
        {
            return string.Empty;
        }

        var nameParts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        return nameParts.Length > 0 ? nameParts[0] : string.Empty;
    }

    private string GetLastName()
    {
        var context = _httpContextAccessor.HttpContext;
        var fullName = context?.User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty;
        
        if (string.IsNullOrEmpty(fullName))
        {
            return string.Empty;
        }

        var nameParts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        return nameParts.Length > 1 ? string.Join(" ", nameParts.Skip(1)) : string.Empty;
    }
}