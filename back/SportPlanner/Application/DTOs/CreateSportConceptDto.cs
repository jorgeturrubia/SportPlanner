namespace SportPlanner.Application.DTOs;

public class CreateSportConceptDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Url { get; set; }
    public int? ConceptCategoryId { get; set; }
    public int TechnicalDifficulty { get; set; }
    public int TacticalComplexity { get; set; }
    public int? TechnicalTacticalFocus { get; set; }
    public int? DevelopmentLevel { get; set; }
    public int ProgressWeight { get; set; } = 50;
    public bool IsProgressive { get; set; } = true;
    public int? SportId { get; set; }
    
    // Internal use for ownership
    public string? OwnerId { get; set; }
    public bool IsSystem { get; set; } = false;
}
