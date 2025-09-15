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
            _logger.LogInformation("🔍 Starting token validation...");

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadJwtToken(token);

            _logger.LogInformation("🔍 Token parsed - Issuer: {Issuer}, ValidTo: {ValidTo}, Current: {Current}",
                jsonToken.Issuer, jsonToken.ValidTo, DateTime.UtcNow);

            // Check if token is expired
            if (jsonToken.ValidTo < DateTime.UtcNow)
            {
                _logger.LogWarning("❌ Token is expired - ValidTo: {ValidTo}, Current: {Current}",
                    jsonToken.ValidTo, DateTime.UtcNow);
                return false;
            }

            // Validate with Supabase
            _logger.LogInformation("🔍 Validating token with Supabase...");
            var user = await _supabaseClient.Auth.GetUser(token);

            if (user != null)
            {
                _logger.LogInformation("✅ Token validation successful - User ID: {UserId}", user.Id);
                return true;
            }
            else
            {
                _logger.LogWarning("❌ Supabase returned null user for token");
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error validating token: {Message}", ex.Message);
            return false;
        }
    }

    public async Task<UserDto> GetUserFromTokenAsync(string token)
    {
        try
        {
            // Parse the JWT token to extract the user ID directly
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var supabaseId = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

            if (string.IsNullOrEmpty(supabaseId))
            {
                throw new UnauthorizedAccessException("Invalid token - no subject found");
            }

            _logger.LogDebug("🔍 Looking for user with Supabase ID: {SupabaseId}", supabaseId);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.SupabaseId == supabaseId);

            if (user == null)
            {
                _logger.LogWarning("⚠️ User not found in database for Supabase ID: {SupabaseId}", supabaseId);
                throw new UnauthorizedAccessException("User not found in database");
            }

            _logger.LogDebug("✅ User found: {Email} ({Id})", user.Email, user.Id);
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