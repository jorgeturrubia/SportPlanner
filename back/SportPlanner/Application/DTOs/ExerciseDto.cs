namespace SportPlanner.Application.DTOs;

public class ExerciseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? MediaUrl { get; set; }
    public List<int> ConceptIds { get; set; } = new();
}

public class CreateExerciseDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? MediaUrl { get; set; }
    public List<int>? ConceptIds { get; set; }
}
