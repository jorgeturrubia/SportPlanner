using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class SportConcept
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Url { get; set; }

    // Category now handles the full hierarchy (e.g., Attack > Dribbling > Change of direction)
    public int? ConceptCategoryId { get; set; }
    public ConceptCategory? ConceptCategory { get; set; }

    public int? DifficultyLevelId { get; set; }
    public DifficultyLevel? DifficultyLevel { get; set; }

  

    public int? SportId { get; set; }
    public Sport? Sport { get; set; }
    public bool IsActive { get; set; } = true;
}
