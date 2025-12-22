using System.ComponentModel.DataAnnotations;

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

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
