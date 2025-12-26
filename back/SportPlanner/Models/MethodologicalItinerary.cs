using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

/// <summary>
/// Represents a complete methodological path for a sport, containing multiple planning templates.
/// This is the primary unit of content in the Marketplace.
/// </summary>
public class MethodologicalItinerary
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } = null!;
    
    public string? Description { get; set; }
    
    /// <summary>
    /// The sport this itinerary belongs to.
    /// </summary>
    public int SportId { get; set; }
    public Sport? Sport { get; set; }
    
    /// <summary>
    /// Collection of planning templates that form this itinerary.
    /// </summary>
    public ICollection<PlanningTemplate> PlanningTemplates { get; set; } = new List<PlanningTemplate>();
    
    // Marketplace Properties
    
    /// <summary>
    /// Indicates if this is an official system itinerary.
    /// </summary>
    public bool IsSystem { get; set; }
    
    /// <summary>
    /// FK to the User who owns/created the itinerary.
    /// </summary>
    public string? OwnerId { get; set; }
    
    public int Version { get; set; } = 1;
    
    public double AverageRating { get; set; }
    
    public int RatingCount { get; set; }
    
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// If this is a user copy, this links to the original system itinerary.
    /// </summary>
    public int? SystemSourceId { get; set; }
    public MethodologicalItinerary? SystemSource { get; set; }
}
