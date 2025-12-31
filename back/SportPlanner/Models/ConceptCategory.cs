using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace SportPlanner.Models;

public class ConceptCategory
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    public int? ParentId { get; set; }
    public ConceptCategory? Parent { get; set; }
    public ICollection<ConceptCategory> SubCategories { get; set; } = new List<ConceptCategory>();
    public ICollection<SportConcept> SportConcepts { get; set; } = new List<SportConcept>();

    // Ownership & Marketplace Properties
    public string? OwnerId { get; set; }
    public bool IsSystem { get; set; } = false;
    
    /// <summary>
    /// If this is a user copy, this links to the original system category.
    /// </summary>
    public int? OriginSystemId { get; set; }
    public ConceptCategory? OriginSystem { get; set; }
}
