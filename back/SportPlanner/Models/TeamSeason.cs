using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Models;

public class TeamSeason
{
    public int Id { get; set; }

    [Required]
    public int TeamId { get; set; }
    public Team? Team { get; set; }

    [Required]
    public int SeasonId { get; set; }
    public Season? Season { get; set; }

    public int? TeamLevelId { get; set; }
    public TeamLevel? TeamLevel { get; set; }

    public int? TeamCategoryId { get; set; }
    public TeamCategory? TeamCategory { get; set; }

    // Snapshot of the team's level for this season
    public int TechnicalLevel { get; set; }
    public int TacticalLevel { get; set; }

    public string? PhotoUrl { get; set; }
}
