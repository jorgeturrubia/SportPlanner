using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class Planning
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    public PlanningType Type { get; set; } = PlanningType.TeamSpecific;
    public PlanningStatus Status { get; set; } = PlanningStatus.Draft;
    
    public Guid? TeamId { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    // Training days stored as JSON array [0,1,2,3,4,5,6] for Sunday through Saturday
    public List<DayOfWeek> TrainingDays { get; set; } = new();
    
    public TimeSpan StartTime { get; set; }
    public int DurationMinutes { get; set; } = 90;
    
    public int SessionsPerWeek { get; set; } = 2;
    public int TotalSessions { get; set; } = 0;
    public int CompletedSessions { get; set; } = 0;
    
    public bool IsActive { get; set; } = true;
    public bool IsPublic { get; set; } = false;
    
    public Guid CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public List<string> Tags { get; set; } = new();
    
    // Navigation properties
    public User CreatedBy { get; set; } = null!;
    public Team? Team { get; set; }
    public ICollection<PlanningConcept> PlanningConcepts { get; set; } = new List<PlanningConcept>();
    public ICollection<TrainingSession> TrainingSessions { get; set; } = new List<TrainingSession>();
    public ICollection<PlanningRating> Ratings { get; set; } = new List<PlanningRating>();
}


public class PlanningConcept
{
    public int Id { get; set; }
    public Guid PlanningId { get; set; }
    public Guid ConceptId { get; set; }
    
    public int Order { get; set; } // Orden del concepto en la planificación
    public int PlannedSessions { get; set; } // Sesiones planificadas para este concepto
    public int CompletedSessions { get; set; } = 0; // Sesiones completadas
    
    // Relations
    public Planning Planning { get; set; } = null!;
    public Concept Concept { get; set; } = null!;
}

public class PlanningRating
{
    public int Id { get; set; }
    public Guid PlanningId { get; set; }
    public Guid UserId { get; set; }
    
    public int Rating { get; set; } // 1-5 stars
    
    [MaxLength(500)]
    public string Comment { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Relations
    public Planning Planning { get; set; } = null!;
    public User User { get; set; } = null!;
}

// Enums matching frontend interface exactly
public enum PlanningType
{
    Template = 0,
    TeamSpecific = 1,
    Personal = 2
}

public enum PlanningStatus
{
    Draft = 0,
    Active = 1,
    Completed = 2,
    Paused = 3
}

public enum DayOfWeek
{
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}