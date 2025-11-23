using System;
using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class SubscriptionPlan
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    public int Level { get; set; }
    public decimal Price { get; set; }
    public int? MaxTeams { get; set; }
    public int? MaxMembersPerTeam { get; set; }
    public string? Features { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
