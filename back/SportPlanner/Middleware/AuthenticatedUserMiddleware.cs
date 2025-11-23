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
    public AuthenticatedUserMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Only attempt if user is authenticated
        if (context.User?.Identity?.IsAuthenticated == true)
        {
            // Resolve IUserService from the request scope so we don't try to resolve a scoped
            // service from the root provider at application startup (which causes errors).
            var userService = context.RequestServices.GetService(typeof(SportPlanner.Services.IUserService)) as SportPlanner.Services.IUserService;
            if (userService != null)
            {
                var userDto = await userService.GetOrCreateUserFromClaimsAsync(context.User);
                if (userDto != null)
                {
                    context.Items["AppUser"] = userDto;
                }
            }
        }

        await _next(context);
    }
}
