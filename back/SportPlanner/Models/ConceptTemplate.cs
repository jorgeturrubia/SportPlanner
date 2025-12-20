using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class ConceptTemplate
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } = null!;
    
    public string? Description { get; set; }
    
    // Technical Complexity (1-10): Execution and biomechanics difficulty
    [Range(1, 10)]
    public int TechnicalComplexity { get; set; }
    
    // Tactical Complexity (0-10): Cognitive load and decision-making
    // 0 = No tactical component (pure technical drills)
    [Range(0, 10)]
    public int TacticalComplexity { get; set; }
    
    // Optional suggested category for concepts using this template
    public int? ConceptCategoryId { get; set; }
    public ConceptCategory? ConceptCategory { get; set; }
    
    // Sport association
    public int SportId { get; set; }
    public Sport Sport { get; set; } = null!;
    
    public bool IsActive { get; set; } = true;
    
    // Navigation property - concepts that use this template
    public ICollection<SportConcept> Concepts { get; set; } = new List<SportConcept>();
}
