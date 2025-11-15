using System;

namespace SportPlanner.Application.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string? SupabaseUserId { get; set; }
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? Name { get; set; }
    }
}
