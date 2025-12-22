namespace SportPlanner.Application.DTOs.Planning;

public class PlanMonitorDto
{
    public int PlanningId { get; set; }
    public string PlanningName { get; set; } = string.Empty;
    public List<PlanMonitorSessionDto> Sessions { get; set; } = new();
    public List<PlanMonitorCategoryDto> Categories { get; set; } = new();
}

public class PlanMonitorSessionDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class PlanMonitorCategoryDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public List<PlanMonitorConceptDto> Concepts { get; set; } = new();
}

public class PlanMonitorConceptDto
{
    public int ConceptId { get; set; }
    public string ConceptName { get; set; } = string.Empty;
    public bool IsPlanned { get; set; }
    public List<PlanMonitorExecutionDto> Executions { get; set; } = new();
}

public class PlanMonitorExecutionDto
{
    public int TrainingSessionId { get; set; }
    public int Count { get; set; }
    public int DurationMinutes { get; set; }
}
