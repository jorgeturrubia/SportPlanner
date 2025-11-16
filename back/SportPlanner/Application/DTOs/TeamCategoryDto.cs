namespace SportPlanner.Application.DTOs;

public class TeamCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public string? Description { get; set; }
}
