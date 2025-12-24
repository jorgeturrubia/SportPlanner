using System;
using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class Season
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = null!; // "2023/2024"

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; } = true;

    // Optional: OwnerOrganizationId if seasons are per-organization
    public int? OrganizationId { get; set; }
    public Organization? Organization { get; set; }

    public ICollection<TeamSeason> TeamSeasons { get; set; } = new List<TeamSeason>();
}
