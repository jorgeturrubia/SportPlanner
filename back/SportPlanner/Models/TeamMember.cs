using System;
using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public enum TeamMemberRole
{
    Owner,
    Admin,
    Member
}

public class TeamMember
{
    public int Id { get; set; }
    [Required]
    public int TeamId { get; set; }
    public Team? Team { get; set; }
    [Required]
    public string UserSupabaseId { get; set; } = null!;
    public TeamMemberRole Role { get; set; } = TeamMemberRole.Member;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}
