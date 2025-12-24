using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class Planning
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public int TeamId { get; set; }
    public Team? Team { get; set; }

    public int? SeasonId { get; set; }
    public Season? Season { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public ICollection<PlaningScheduleDay> ScheduleDays { get; set; } = new List<PlaningScheduleDay>();
    public ICollection<PlanConcept> PlanConcepts { get; set; } = new List<PlanConcept>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
