using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class Planning
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    // Días de entrenamiento (lunes=1, martes=2, etc.)
    public string TrainingDays { get; set; } = string.Empty; // JSON: [1,3,5] para lunes, miércoles, viernes
    
    // Horarios de entrenamiento
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    
    public bool IsFullCourt { get; set; } = true; // true = pista entera, false = media pista
    
    public Guid? ItineraryId { get; set; } // Si se basa en un itinerario
    public Guid CreatedByUserId { get; set; }
    
    // Para el marketplace
    public bool IsPublic { get; set; } = false;
    public decimal AverageRating { get; set; } = 0;
    public int RatingCount { get; set; } = 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public bool IsVisible { get; set; } = true; // Para ocultar planificaciones de años anteriores
    
    // Relaciones
    public Itinerary? Itinerary { get; set; }
    public User CreatedBy { get; set; } = null!;
    public ICollection<PlanningTeam> PlanningTeams { get; set; } = new List<PlanningTeam>();
    public ICollection<PlanningConcept> PlanningConcepts { get; set; } = new List<PlanningConcept>();
    public ICollection<TrainingSession> TrainingSessions { get; set; } = new List<TrainingSession>();
    public ICollection<PlanningRating> Ratings { get; set; } = new List<PlanningRating>();
}

public class PlanningTeam
{
    public Guid PlanningId { get; set; }
    public Guid TeamId { get; set; }
    
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    
    // Relaciones
    public Planning Planning { get; set; } = null!;
    public Team Team { get; set; } = null!;
}

public class PlanningConcept
{
    public Guid Id { get; set; }
    public Guid PlanningId { get; set; }
    public Guid ConceptId { get; set; }
    
    public int Order { get; set; } // Orden del concepto en la planificación
    public int PlannedSessions { get; set; } // Sesiones planificadas para este concepto
    public int CompletedSessions { get; set; } = 0; // Sesiones completadas
    
    // Relaciones
    public Planning Planning { get; set; } = null!;
    public Concept Concept { get; set; } = null!;
}

public class PlanningRating
{
    public Guid Id { get; set; }
    public Guid PlanningId { get; set; }
    public Guid UserId { get; set; }
    
    public int Rating { get; set; } // 1-5 estrellas
    
    [MaxLength(500)]
    public string Comment { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Relaciones
    public Planning Planning { get; set; } = null!;
    public User User { get; set; } = null!;
}