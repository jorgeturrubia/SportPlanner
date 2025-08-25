using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public enum SessionStatus
{
    Planned = 0,
    InProgress = 1,
    Completed = 2,
    Cancelled = 3
}

public class TrainingSession
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    public DateTime ScheduledDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;
    
    public SessionStatus Status { get; set; } = SessionStatus.Planned;
    
    public Guid PlanningId { get; set; }
    public Guid CreatedByUserId { get; set; }
    
    // Seguimiento de la sesión
    public DateTime? ActualStartTime { get; set; }
    public DateTime? ActualEndTime { get; set; }
    
    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    
    // Relaciones
    public Planning Planning { get; set; } = null!;
    public User CreatedBy { get; set; } = null!;
    public ICollection<SessionExercise> SessionExercises { get; set; } = new List<SessionExercise>();
}

public class SessionExercise
{
    public Guid Id { get; set; }
    public Guid SessionId { get; set; }
    public Guid ExerciseId { get; set; }
    
    public int Order { get; set; } // Orden del ejercicio en la sesión
    public int PlannedDurationMinutes { get; set; }
    public int? ActualDurationMinutes { get; set; }
    
    public bool IsCompleted { get; set; } = false;
    
    [MaxLength(500)]
    public string Notes { get; set; } = string.Empty;
    
    // Relaciones
    public TrainingSession Session { get; set; } = null!;
    public Exercise Exercise { get; set; } = null!;
}