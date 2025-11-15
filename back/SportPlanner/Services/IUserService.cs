using System.Security.Claims;
using System.Threading.Tasks;

namespace SportPlanner.Services;

public interface IUserService
{
    /// <summary>
    /// Create or load an application user based on claims from the JWT.
    /// This is intentionally small — implement with EF Core or your repository.
    /// </summary>
    Task<UserDto?> GetOrCreateUserFromClaimsAsync(ClaimsPrincipal user);
}

public record UserDto(string Id, string? Email, string? Name);
