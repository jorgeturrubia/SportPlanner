using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class SportConcept
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    public int? ConceptCategoryId { get; set; }
    public ConceptCategory? ConceptCategory { get; set; }

    public int? ConceptPhaseId { get; set; }
    public ConceptPhase? ConceptPhase { get; set; }

    public int? DifficultyLevelId { get; set; }
    public DifficultyLevel? DifficultyLevel { get; set; }

    public int ProgressWeight { get; set; } = 50; // 0..100
    public bool IsProgressive { get; set; } = true;

    public int? SportId { get; set; }
    public Sport? Sport { get; set; }
    public bool IsActive { get; set; } = true;
}
