using SportPlanner.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Api.Dtos;

/// <summary>
/// DTO for creating a new planning
/// </summary>
public class CreatePlanningDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(1000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public PlanningType Type { get; set; }

    [Required]
    public Guid TeamId { get; set; }

    [Required]
    [StringLength(50)]
    public string Sport { get; set; } = string.Empty;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public List<string> Objectives { get; set; } = new();

    public List<string> Tags { get; set; } = new();

    [Required]
    public bool IsTemplate { get; set; } = false;

    [StringLength(100)]
    public string? TemplateName { get; set; }
}

/// <summary>
/// DTO for updating an existing planning
/// </summary>
public class UpdatePlanningDto
{
    [StringLength(200, MinimumLength = 3)]
    public string? Name { get; set; }

    [StringLength(1000, MinimumLength = 10)]
    public string? Description { get; set; }

    public PlanningType? Type { get; set; }

    public PlanningStatus? Status { get; set; }

    [StringLength(50)]
    public string? Sport { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public List<string>? Objectives { get; set; }

    public List<string>? Tags { get; set; }

    public bool? IsTemplate { get; set; }

    [StringLength(100)]
    public string? TemplateName { get; set; }
}

/// <summary>
/// DTO for planning responses
/// </summary>
public class PlanningResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public PlanningType Type { get; set; }
    public PlanningStatus Status { get; set; }
    public Guid TeamId { get; set; }
    public string TeamName { get; set; } = string.Empty;
    public string Sport { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TotalSessions { get; set; }
    public int CompletedSessions { get; set; }
    public List<string> Objectives { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public bool IsTemplate { get; set; }
    public string? TemplateName { get; set; }
    public Guid CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public decimal ProgressPercentage { get; set; }
    public int CompletedObjectives { get; set; }
    public int TotalObjectives { get; set; }
    public decimal AverageAttendance { get; set; }
    public DateTime? LastSessionDate { get; set; }
    public List<TrainingSessionDto> Sessions { get; set; } = new();
}

/// <summary>
/// DTO for paginated planning responses
/// </summary>
public class PlanningsListResponseDto
{
    public List<PlanningResponseDto> Plannings { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int Limit { get; set; }
}

/// <summary>
/// DTO for planning filters
/// </summary>
public class PlanningFilterDto
{
    public PlanningType? Type { get; set; }
    public PlanningStatus? Status { get; set; }
    public string? Sport { get; set; }
    public bool? IsTemplate { get; set; }
    public Guid? TeamId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? Page { get; set; } = 1;
    public int? Limit { get; set; } = 10;
    public string? Search { get; set; }
}

/// <summary>
/// DTO for training sessions
/// </summary>
public class TrainingSessionDto
{
    public Guid Id { get; set; }
    public Guid PlanningId { get; set; }
    public string Name { get; set; } = string.Empty;
    public SessionType Type { get; set; }
    public DateTime Date { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public int Duration { get; set; }
    public string? Location { get; set; }
    public List<string> Objectives { get; set; } = new();
    public List<SessionExerciseDto> Exercises { get; set; } = new();
    public string? Notes { get; set; }
    public List<AttendanceRecordDto> Attendance { get; set; } = new();
    public bool IsCompleted { get; set; }
    public string? CompletionNotes { get; set; }
    public string? Weather { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// DTO for creating a new training session
/// </summary>
public class CreateTrainingSessionDto
{
    [Required]
    public Guid PlanningId { get; set; }

    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public SessionType Type { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    [StringLength(10)]
    public string StartTime { get; set; } = string.Empty;

    [Required]
    [Range(15, 300)]
    public int Duration { get; set; }

    [StringLength(200)]
    public string? Location { get; set; }

    public List<string> Objectives { get; set; } = new();

    public List<CreateSessionExerciseDto> Exercises { get; set; } = new();

    [StringLength(1000)]
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for updating a training session
/// </summary>
public class UpdateTrainingSessionDto
{
    [StringLength(200, MinimumLength = 3)]
    public string? Name { get; set; }

    public SessionType? Type { get; set; }

    public DateTime? Date { get; set; }

    [StringLength(10)]
    public string? StartTime { get; set; }

    [Range(15, 300)]
    public int? Duration { get; set; }

    [StringLength(200)]
    public string? Location { get; set; }

    public List<string>? Objectives { get; set; }

    public List<CreateSessionExerciseDto>? Exercises { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }

    public bool? IsCompleted { get; set; }

    [StringLength(1000)]
    public string? CompletionNotes { get; set; }

    [StringLength(100)]
    public string? Weather { get; set; }
}

/// <summary>
/// DTO for session exercises
/// </summary>
public class SessionExerciseDto
{
    public Guid ExerciseId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Duration { get; set; }
    public int Order { get; set; }
    public string? Modifications { get; set; }
}

/// <summary>
/// DTO for creating session exercises
/// </summary>
public class CreateSessionExerciseDto
{
    [Required]
    public Guid ExerciseId { get; set; }

    [Required]
    [Range(1, 180)]
    public int Duration { get; set; }

    [Required]
    public int Order { get; set; }

    [StringLength(500)]
    public string? Modifications { get; set; }
}

/// <summary>
/// DTO for attendance records
/// </summary>
public class AttendanceRecordDto
{
    public Guid PlayerId { get; set; }
    public string PlayerName { get; set; } = string.Empty;
    public bool IsPresent { get; set; }
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for creating attendance records
/// </summary>
public class CreateAttendanceRecordDto
{
    [Required]
    public Guid PlayerId { get; set; }

    [Required]
    public bool IsPresent { get; set; }

    [StringLength(200)]
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for planning templates
/// </summary>
public class PlanningTemplateDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public PlanningType Type { get; set; }
    public string Sport { get; set; } = string.Empty;
    public int Duration { get; set; }
    public int SessionsPerWeek { get; set; }
    public string TargetLevel { get; set; } = string.Empty;
    public List<string> Objectives { get; set; } = new();
    public List<SessionTemplateDto> SessionTemplates { get; set; } = new();
    public bool IsPublic { get; set; }
    public decimal Rating { get; set; }
    public int UsageCount { get; set; }
    public Guid CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// DTO for creating planning templates
/// </summary>
public class CreatePlanningTemplateDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(1000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public PlanningType Type { get; set; }

    [Required]
    [StringLength(50)]
    public string Sport { get; set; } = string.Empty;

    [Required]
    [Range(1, 52)]
    public int Duration { get; set; }

    [Required]
    [Range(1, 7)]
    public int SessionsPerWeek { get; set; }

    [Required]
    [StringLength(50)]
    public string TargetLevel { get; set; } = string.Empty;

    public List<string> Objectives { get; set; } = new();

    public List<CreateSessionTemplateDto> SessionTemplates { get; set; } = new();

    [Required]
    public bool IsPublic { get; set; } = true;
}

/// <summary>
/// DTO for session templates
/// </summary>
public class SessionTemplateDto
{
    public string Name { get; set; } = string.Empty;
    public SessionType Type { get; set; }
    public int Duration { get; set; }
    public List<string> Objectives { get; set; } = new();
    public List<CreateSessionExerciseDto> Exercises { get; set; } = new();
}

/// <summary>
/// DTO for creating session templates
/// </summary>
public class CreateSessionTemplateDto
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public SessionType Type { get; set; }

    [Required]
    [Range(15, 300)]
    public int Duration { get; set; }

    public List<string> Objectives { get; set; } = new();

    public List<CreateSessionExerciseDto> Exercises { get; set; } = new();
}