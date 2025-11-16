using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class ConceptInterpretation
{
    public int Id { get; set; }
    public int SportConceptId { get; set; }
    public SportConcept? SportConcept { get; set; }

    public int? TeamId { get; set; }
    public Team? Team { get; set; }

    public int? TeamCategoryId { get; set; }
    public TeamCategory? TeamCategory { get; set; }

    public int? TeamLevelId { get; set; }
    public TeamLevel? TeamLevel { get; set; }

    public int? InterpretedDifficultyLevelId { get; set; }
    public DifficultyLevel? InterpretedDifficultyLevel { get; set; }

    public decimal DurationMultiplier { get; set; } = 1.0m; // increase/decrease planned duration
    public decimal PriorityMultiplier { get; set; } = 1.0m; // increase/decrease importance
    public bool IsSuggested { get; set; } = false; // if should be suggested by default
    public string? Notes { get; set; }
}
