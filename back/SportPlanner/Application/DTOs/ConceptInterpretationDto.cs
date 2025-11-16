namespace SportPlanner.Application.DTOs;

public class ConceptInterpretationCreateDto
{
    public int SportConceptId { get; set; }
    public int? TeamId { get; set; }
    public int? TeamCategoryId { get; set; }
    public int? TeamLevelId { get; set; }
    public int? InterpretedDifficultyLevelId { get; set; }
    public decimal DurationMultiplier { get; set; } = 1.0m;
    public decimal PriorityMultiplier { get; set; } = 1.0m;
    public bool IsSuggested { get; set; } = false;
    public string? Notes { get; set; }
}

public class ConceptInterpretationDto
{
    public int Id { get; set; }
    public int SportConceptId { get; set; }
    public int? TeamId { get; set; }
    public int? TeamCategoryId { get; set; }
    public int? TeamLevelId { get; set; }
    public int? InterpretedDifficultyLevelId { get; set; }
    public decimal DurationMultiplier { get; set; }
    public decimal PriorityMultiplier { get; set; }
    public bool IsSuggested { get; set; }
    public string? Notes { get; set; }
}
