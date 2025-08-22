using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Api.Models;

/// <summary>
/// Represents a training objective in the PlanSport platform
/// </summary>
public class Objective
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public ObjectiveCategory Category { get; set; }

    [Required]
    public ObjectiveDifficulty Difficulty { get; set; }

    [Required]
    public ObjectiveStatus Status { get; set; } = ObjectiveStatus.Active;

    [Required]
    [Range(5, 300)]
    public int EstimatedDuration { get; set; } // in minutes

    [Required]
    [MaxLength(100)]
    public string TargetAgeGroup { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Sport { get; set; } = string.Empty;

    public string Tags { get; set; } = string.Empty; // JSON array as string

    public string? Prerequisites { get; set; } // JSON array as string

    public string EquipmentNeeded { get; set; } = string.Empty; // JSON array as string

    [Required]
    [Range(1, 100)]
    public int MaxParticipants { get; set; } = 25;

    [Required]
    [Range(1, 50)]
    public int MinParticipants { get; set; } = 1;

    [Required]
    public bool IsPublic { get; set; } = true;

    [Required]
    public Guid CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [Range(0, 5)]
    public decimal Rating { get; set; } = 0;

    [Range(0, int.MaxValue)]
    public int UsageCount { get; set; } = 0;

    // Navigation properties
    public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
}

/// <summary>
/// Categories for training objectives
/// </summary>
public enum ObjectiveCategory
{
    Technical = 1,
    Tactical = 2,
    Physical = 3,
    Psychological = 4
}

/// <summary>
/// Difficulty levels for objectives
/// </summary>
public enum ObjectiveDifficulty
{
    Beginner = 1,
    Intermediate = 2,
    Advanced = 3,
    Expert = 4
}

/// <summary>
/// Status values for objectives
/// </summary>
public enum ObjectiveStatus
{
    Draft = 1,
    Active = 2,
    Completed = 3,
    Archived = 4
}