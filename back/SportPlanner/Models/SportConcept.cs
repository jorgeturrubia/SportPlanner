using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class SportConcept
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Url { get; set; }

    public string? OwnerId { get; set; }

    // Category now handles the full hierarchy (e.g., Attack > Dribbling > Change of direction)
    public int? ConceptCategoryId { get; set; }
    public ConceptCategory? ConceptCategory { get; set; }

    // Proficiency Requirements (1-10 scale)
    // Technical: How much skill with the ball/body is required?
    public int TechnicalDifficulty { get; set; }

    // Tactical/Cognitive: How much thinking/understanding is required?
    public int TacticalComplexity { get; set; }

    // New fields
    public int? TechnicalTacticalFocus { get; set; } // Enfoque Tecnico/Tactico
    public int? DevelopmentLevel { get; set; } // Nivel (Escuela -> Junior)

    // Planning Template Relationship
    public int? PlanningTemplateId { get; set; }
    public PlanningTemplate? PlanningTemplate { get; set; }

    [Required] // Enforced by DB and Model validation
    public int SportId { get; set; }
    public Sport? Sport { get; set; }
    public bool IsSystem { get; set; } = true;
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// If this is a user copy, this links to the original system concept.
    /// </summary>
    public int? OriginSystemId { get; set; }
    public SportConcept? OriginSystem { get; set; }

    // Relationship with Exercise library
    public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
}
