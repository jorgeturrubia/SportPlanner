namespace SportPlanner.Models;

public class PlanConcept
{
    public int Id { get; set; }
    public int PlanningId { get; set; }
    public Planning? Planning { get; set; }

    public int SportConceptId { get; set; }
    public SportConcept? SportConcept { get; set; }
}
