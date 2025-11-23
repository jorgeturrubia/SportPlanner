using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Services;
using System.Security.Claims;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpGet("me")]
    [Authorize]
    public IActionResult GetMe()
    {
        // Option A: Use mapped app user attached by AuthenticatedUserMiddleware
        if (HttpContext.Items.TryGetValue("AppUser", out var appUser))
        {
            return Ok(appUser);
        }

        // Option B: Fallback to raw claims
        // Use a helper to find the most probable claim types (supabase sometimes uses different URIs)
        var sub = GetClaimValue(User, "sub", ClaimTypes.NameIdentifier, "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
        var email = GetClaimValue(User, "email", ClaimTypes.Email, "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", "http://schemas.microsoft.com/ws/2008/06/identity/claims/emailaddress");
        var name = GetClaimValue(User, "name", ClaimTypes.Name, "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name", "http://schemas.microsoft.com/ws/2008/06/identity/claims/name");

        // Also include all raw claims for diagnostics
        var allClaims = User?.Claims?.Select(c => new { c.Type, c.Value }).ToArray() ?? Array.Empty<object>();

        // if name is missing try to parse user_metadata
        if (string.IsNullOrEmpty(name))
        {
            var meta = GetClaimValue(User, "user_metadata", "user_metadata");
            if (!string.IsNullOrEmpty(meta))
            {
                try
                {
                    using var doc = System.Text.Json.JsonDocument.Parse(meta);
                    if (doc.RootElement.TryGetProperty("name", out var nm))
                    {
                        name = nm.GetString();
                    }
                }
                catch (System.Text.Json.JsonException)
                {
                    // ignore invalid json
                }
            }
        }

        return Ok(new { sub, email, name, claims = allClaims });
    }

    private static string? GetClaimValue(ClaimsPrincipal? user, params string[] claimTypes)
    {
        if (user == null) return null;
        foreach (var t in claimTypes)
        {
            var claim = user.FindFirst(t);
            if (claim != null && !string.IsNullOrEmpty(claim.Value))
                return claim.Value;
        }
        // fallback: check claim types that end with common segments (eg. nameidentifier, emailaddress)
        foreach (var c in user.Claims)
        {
            if (c.Type == null) continue;
            foreach (var t in claimTypes)
            {
                if (c.Type.EndsWith(t, StringComparison.OrdinalIgnoreCase) && !string.IsNullOrEmpty(c.Value))
                    return c.Value;
            }
        }
        return null;
    }

    [HttpGet("debug-headers")]
    [AllowAnonymous]
    public IActionResult DebugHeaders()
    {
        var headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());
        var authHeader = Request.Headers.TryGetValue("Authorization", out var headerValue) ? headerValue.ToString() : null;
        return Ok(new { Headers = headers, Authorization = authHeader });
    }

    [HttpGet("debug-claims")]
    [AllowAnonymous]
    public IActionResult DebugClaims()
    {
        var claims = User?.Claims?.Select(c => new { type = c.Type, value = c.Value }).ToArray() ?? Array.Empty<object>();
        var isAuthenticated = User?.Identity?.IsAuthenticated ?? false;
        var claimsCount = claims.Length;
        return Ok(new { isAuthenticated, claimsCount, claims });
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        // NOTE: Currently the app uses Supabase client-side sessions. This endpoint
        // is a placeholder for server-side logout/revoke operations.
        // If you need to revoke a user's refresh tokens from the server, implement
        // a call to Supabase admin API here using a service-role key and the user's JWT.
        return NoContent();
    }

    // NOTE: DebugClaims already implemented above; no duplicate methods
}
