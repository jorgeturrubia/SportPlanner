using SportPlanner.Models;
using SportPlanner.Models.DTOs;
using System.Security.Claims;

namespace SportPlanner.Services;

public interface IUserContextService
{
    /// <summary>
    /// Gets the current user from the HTTP context
    /// </summary>
    UserDto? GetCurrentUser();
    
    /// <summary>
    /// Gets the current user ID from the HTTP context
    /// </summary>
    Guid? GetCurrentUserId();
    
    /// <summary>
    /// Gets the current user's Supabase ID from the HTTP context
    /// </summary>
    string? GetCurrentUserSupabaseId();
    
    /// <summary>
    /// Gets the current user's role from the HTTP context
    /// </summary>
    UserRole? GetCurrentUserRole();
    
    /// <summary>
    /// Checks if the current user is authenticated
    /// </summary>
    bool IsAuthenticated();
    
    /// <summary>
    /// Checks if the current user has the specified role
    /// </summary>
    bool HasRole(UserRole role);
    
    /// <summary>
    /// Gets all claims for the current user
    /// </summary>
    IEnumerable<Claim> GetUserClaims();
}