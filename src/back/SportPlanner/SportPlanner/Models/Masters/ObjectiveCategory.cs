using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models.Masters;

public class ObjectiveCategory
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

    // Navigation properties
    public ICollection<ObjectiveSubcategory> Subcategories { get; set; } = new List<ObjectiveSubcategory>();
    public ICollection<Objective> Objectives { get; set; } = new List<Objective>();
}