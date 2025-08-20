
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Api.Dtos;
using SportPlanner.Api.Exceptions;
using SportPlanner.Api.Services;
using System.Threading.Tasks;

namespace SportPlanner.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // DTOs for requests
        public record LoginRequest(string Email, string Password);
        public record RegisterRequest(string Email, string Password, string ConfirmPassword, string FullName, string Sport, bool AcceptTerms);
        public record RefreshRequest(string RefreshToken);
        public record LogoutRequest(string RefreshToken);
        public record ForgotPasswordRequest(string Email);
        public record ResetPasswordRequest(string Token, string NewPassword);
        public record VerifyEmailRequest(string Token);
        public record UpdateProfileRequest(string FullName, object? Metadata);
        public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var result = await _authService.LoginAsync(request);
                if (result == null)
                {
                    return Unauthorized(new { success = false, message = "Invalid credentials" });
                }
                return Ok(new { 
                    success = true, 
                    data = new {
                        accessToken = result.AccessToken,
                        refreshToken = result.RefreshToken,
                        expiresIn = result.ExpiresIn,
                        user = result.User
                    }
                });
            }
            catch (InvalidCredentialsException ex)
            {
                return Unauthorized(new { success = false, message = ex.UserMessage, code = ex.ErrorCode });
            }
            catch (AuthException ex)
            {
                return BadRequest(new { success = false, message = ex.UserMessage, code = ex.ErrorCode });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                if (result == null)
                {
                    return BadRequest(new { success = false, message = "Registration failed" });
                }
                return Created("api/auth/register", new { 
                    success = true, 
                    data = new {
                        accessToken = result.AccessToken,
                        refreshToken = result.RefreshToken,
                        expiresIn = result.ExpiresIn,
                        user = result.User
                    }
                });
            }
            catch (UserAlreadyExistsException ex)
            {
                return BadRequest(new { success = false, message = ex.UserMessage, code = ex.ErrorCode });
            }
            catch (AuthException ex)
            {
                return BadRequest(new { success = false, message = ex.UserMessage, code = ex.ErrorCode });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            var result = await _authService.RefreshAsync(request);
            if (result == null)
            {
                return Unauthorized(new { success = false, message = "Invalid refresh token" });
            }
            return Ok(new { 
                success = true, 
                data = new {
                    accessToken = result.AccessToken,
                    refreshToken = result.RefreshToken,
                    expiresIn = result.ExpiresIn,
                    user = result.User
                }
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
            await _authService.LogoutAsync(request);
            return Ok(new { message = "Logged out successfully" });
        }

        [Authorize]
        [HttpGet("verify")]
        public async Task<IActionResult> Verify()
        {
            var profile = await _authService.GetProfileAsync();
            if (profile == null)
            {
                return Unauthorized(new { success = false, message = "Invalid or missing session" });
            }
            return Ok(new { success = true, data = profile });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var result = await _authService.ForgotPasswordAsync(request.Email);
            if (!result)
            {
                return BadRequest(new { message = "Failed to send password reset email" });
            }
            return Ok(new { message = "Password reset email sent successfully" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                var result = await _authService.ResetPasswordAsync(request.Token, request.NewPassword);
                if (!result)
                {
                    return BadRequest(new { message = "Failed to reset password" });
                }
                return Ok(new { message = "Password reset successfully" });
            }
            catch (InvalidTokenException ex)
            {
                return BadRequest(new { message = ex.UserMessage, code = ex.ErrorCode });
            }
            catch (AuthException ex)
            {
                return BadRequest(new { message = ex.UserMessage, code = ex.ErrorCode });
            }
        }

        [Authorize]
        [HttpPost("send-verification-email")]
        public async Task<IActionResult> SendVerificationEmail()
        {
            var result = await _authService.SendEmailVerificationAsync();
            if (!result)
            {
                return BadRequest(new { message = "Failed to send verification email" });
            }
            return Ok(new { message = "Verification email sent successfully" });
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
        {
            try
            {
                var result = await _authService.VerifyEmailAsync(request.Token);
                if (!result)
                {
                    return BadRequest(new { message = "Failed to verify email" });
                }
                return Ok(new { message = "Email verified successfully" });
            }
            catch (InvalidTokenException ex)
            {
                return BadRequest(new { message = ex.UserMessage, code = ex.ErrorCode });
            }
            catch (AuthException ex)
            {
                return BadRequest(new { message = ex.UserMessage, code = ex.ErrorCode });
            }
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var profile = await _authService.GetProfileAsync();
            if (profile == null)
                return NotFound(new { success = false, message = "Profile not found" });
            return Ok(new { success = true, data = profile });
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var updateProfileDto = new UpdateProfileDto
            {
                FullName = request.FullName,
                Metadata = request.Metadata
            };

            var profile = await _authService.UpdateProfileAsync(updateProfileDto);
            if (profile == null)
                return BadRequest(new { success = false, message = "Failed to update profile" });
            return Ok(new { success = true, data = profile });
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var changePasswordDto = new ChangePasswordDto
            {
                CurrentPassword = request.CurrentPassword,
                NewPassword = request.NewPassword
            };

            var result = await _authService.ChangePasswordAsync(changePasswordDto);
            if (!result)
            {
                return BadRequest(new { message = "Failed to change password" });
            }
            return Ok(new { message = "Password changed successfully" });
        }
    }
}
