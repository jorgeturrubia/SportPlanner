using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public enum DifficultyLevel
{
    Beginner = 0,
    Intermediate = 1,
    Advanced = 2,
    Expert = 3
}

public class Concept
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty; // Ej: "Técnica Individual"
    
    [Required]
    [MaxLength(100)]
    public string Subcategory { get; set; } = string.Empty; // Ej: "Bote"
    
    public DifficultyLevel DifficultyLevel { get; set; }
    
    public int EstimatedLearningTimeMinutes { get; set; } // Tiempo estimado de aprendizaje en minutos
    
    public bool IsSystemConcept { get; set; } = false; // true = concepto del sistema, false = personalizado
    public Guid? CreatedByUserId { get; set; } // null si es concepto del sistema
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    
    // Relaciones
    public User? CreatedBy { get; set; }
    public ICollection<ExerciseConcept> ExerciseConcepts { get; set; } = new List<ExerciseConcept>();
    public ICollection<ItineraryConcept> ItineraryConcepts { get; set; } = new List<ItineraryConcept>();
    public ICollection<PlanningConcept> PlanningConcepts { get; set; } = new List<PlanningConcept>();
}