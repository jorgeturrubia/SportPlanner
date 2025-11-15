using System.Security.Claims;
using System.Threading.Tasks;

namespace SportPlanner.Services;

public class UserService : IUserService
{
    // NOTE: This is a minimal example. Replace with your EF / repository implementation.
    public Task<UserDto?> GetOrCreateUserFromClaimsAsync(ClaimsPrincipal user)
    {
        if (user?.Identity is null || !user.Identity.IsAuthenticated)
            return Task.FromResult<UserDto?>(null);

        // Supabase access_token contains sub (user id) and email claims
        var sub = user.FindFirst("sub")?.Value;
        var email = user.FindFirst("email")?.Value;
        var name = user.FindFirst("name")?.Value;

        if (string.IsNullOrEmpty(sub))
            return Task.FromResult<UserDto?>(null);

        // TODO: Query DB to find a local user by `sub`. If not exists, create.
        // For now, return a lightweight UserDto.
        var dto = new UserDto(sub, email, name);
        return Task.FromResult<UserDto?>(dto);
    }
}
