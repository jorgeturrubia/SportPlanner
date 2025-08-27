using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public interface ISupabaseService
{
    Task<AuthResponse> AuthenticateAsync(string email, string password);
    Task<AuthResponse> RegisterAsync(string email, string password, string firstName, string lastName);
    Task<bool> ValidateTokenAsync(string token);
    Task<UserDto> GetUserFromTokenAsync(string token);
    Task RevokeTokenAsync(string token);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    Task ResetPasswordForEmailAsync(string email);
}