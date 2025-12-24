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


    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TeamSeason> TeamSeasons { get; set; } = new List<TeamSeason>();

    public ICollection<Planning> Plannings { get; set; } = new List<Planning>();

}
