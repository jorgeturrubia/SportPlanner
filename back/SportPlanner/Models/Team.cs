using System;
using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class Team
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    public string? OwnerUserSupabaseId { get; set; }
    public int? OrganizationId { get; set; }
    public Organization? Organization { get; set; }
    public int? SubscriptionId { get; set; }
    public Subscription? Subscription { get; set; }
    public int? SportId { get; set; }
    public Sport? Sport { get; set; }
    public int? TeamCategoryId { get; set; }
    public TeamCategory? TeamCategory { get; set; }
    public int? TeamLevelId { get; set; }
    public TeamLevel? TeamLevel { get; set; }

    // Coach's evaluation of the team's proficiency (1-10 scale)
    // Technical: Team's skill level with the ball/body
    public int CurrentTechnicalLevel { get; set; }

    // Tactical: Team's understanding and cognitive ability
    public int CurrentTacticalLevel { get; set; }

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public int? SeasonId { get; set; }
    public Season? Season { get; set; }

    public ICollection<Planning> Plannings { get; set; } = new List<Planning>();

}
