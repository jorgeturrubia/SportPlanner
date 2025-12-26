using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Models;

public class MethodologicalItineraryRating
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int MethodologicalItineraryId { get; set; }
    
    [ForeignKey(nameof(MethodologicalItineraryId))]
    public MethodologicalItinerary MethodologicalItinerary { get; set; } = null!;

    [Required]
    public string UserId { get; set; } = null!;

    [Range(1, 5)]
    public int Rating { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
