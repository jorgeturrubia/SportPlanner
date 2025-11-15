using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _db;

    public UserService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<UserDto?> GetOrCreateUserFromClaimsAsync(ClaimsPrincipal user)
    {
        if (user?.Identity is null || !user.Identity.IsAuthenticated)
            return null;

        // Supabase access_token contains sub (user id) and email claims
        var sub = user.FindFirst("sub")?.Value;
        var email = user.FindFirst("email")?.Value;
        var name = user.FindFirst("name")?.Value;

        if (string.IsNullOrEmpty(sub))
            return null;

        // Query DB to find a local user by `sub`. If not exists, create.
        var appUser = await _db.Users.FindAsync(sub);
        if (appUser == null)
        {
            appUser = new ApplicationUser
            {
                SupabaseId = sub,
                Email = email,
                Name = name,
                CreatedAt = DateTime.UtcNow
            };
            _db.Users.Add(appUser);
            await _db.SaveChangesAsync();
        }
        else
        {
            // update any changed values (email/name)
            var hasChanges = false;
            if (appUser.Email != email)
            {
                appUser.Email = email;
                hasChanges = true;
            }
            if (appUser.Name != name)
            {
                appUser.Name = name;
                hasChanges = true;
            }
            if (hasChanges)
                await _db.SaveChangesAsync();
        }

        return new UserDto(appUser.SupabaseId, appUser.Email, appUser.Name);
    }
}
