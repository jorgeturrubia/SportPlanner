using SportPlanner.Services;
using System.Security.Claims;

namespace SportPlanner.Middleware;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<JwtMiddleware> _logger;

    public JwtMiddleware(RequestDelegate next, ILogger<JwtMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, ISupabaseService supabaseService)
    {
        var token = ExtractTokenFromHeader(context);

        if (!string.IsNullOrEmpty(token))
        {
            _logger.LogDebug("🔑 JWT Token found in request to {Path}", context.Request.Path);
            
            try
            {
                _logger.LogDebug("🔍 Validating JWT token...");
                var isValid = await supabaseService.ValidateTokenAsync(token);
                
                if (isValid)
                {
                    _logger.LogDebug("✅ JWT token is valid, getting user info...");
                    var userDto = await supabaseService.GetUserFromTokenAsync(token);
                    
                    // Add user information to the context
                    var claims = new List<Claim>
                    {
                        new(ClaimTypes.NameIdentifier, userDto.Id.ToString()),
                        new(ClaimTypes.Email, userDto.Email),
                        new(ClaimTypes.Name, $"{userDto.FirstName} {userDto.LastName}"),
                        new(ClaimTypes.Role, userDto.Role.ToString()),
                        new("supabase_id", userDto.SupabaseId)
                    };

                    var identity = new ClaimsIdentity(claims, "jwt");
                    context.User = new ClaimsPrincipal(identity);
                    
                    _logger.LogDebug("✅ User authenticated: {Email} ({Id})", userDto.Email, userDto.Id);
                }
                else
                {
                    _logger.LogWarning("❌ JWT token validation failed for {Path}", context.Request.Path);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "❌ Exception during JWT token validation for {Path}: {Message}", 
                    context.Request.Path, ex.Message);
                // Don't throw here - let the request continue without authentication
                // Authorization will be handled by [Authorize] attributes
            }
        }
        else
        {
            _logger.LogDebug("ℹ️ No JWT token found in request to {Path}", context.Request.Path);
        }

        await _next(context);
    }

    private static string? ExtractTokenFromHeader(HttpContext context)
    {
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
        
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return null;
        }

        return authHeader["Bearer ".Length..].Trim();
    }
}