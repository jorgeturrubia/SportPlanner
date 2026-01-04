using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Models;

public class Exercise
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? MediaUrl { get; set; } // For images or videos of the exercise

    // Many-to-Many with SportConcept
    public ICollection<SportConcept> Concepts { get; set; } = new List<SportConcept>();

    // One-to-Many with TacticalBoard
    public ICollection<TacticalBoard> TacticalBoards { get; set; } = new List<TacticalBoard>();

    public bool IsSystem { get; set; } = true;
    public bool IsActive { get; set; } = true;

    public int? SportId { get; set; }
    public Sport? Sport { get; set; }

    public string? AuthorName { get; set; }
    public double AverageRating { get; set; }
    public int RatingCount { get; set; }

    [Column(TypeName = "timestamp with time zone")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<string> Tags { get; set; } = new();

    // Ownership & Marketplace Properties
    public string? OwnerId { get; set; }
    
    /// <summary>
    /// If this is a user copy, this links to the original system exercise.
    /// </summary>
    public int? OriginSystemId { get; set; }
    public Exercise? OriginSystem { get; set; }
}
