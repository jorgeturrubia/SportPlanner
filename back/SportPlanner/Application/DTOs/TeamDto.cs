namespace SportPlanner.Application.DTOs;

public class TeamDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int? TeamCategoryId { get; set; }
    public TeamCategoryDto? TeamCategory { get; set; }
    public int? TeamLevelId { get; set; }
    public TeamLevelDto? TeamLevel { get; set; }
    public bool IsActive { get; set; }
}
