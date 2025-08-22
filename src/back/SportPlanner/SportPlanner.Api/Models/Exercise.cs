using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Api.Models;

/// <summary>
/// Represents an exercise in the PlanSport platform
/// </summary>
public class Exercise
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public ExerciseCategory Category { get; set; }

    [Required]
    public ExerciseDifficulty Difficulty { get; set; }

    [Required]
    public ExerciseStatus Status { get; set; } = ExerciseStatus.Published;

    [Required]
    [Range(1, 180)]
    public int Duration { get; set; } // in minutes

    [Required]
    [Range(1, 50)]
    public int MinParticipants { get; set; } = 1;

    [Required]
    [Range(1, 100)]
    public int MaxParticipants { get; set; } = 25;

    public string TargetAgeGroup { get; set; } = string.Empty; // JSON array as string

    [Required]
    [MaxLength(50)]
    public string Sport { get; set; } = string.Empty;

    public string Objectives { get; set; } = string.Empty; // JSON array of objective IDs

    public string Instructions { get; set; } = string.Empty; // JSON array as string

    public string SafetyNotes { get; set; } = string.Empty; // JSON array as string

    public string Equipment { get; set; } = string.Empty; // JSON array as string

    public string Variations { get; set; } = string.Empty; // JSON array as string

    public string Tags { get; set; } = string.Empty; // JSON array as string

    [Required]
    [MaxLength(100)]
    public string SpaceRequired { get; set; } = string.Empty;

    [Required]
    public bool IsPublic { get; set; } = true;

    [Required]
    public bool IsVerified { get; set; } = false;

    [Required]
    public Guid CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [Range(0, int.MaxValue)]
    public int UsageCount { get; set; } = 0;

    [Range(0, 5)]
    public decimal Rating { get; set; } = 0;

    // Navigation properties
    public ICollection<ExerciseReview> Reviews { get; set; } = new List<ExerciseReview>();
    public ICollection<ExerciseMedia> Media { get; set; } = new List<ExerciseMedia>();
}

/// <summary>
/// Categories for exercises
/// </summary>
public enum ExerciseCategory
{
    WarmUp = 1,
    Technical = 2,
    Tactical = 3,
    Physical = 4,
    Coordination = 5,
    Flexibility = 6,
    Strength = 7,
    Endurance = 8,
    Speed = 9,
    Agility = 10,
    CoolDown = 11,
    Game = 12
}

/// <summary>
/// Difficulty levels for exercises
/// </summary>
public enum ExerciseDifficulty
{
    VeryEasy = 1,
    Easy = 2,
    Medium = 3,
    Hard = 4,
    VeryHard = 5
}

/// <summary>
/// Status values for exercises
/// </summary>
public enum ExerciseStatus
{
    Draft = 1,
    Published = 2,
    Archived = 3
}

/// <summary>
/// Represents a review for an exercise
/// </summary>
public class ExerciseReview
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ExerciseId { get; set; }

    [ForeignKey(nameof(ExerciseId))]
    public Exercise Exercise { get; set; } = null!;

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Comment { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Represents media associated with an exercise
/// </summary>
public class ExerciseMedia
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ExerciseId { get; set; }

    [ForeignKey(nameof(ExerciseId))]
    public Exercise Exercise { get; set; } = null!;

    [Required]
    public ExerciseMediaType Type { get; set; }

    [Required]
    [MaxLength(500)]
    public string Url { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Caption { get; set; }

    [Required]
    public int Order { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Types of media for exercises
/// </summary>
public enum ExerciseMediaType
{
    Image = 1,
    Video = 2,
    Diagram = 3
}