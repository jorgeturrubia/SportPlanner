using System;

namespace SportPlanner.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string? SupabaseUserId { get; set; }
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
