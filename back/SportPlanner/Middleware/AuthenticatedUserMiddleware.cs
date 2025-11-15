using Microsoft.AspNetCore.Http;
using SportPlanner.Services;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Middleware
{
    public class AuthenticatedUserMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<AuthenticatedUserMiddleware> _logger;
        public const string HttpContextItemUserKey = "AppUser";

        public AuthenticatedUserMiddleware(RequestDelegate next, ILogger<AuthenticatedUserMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }
        

        public async Task InvokeAsync(HttpContext context)
        {
            // Only attempt to fetch the user if the request is authenticated
            if (context.User?.Identity?.IsAuthenticated == true)
            {
                try
                {
                    // Resolve the IUserService from the scoped request provider
                    var userService = context.RequestServices.GetService<SportPlanner.Services.IUserService>();
                    if (userService != null)
                    {
                        var user = await userService.GetOrCreateUserFromClaimsAsync(context.User);
                        if (user != null)
                        {
                            context.Items[HttpContextItemUserKey] = user;
                        }
                    }
                }
                catch (System.Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to fetch or create user from claims");
                    // Continue without user attached; controllers/services may handle missing user.
                }
            }

            await _next(context);
        }
    }
}
