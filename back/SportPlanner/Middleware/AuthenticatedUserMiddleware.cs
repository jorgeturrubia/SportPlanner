using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SportPlanner.Services;

namespace SportPlanner.Middleware;

// This middleware populates HttpContext.Items["AppUser"] with a UserDto
// after authentication has already run.
public class AuthenticatedUserMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IUserService _userService;

    public AuthenticatedUserMiddleware(RequestDelegate next, IUserService userService)
    {
        _next = next;
        _userService = userService;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Only attempt if user is authenticated
        if (context.User?.Identity?.IsAuthenticated == true)
        {
            var userDto = await _userService.GetOrCreateUserFromClaimsAsync(context.User);
            if (userDto != null)
            {
                // Attach to Items so controllers can access without DB lookups.
                context.Items["AppUser"] = userDto;
            }
        }

        await _next(context);
    }
}
