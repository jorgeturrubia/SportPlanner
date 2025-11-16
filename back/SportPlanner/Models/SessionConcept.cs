namespace SportPlanner.Models;

public class SessionConcept
{
    public int Id { get; set; }
    public int TrainingSessionId { get; set; }
    public TrainingSession? TrainingSession { get; set; }

    public int SportConceptId { get; set; }
    public SportConcept? SportConcept { get; set; }

    public int Order { get; set; }
    public int? PlannedDurationMinutes { get; set; }
    public string? Notes { get; set; }

    public int? PlanConceptId { get; set; }
    public PlanConcept? PlanConcept { get; set; }
}
