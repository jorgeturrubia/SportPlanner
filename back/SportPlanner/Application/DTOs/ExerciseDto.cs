namespace SportPlanner.Application.DTOs;

public class ExerciseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? MediaUrl { get; set; }
    public List<int> ConceptIds { get; set; } = new();
    
    // Ownership & Marketplace Properties
    public string? OwnerId { get; set; }
    public bool IsSystem { get; set; }
    public int? OriginSystemId { get; set; }
}

public class CreateExerciseDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? MediaUrl { get; set; }
    public List<int>? ConceptIds { get; set; }
}
