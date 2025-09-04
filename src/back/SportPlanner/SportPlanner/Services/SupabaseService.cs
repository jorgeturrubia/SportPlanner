using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;

namespace SportPlanner.Services;

public class SupabaseService(Supabase.Client supabaseClient, SportPlannerDbContext context, ILogger<SupabaseService> logger) : ISupabaseService
{
    private readonly Supabase.Client _supabaseClient = supabaseClient;
    private readonly SportPlannerDbContext _context = context;
    private readonly ILogger<SupabaseService> _logger = logger;

    public async Task<AuthResponse> AuthenticateAsync(string email, string password)
    {
        try
        {
            _logger.LogInformation("Attempting authentication for email: {Email}", email);

            var response = await _supabaseClient.Auth.SignInWithPassword(email, password);

            if (response?.User is null)
            {
                _logger.LogWarning("Authentication failed - no session or user returned for email: {Email}", email);
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            _logger.LogInformation("Supabase authentication successful for email: {Email}", email);

            var user = await GetOrCreateUserAsync(response.User);

            // Get current session for tokens
            var session = _supabaseClient.Auth.CurrentSession;

            return new AuthResponse
            {
                User = MapToUserDto(user),
                AccessToken = session?.AccessToken ?? string.Empty,
                RefreshToken = session?.RefreshToken ?? string.Empty,
                ExpiresIn = (int)(session?.ExpiresIn ?? 0)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during authentication for email: {Email}", email);
            throw new UnauthorizedAccessException($"Authentication failed: {ex.Message}");
        }
    }

    public async Task<AuthResponse> RegisterAsync(string email, string password, string firstName, string lastName)
    {
        try
        {
            _logger.LogInformation("Attempting registration for email: {Email}", email);

            var response = await _supabaseClient.Auth.SignUp(email, password, new Supabase.Gotrue.SignUpOptions
            {
                Data = new Dictionary<string, object>
                {
                    { "first_name", firstName },
                    { "last_name", lastName }
                }
            });

            if (response?.User is null)
            {
                _logger.LogWarning("Registration failed - no session or user returned for email: {Email}", email);
                throw new InvalidOperationException("Registration failed");
            }

            _logger.LogInformation("Supabase registration successful for email: {Email}", email);

            var user = await CreateUserAsync(response.User, firstName, lastName);

            // Get current session for tokens
            var session = _supabaseClient.Auth.CurrentSession;

            return new AuthResponse
            {
                User = MapToUserDto(user),
                AccessToken = session?.AccessToken ?? string.Empty,
                RefreshToken = session?.RefreshToken ?? string.Empty,
                ExpiresIn = (int)(session?.ExpiresIn ?? 0)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for email: {Email}", email);
            throw new InvalidOperationException($"Registration failed: {ex.Message}");
        }
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadJwtToken(token);

            // Check if token is expired
            if (jsonToken.ValidTo < DateTime.UtcNow)
            {
                _logger.LogWarning("Token is expired");
                return false;
            }

            // Validate with Supabase
            var user = await _supabaseClient.Auth.GetUser(token);
            return user != null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating token");
            return false;
        }
    }

    public async Task<UserDto> GetUserFromTokenAsync(string token)
    {
        try
        {
            var supabaseUser = await _supabaseClient.Auth.GetUser(token);

            if (supabaseUser is null)
            {
                throw new UnauthorizedAccessException("Invalid token");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.SupabaseId == supabaseUser.Id);

            if (user == null)
            {
                throw new UnauthorizedAccessException("User not found");
            }

            return MapToUserDto(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user from token");
            throw new UnauthorizedAccessException("Invalid token");
        }
    }

    public async Task RevokeTokenAsync(string token)
    {
        try
        {
            await _supabaseClient.Auth.SignOut();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error revoking token");
            // Don't throw here as logout should always succeed from client perspective
        }
    }

    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            var response = await _supabaseClient.Auth.RefreshSession();

            if (response?.User is null)
            {
                throw new UnauthorizedAccessException("Invalid refresh token");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.SupabaseId == response.User.Id);

            if (user == null)
            {
                throw new UnauthorizedAccessException("User not found");
            }

            // Get current session for tokens
            var session = _supabaseClient.Auth.CurrentSession;

            return new AuthResponse
            {
                User = MapToUserDto(user),
                AccessToken = session?.AccessToken ?? string.Empty,
                RefreshToken = session?.RefreshToken ?? string.Empty,
                ExpiresIn = (int)(session?.ExpiresIn ?? 0)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            throw new UnauthorizedAccessException("Token refresh failed");
        }
    }

    public async Task ResetPasswordForEmailAsync(string email)
    {
        try
        {
            _logger.LogInformation("Attempting password reset for email: {Email}", email);
            await _supabaseClient.Auth.ResetPasswordForEmail(email);
            _logger.LogInformation("Password reset email sent to: {Email}", email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset for email: {Email}", email);
            throw new InvalidOperationException($"Password reset failed: {ex.Message}");
        }
    }

    private async Task<User> GetOrCreateUserAsync(Supabase.Gotrue.User supabaseUser)
    {

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.SupabaseId == supabaseUser.Id);

        if (user == null)
        {
            // Extract user metadata from Supabase user
            var firstName = supabaseUser.UserMetadata?.GetValueOrDefault("first_name")?.ToString() ?? string.Empty;
            var lastName = supabaseUser.UserMetadata?.GetValueOrDefault("last_name")?.ToString() ?? string.Empty;

            user = await CreateUserAsync(supabaseUser, firstName, lastName);
        }

        return user;
    }

    private async Task<User> CreateUserAsync(Supabase.Gotrue.User supabaseUser, string firstName, string lastName)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = supabaseUser.Email ?? string.Empty,
            FirstName = firstName,
            LastName = lastName,
            SupabaseId = supabaseUser.Id ?? string.Empty,
            Role = UserRole.Coach,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            SupabaseId = user.SupabaseId,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}