using System.ComponentModel.DataAnnotations;
using SportPlanner.Models.Masters;

namespace SportPlanner.Models;

public class Objective
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    // Category Relations
    public int ObjectiveCategoryId { get; set; }
    public int ObjectiveSubcategoryId { get; set; }

    // Relations
    public Guid? TeamId { get; set; }
    public string Tags { get; set; } = string.Empty;

    // System fields
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Guid CreatedByUserId { get; set; }

    // Navigation properties
    public Team? Team { get; set; }
    public User? CreatedBy { get; set; }
    public ObjectiveCategory? ObjectiveCategory { get; set; }
    public ObjectiveSubcategory? ObjectiveSubcategory { get; set; }

    // Collections
    public ICollection<ObjectiveExercise> Exercises { get; set; } = new List<ObjectiveExercise>();
}


public class ObjectiveExercise
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public int ObjectiveId { get; set; }
    public int ExerciseId { get; set; }
    public int Order { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public Objective Objective { get; set; } = null!;
    public CustomExercise Exercise { get; set; } = null!;
}