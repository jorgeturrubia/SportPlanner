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
        var sub = GetClaimValue(user, "sub", System.Security.Claims.ClaimTypes.NameIdentifier, "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
        var email = GetClaimValue(user, "email", System.Security.Claims.ClaimTypes.Email, "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", "http://schemas.microsoft.com/ws/2008/06/identity/claims/emailaddress");
        var name = GetClaimValue(user, "name", System.Security.Claims.ClaimTypes.Name, "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name", "name");

        // If email or name are not found in claims, try to parse `user_metadata` JSON claim (Supabase common pattern)
        var userMetadataJson = GetClaimValue(user, "user_metadata", "user_metadata");
        if (!string.IsNullOrEmpty(userMetadataJson))
        {
            try
            {
                using var doc = System.Text.Json.JsonDocument.Parse(userMetadataJson);
                if (string.IsNullOrEmpty(email) && doc.RootElement.TryGetProperty("email", out var emailElem))
                {
                    email = emailElem.GetString();
                }
                if (string.IsNullOrEmpty(name) && doc.RootElement.TryGetProperty("name", out var nameElem))
                {
                    name = nameElem.GetString();
                }
            }
            catch (System.Text.Json.JsonException)
            {
                // ignore invalid json and continue
            }
        }

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
        // If the user has no name but we have an email, set a simple fallback name
        if (string.IsNullOrEmpty(appUser.Name) && !string.IsNullOrEmpty(appUser.Email))
        {
            var localName = appUser.Email.Split('@').FirstOrDefault();
            appUser.Name = localName;
            await _db.SaveChangesAsync();
        }
        return new UserDto(appUser.SupabaseId, appUser.Email, appUser.Name);
        }

        // Small helper: try several claim types until we find a value
        private static string? GetClaimValue(ClaimsPrincipal? user, params string[] claimTypes)
        {
        if (user == null) return null;
        foreach (var t in claimTypes)
        {
            var claim = user.FindFirst(t);
            if (claim != null && !string.IsNullOrEmpty(claim.Value))
                return claim.Value;
        }
        // fallback: check for claims that end with a segment (eg. emailaddress) to cover others
        foreach (var c in user.Claims)
        {
            if (c.Type != null)
            {
                foreach (var t in claimTypes)
                {
                    if (c.Type.EndsWith(t, StringComparison.OrdinalIgnoreCase) && !string.IsNullOrEmpty(c.Value))
                        return c.Value;
                }
            }
        }
        return null;
        }
    }
