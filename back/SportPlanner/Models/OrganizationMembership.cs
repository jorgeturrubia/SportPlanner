using System;
using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public enum OrganizationRole
{
    Owner,
    Admin,
    Member
}

public class OrganizationMembership
{
    public int Id { get; set; }
    [Required]
    public int OrganizationId { get; set; }
    public Organization? Organization { get; set; }
    [Required]
    public string UserSupabaseId { get; set; } = null!;
    public OrganizationRole Role { get; set; } = OrganizationRole.Member;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}
