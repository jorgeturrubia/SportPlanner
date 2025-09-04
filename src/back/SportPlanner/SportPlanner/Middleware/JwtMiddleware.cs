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
            try
            {
                var isValid = await supabaseService.ValidateTokenAsync(token);
                
                if (isValid)
                {
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
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to validate JWT token");
                // Don't throw here - let the request continue without authentication
                // Authorization will be handled by [Authorize] attributes
            }
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