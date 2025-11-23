namespace SportPlanner.Application.DTOs;

public class TeamLevelDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int? Rank { get; set; }
    public string? Description { get; set; }
}
