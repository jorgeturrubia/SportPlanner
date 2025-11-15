using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Services;

namespace SportPlanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IUserService userService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme + ",Test")]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            // Log the Authorization header for debugging
            var aHeader = Request.Headers["Authorization"].ToString();
            _logger.LogDebug("Auth header received: {authHeader}", aHeader);
            var userDto = await _userService.GetOrCreateUserFromClaimsAsync(User);
            if (userDto == null)
                return Unauthorized();
            return Ok(userDto);
        }
    }
}
