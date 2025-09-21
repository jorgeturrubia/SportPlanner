using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models.Masters;

public class ObjectivePriority
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(1, 10)]
    public int Level { get; set; } = 1; // Priority level (1=lowest, 10=highest)

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}