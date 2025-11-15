using System.Security.Claims;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Collections.Generic;
using Microsoft.Extensions.Primitives;
using System.Threading.Tasks;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace SportPlanner.Tests
{
    public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public TestAuthHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // Read Authorization header and treat the token content as 'sub' claim
            if (!Request.Headers.TryGetValue("Authorization", out var authHeaderValues))
            {
                return Task.FromResult(AuthenticateResult.NoResult());
            }
            var authHeader = authHeaderValues.FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return Task.FromResult(AuthenticateResult.NoResult());

            var token = authHeader.Substring("Bearer ".Length).Trim();
            if (string.IsNullOrEmpty(token))
                return Task.FromResult(AuthenticateResult.Fail("Empty token"));

            // For tests, if token is a JWT, parse it and extract claims (sub/email/name); otherwise, accept raw token as 'sub'.
            string subVal = token;
            string nameVal = token;
            string? emailVal = null;
            try
            {
                var handler = new JwtSecurityTokenHandler();
                if (handler.CanReadToken(token))
                {
                    var jwt = handler.ReadJwtToken(token);
                    subVal = jwt.Claims.FirstOrDefault(c => c.Type == "sub")?.Value ?? subVal;
                    nameVal = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type == "name")?.Value ?? nameVal;
                    emailVal = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email || c.Type == "email")?.Value;
                }
            }
            catch
            {
                // ignore and fallback to raw token
            }

            var claims = new List<Claim> { new Claim("sub", subVal), new Claim(ClaimTypes.Name, nameVal) };
            if (!string.IsNullOrEmpty(emailVal)) claims.Add(new Claim(ClaimTypes.Email, emailVal));
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);
            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}
