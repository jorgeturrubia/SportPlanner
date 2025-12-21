using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

/// <summary>
/// Represents a methodological itinerary that defines which concepts belong to each age category.
/// Uses inheritance to build upon previous stages (e.g., Alevín inherits Pre-Mini concepts).
/// </summary>
public class MethodologicalItinerary
{
    public int Id { get; set; }
    
    /// <summary>Display name (e.g., "Itinerario Alevín")</summary>
    [Required]
    public string Name { get; set; } = null!;
    
    /// <summary>Code for programmatic reference (e.g., "ALEVIN")</summary>
    [Required]
    public string Code { get; set; } = null!;
    
    /// <summary>
    /// Development level (1-6) corresponding to DevelopmentLevel in SportConcept.
    /// This determines which concepts are "own" to this itinerary.
    /// </summary>
    public int Level { get; set; }
    
    /// <summary>Parent itinerary for inheritance (e.g., Alevín inherits Pre-Mini)</summary>
    public int? ParentItineraryId { get; set; }
    public MethodologicalItinerary? ParentItinerary { get; set; }
    
    /// <summary>Child itineraries that inherit from this one</summary>
    public ICollection<MethodologicalItinerary> ChildItineraries { get; set; } = new List<MethodologicalItinerary>();
    
    /// <summary>Concepts that belong directly to this itinerary level</summary>
    public ICollection<SportConcept> Concepts { get; set; } = new List<SportConcept>();
    
    /// <summary>Associated TeamCategory (e.g., U12 for Alevín)</summary>
    public int? TeamCategoryId { get; set; }
    public TeamCategory? TeamCategory { get; set; }
    
    /// <summary>Description of the itinerary's focus</summary>
    public string? Description { get; set; }
    
    public bool IsActive { get; set; } = true;
}
