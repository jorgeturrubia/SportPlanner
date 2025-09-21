using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models.Masters;

public class ObjectiveSubcategory
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Foreign Key
    public int ObjectiveCategoryId { get; set; }

    // Navigation properties
    public ObjectiveCategory ObjectiveCategory { get; set; } = null!;
    public ICollection<Objective> Objectives { get; set; } = new List<Objective>();
}