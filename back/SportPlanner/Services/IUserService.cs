using System.Security.Claims;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Services
{
    public interface IUserService
    {
        Task<UserDto?> GetOrCreateUserFromClaimsAsync(ClaimsPrincipal claimsPrincipal);
    }
}
