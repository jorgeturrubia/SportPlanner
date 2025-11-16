namespace SportPlanner.Models;

public class PlanConcept
{
    public int Id { get; set; }
    public int TrainingScheduleId { get; set; }
    public TrainingSchedule? TrainingSchedule { get; set; }

    public int SportConceptId { get; set; }
    public SportConcept? SportConcept { get; set; }
}
