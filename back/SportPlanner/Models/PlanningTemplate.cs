using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

/// <summary>
/// Represents a planning template that defines which concepts belong to each age category.
/// Uses inheritance to build upon previous stages (e.g., Alevín inherits Pre-Mini concepts).
/// </summary>
public class PlanningTemplate
{
    public int Id { get; set; }
    
    /// <summary>Display name (e.g., "Itinerario Alevín")</summary>
    [Required]
    public string Name { get; set; } = null!;
    
    /// <summary>Code for programmatic reference (e.g., "ALEVIN")</summary>
    public string? Code { get; set; }
    
    /// <summary>
    /// Development level (1-6) corresponding to DevelopmentLevel in SportConcept.
    /// This determines which concepts are "own" to this template.
    /// </summary>
    public int Level { get; set; }
    
    /// <summary>Parent template for inheritance (e.g., Alevín inherits Pre-Mini)</summary>
    public int? ParentTemplateId { get; set; }
    public PlanningTemplate? ParentTemplate { get; set; }
    
    /// <summary>Child templates that inherit from this one</summary>
    public ICollection<PlanningTemplate> ChildTemplates { get; set; } = new List<PlanningTemplate>();
    
    /// <summary>Concepts that belong to this template (M:N with customizations)</summary>
    public ICollection<PlanningTemplateConcept> TemplateConcepts { get; set; } = new List<PlanningTemplateConcept>();
    
    /// <summary>Associated TeamCategory (e.g., U12 for Alevín)</summary>
    public int? TeamCategoryId { get; set; }
    public TeamCategory? TeamCategory { get; set; }
    
    /// <summary>Description of the template's focus</summary>
    public string? Description { get; set; }
    
    public bool IsActive { get; set; } = true;

    // Marketplace & Shadowing Properties

    /// <summary>
    /// Indicates if this template is a system/professional template available in the Marketplace.
    /// </summary>
    public bool IsSystem { get; set; }

    /// <summary>
    /// The creator/owner of the template (FK to User System).
    /// For System templates, this is the author. For User templates, this is the user who downloaded it.
    /// </summary>
    public string? OwnerId { get; set; }

    /// <summary>
    /// Version number for strict versioning of system templates.
    /// </summary>
    public int Version { get; set; } = 1;

    /// <summary>
    /// If this is a user copy (shadow), this links to the original system template.
    /// </summary>
    public int? SystemSourceId { get; set; }
    public PlanningTemplate? SystemSource { get; set; }

    /// <summary>
    /// The parent itinerary this template belongs to (if any).
    /// </summary>
    public int? MethodologicalItineraryId { get; set; }
    public MethodologicalItinerary? MethodologicalItinerary { get; set; }
}
