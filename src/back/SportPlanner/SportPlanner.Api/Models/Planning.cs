using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Api.Models;

/// <summary>
/// Represents a training plan in the PlanSport platform
/// </summary>
public class Planning
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public PlanningType Type { get; set; }

    [Required]
    public PlanningStatus Status { get; set; } = PlanningStatus.Draft;

    [Required]
    public Guid TeamId { get; set; }

    [ForeignKey(nameof(TeamId))]
    public Team Team { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    public string Sport { get; set; } = string.Empty;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Range(0, int.MaxValue)]
    public int TotalSessions { get; set; } = 0;

    [Range(0, int.MaxValue)]
    public int CompletedSessions { get; set; } = 0;

    public string Objectives { get; set; } = string.Empty; // JSON array of objective IDs

    public string Tags { get; set; } = string.Empty; // JSON array as string

    [Required]
    public bool IsTemplate { get; set; } = false;

    [MaxLength(100)]
    public string? TemplateName { get; set; }

    [Required]
    public Guid CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Progress tracking
    [Range(0, 100)]
    public decimal ProgressPercentage { get; set; } = 0;

    [Range(0, int.MaxValue)]
    public int CompletedObjectives { get; set; } = 0;

    [Range(0, int.MaxValue)]
    public int TotalObjectives { get; set; } = 0;

    [Range(0, 100)]
    public decimal AverageAttendance { get; set; } = 0;

    public DateTime? LastSessionDate { get; set; }

    // Navigation properties
    public ICollection<TrainingSession> Sessions { get; set; } = new List<TrainingSession>();
}

/// <summary>
/// Types of planning
/// </summary>
public enum PlanningType
{
    Weekly = 1,
    Monthly = 2,
    Seasonal = 3,
    TournamentPrep = 4,
    Custom = 5
}

/// <summary>
/// Status values for planning
/// </summary>
public enum PlanningStatus
{
    Draft = 1,
    Active = 2,
    Completed = 3,
    Paused = 4,
    Archived = 5
}

/// <summary>
/// Represents a training session within a planning
/// </summary>
public class TrainingSession
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid PlanningId { get; set; }

    [ForeignKey(nameof(PlanningId))]
    public Planning Planning { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public SessionType Type { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(10)]
    public string StartTime { get; set; } = string.Empty; // Format: "HH:mm"

    [Required]
    [Range(15, 300)]
    public int Duration { get; set; } // in minutes

    [MaxLength(200)]
    public string? Location { get; set; }

    public string Objectives { get; set; } = string.Empty; // JSON array of objective IDs

    public string Exercises { get; set; } = string.Empty; // JSON array of session exercises

    [MaxLength(1000)]
    public string? Notes { get; set; }

    public string Attendance { get; set; } = string.Empty; // JSON array of attendance records

    [Required]
    public bool IsCompleted { get; set; } = false;

    [MaxLength(1000)]
    public string? CompletionNotes { get; set; }

    [MaxLength(100)]
    public string? Weather { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Types of training sessions
/// </summary>
public enum SessionType
{
    Training = 1,
    Match = 2,
    Recovery = 3,
    Tactical = 4,
    Physical = 5,
    Technical = 6
}

/// <summary>
/// Represents a planning template for reuse
/// </summary>
public class PlanningTemplate
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public PlanningType Type { get; set; }

    [Required]
    [MaxLength(50)]
    public string Sport { get; set; } = string.Empty;

    [Required]
    [Range(1, 52)]
    public int Duration { get; set; } // in weeks

    [Required]
    [Range(1, 7)]
    public int SessionsPerWeek { get; set; }

    [Required]
    [MaxLength(50)]
    public string TargetLevel { get; set; } = string.Empty;

    public string Objectives { get; set; } = string.Empty; // JSON array of objective IDs

    public string SessionTemplates { get; set; } = string.Empty; // JSON array of session templates

    [Required]
    public bool IsPublic { get; set; } = true;

    [Range(0, 5)]
    public decimal Rating { get; set; } = 0;

    [Range(0, int.MaxValue)]
    public int UsageCount { get; set; } = 0;

    [Required]
    public Guid CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}