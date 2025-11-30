namespace SportPlanner.Application.DTOs;

public class SportConceptDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Url { get; set; }
    public int? ConceptCategoryId { get; set; }
    public ConceptCategoryDto? ConceptCategory { get; set; }
    public int TechnicalDifficulty { get; set; }
    public int TacticalComplexity { get; set; }
    public int ProgressWeight { get; set; }
    public bool IsProgressive { get; set; }
    public int? SportId { get; set; }
    public bool IsActive { get; set; }
}

public class SportConceptWithSuggestionDto : SportConceptDto
{
    public bool IsSuggested { get; set; }
}

public class CreateSportConceptDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Url { get; set; }
    public int? ConceptCategoryId { get; set; }
    public int TechnicalDifficulty { get; set; }
    public int TacticalComplexity { get; set; }
    public int ProgressWeight { get; set; } = 50;
    public bool IsProgressive { get; set; } = true;
    public int? SportId { get; set; }
}
