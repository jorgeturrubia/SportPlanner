using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models.Masters;

public class Category
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(0, 50)]
    public int? MinAge { get; set; }

    [Range(0, 50)]
    public int? MaxAge { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Foreign Key
    public int SportId { get; set; }

    // Navigation properties
    public Sport Sport { get; set; } = null!;
}