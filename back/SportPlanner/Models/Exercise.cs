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
}
