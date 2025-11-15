using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Services;

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
        var sub = User?.FindFirst("sub")?.Value;
        var email = User?.FindFirst("email")?.Value;
        var name = User?.FindFirst("name")?.Value;
        return Ok(new { sub, email, name });
    }
}
