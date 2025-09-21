using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models.Masters;

public class Difficulty
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [Range(1, 10)]
    public int Level { get; set; } = 1;

    [StringLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Exercise> Exercises { get; set; } = [];
}
