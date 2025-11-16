using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class TrainingSchedule
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public int TeamId { get; set; }
    public Team? Team { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public ICollection<TrainingScheduleDay> ScheduleDays { get; set; } = new List<TrainingScheduleDay>();
    public ICollection<PlanConcept> PlanConcepts { get; set; } = new List<PlanConcept>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
