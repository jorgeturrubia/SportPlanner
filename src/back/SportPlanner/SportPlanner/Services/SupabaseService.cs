using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;

namespace SportPlanner.Services;

public class SupabaseService : ISupabaseService
{
    private readonly Supabase.Client _supabaseClient;
    private readonly SportPlannerDbContext _context;
    private readonly ILogger<SupabaseService> _logger;

    public SupabaseService(Supabase.Client supabaseClient, SportPlannerDbContext context, ILogger<SupabaseService> logger)
    {
        _supabaseClient = supabaseClient;
        _context = context;
        _logger = logger;
    }

    public async Task<AuthResponse> AuthenticateAsync(string email, string password)
    {
        try
        {
            var session = await _supabaseClient.Auth.SignIn(email, password);
            
            if (session?.User == null)
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            var user = await GetOrCreateUserAsync(session.User);
            
            return new AuthResponse
            {
                User = MapToUserDto(user),
                AccessToken = session.AccessToken ?? string.Empty,
                RefreshToken = session.RefreshToken ?? string.Empty,
                ExpiresIn = (int)session.ExpiresIn
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during authentication for email: {Email}", email);
            throw new UnauthorizedAccessException("Authentication failed");
        }
    }

    public async Task<AuthResponse> RegisterAsync(string email, string password, string firstName, string lastName)
    {
        try
        {
            var session = await _supabaseClient.Auth.SignUp(email, password);
            
            if (session?.User == null)
            {
                throw new InvalidOperationException("Registration failed");
            }

            var user = await CreateUserAsync(session.User, firstName, lastName);
            
            return new AuthResponse
            {
                User = MapToUserDto(user),
                AccessToken = session.AccessToken ?? string.Empty,
                RefreshToken = session.RefreshToken ?? string.Empty,
                ExpiresIn = (int)session.ExpiresIn
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for email: {Email}", email);
            throw new InvalidOperationException("Registration failed");
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
            
            if (supabaseUser == null)
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
            var session = await _supabaseClient.Auth.RefreshSession();
            
            if (session?.User == null)
            {
                throw new UnauthorizedAccessException("Invalid refresh token");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.SupabaseId == session.User.Id);

            if (user == null)
            {
                throw new UnauthorizedAccessException("User not found");
            }

            return new AuthResponse
            {
                User = MapToUserDto(user),
                AccessToken = session.AccessToken ?? string.Empty,
                RefreshToken = session.RefreshToken ?? string.Empty,
                ExpiresIn = (int)session.ExpiresIn
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            throw new UnauthorizedAccessException("Token refresh failed");
        }
    }

    private async Task<Models.User> GetOrCreateUserAsync(Supabase.Gotrue.User supabaseUser)
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

    private async Task<Models.User> CreateUserAsync(Supabase.Gotrue.User supabaseUser, string firstName, string lastName)
    {
        var user = new Models.User
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

    private static UserDto MapToUserDto(Models.User user)
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