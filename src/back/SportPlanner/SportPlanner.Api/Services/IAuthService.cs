using SportPlanner.Api.Controllers;
using SportPlanner.Api.Dtos;
using System.Threading.Tasks;

namespace SportPlanner.Api.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(AuthController.LoginRequest request);
        Task<AuthResponseDto?> RegisterAsync(AuthController.RegisterRequest request);
        Task<AuthResponseDto?> RefreshAsync(AuthController.RefreshRequest request);
        Task LogoutAsync(AuthController.LogoutRequest request);
        Task<bool> ForgotPasswordAsync(string email);
        Task<bool> ResetPasswordAsync(string token, string newPassword);
        Task<bool> SendEmailVerificationAsync();
        Task<bool> VerifyEmailAsync(string token);
        Task<ProfileDto?> GetProfileAsync();
        Task<ProfileDto?> UpdateProfileAsync(UpdateProfileDto profile);
        Task<bool> ChangePasswordAsync(ChangePasswordDto changePassword);
    }
}
