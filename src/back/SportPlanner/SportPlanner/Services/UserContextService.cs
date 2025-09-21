using SportPlanner.Models;
using SportPlanner.Models.DTOs;
using SportPlanner.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace SportPlanner.Services;

public class UserContextService : IUserContextService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<UserContextService> _logger;
    private readonly SportPlannerDbContext _context;

    public UserContextService(IHttpContextAccessor httpContextAccessor, ILogger<UserContextService> logger, SportPlannerDbContext context)
    {
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
        _context = context;
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

            // Consultar la base de datos para obtener información completa del usuario
            var user = _context.Users.Include(u => u.UserRole).FirstOrDefault(u => u.Id == userId.Value);
            if (user != null)
            {
                return new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    SupabaseId = user.SupabaseId,
                    Role = user.Role,
                    UserRoleName = user.UserRole?.Name ?? string.Empty,
                    OrganizationId = user.OrganizationId,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt
                };
            }

            // Fallback a claims si no se encuentra en la base de datos
            return new UserDto
            {
                Id = userId.Value,
                Email = context.User.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty,
                FirstName = GetFirstName(),
                LastName = GetLastName(),
                SupabaseId = GetCurrentUserSupabaseId() ?? string.Empty,
                Role = GetCurrentUserRoleId() ?? 3, // Coach by default
                UserRoleName = "Entrenador", // Coach by default
                OrganizationId = null,
                CreatedAt = DateTime.UtcNow,
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

    public int? GetCurrentUserRoleId()
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

        return int.TryParse(roleClaim, out var roleId) ? roleId : null;
    }

    public bool IsAuthenticated()
    {
        var context = _httpContextAccessor.HttpContext;
        return context?.User?.Identity?.IsAuthenticated == true;
    }

    public bool HasRole(int roleId)
    {
        var currentRoleId = GetCurrentUserRoleId();
        return currentRoleId == roleId;
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