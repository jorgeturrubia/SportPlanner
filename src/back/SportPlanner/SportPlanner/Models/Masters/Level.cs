using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models.Masters;

public class Level
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(1, 10)]
    public int Difficulty { get; set; } = 1;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Foreign Key
    public int SportId { get; set; }

    // Navigation properties
    public Sport Sport { get; set; } = null!;
}