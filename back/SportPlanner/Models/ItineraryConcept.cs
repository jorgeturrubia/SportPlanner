using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Models;

public class ItineraryConcept
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ItineraryId { get; set; }
    [ForeignKey(nameof(ItineraryId))]
    public MethodologicalItinerary Itinerary { get; set; } = null!;

    [Required]
    public int SportConceptId { get; set; }
    [ForeignKey(nameof(SportConceptId))]
    public SportConcept SportConcept { get; set; } = null!;

    public string? CustomDescription { get; set; }
    
    public int Order { get; set; }
}
