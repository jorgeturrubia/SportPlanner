namespace SportPlanner.Application.DTOs;

public class PlanningTemplateSimpleDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Code { get; set; } = null!;
    public int Level { get; set; }
    public string? TeamCategoryName { get; set; }
}
