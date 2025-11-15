using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public UserService(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<UserDto?> GetOrCreateUserFromClaimsAsync(ClaimsPrincipal claimsPrincipal)
        {
            if (claimsPrincipal == null)
                return null;
            var supabaseId = claimsPrincipal.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(supabaseId))
                return null;

            var user = await _db.Users.SingleOrDefaultAsync(u => u.SupabaseUserId == supabaseId);
            if (user != null)
                return _mapper.Map<UserDto>(user);

            // Create a new user record from claims
            var email = claimsPrincipal.FindFirst(ClaimTypes.Email)?.Value ?? claimsPrincipal.FindFirst("email")?.Value;
            var name = claimsPrincipal.FindFirst(ClaimTypes.Name)?.Value ?? claimsPrincipal.FindFirst("name")?.Value;
            var username = claimsPrincipal.FindFirst("preferred_username")?.Value ?? claimsPrincipal.FindFirst("username")?.Value;

            var newUser = new User
            {
                Id = Guid.NewGuid(),
                SupabaseUserId = supabaseId,
                Email = email,
                Name = name,
                UserName = username
            };
            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();

            return _mapper.Map<UserDto>(newUser);
        }
    }
}
