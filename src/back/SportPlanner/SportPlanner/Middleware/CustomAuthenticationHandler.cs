using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace SportPlanner.Middleware;

public class CustomAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public CustomAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger, UrlEncoder encoder) : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // If our JWT middleware already set a user, consider them authenticated
        if (Context.User?.Identity?.IsAuthenticated == true)
        {
            var ticket = new AuthenticationTicket(Context.User, Scheme.Name);
            return Task.FromResult(AuthenticateResult.Success(ticket));
        }

        // If no user was set by middleware, they're not authenticated
        return Task.FromResult(AuthenticateResult.NoResult());
    }
}