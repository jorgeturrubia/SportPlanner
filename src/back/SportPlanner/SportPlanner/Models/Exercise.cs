using System.ComponentModel.DataAnnotations;
using SportPlanner.Models.Masters;

namespace SportPlanner.Models;

public class Exercise
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string Instructions { get; set; } = string.Empty;
    
    public int DurationMinutes { get; set; }
    public int MinPlayers { get; set; }
    public int MaxPlayers { get; set; }
    
    [MaxLength(500)]
    public string MaterialNeeded { get; set; } = string.Empty;

    // Foreign Key to ExerciseCategory
    public int? ExerciseCategoryId { get; set; }

    // Foreign Key to Difficulty
    public int? DifficultyId { get; set; }

    public bool IsSystemExercise { get; set; } = false; // true = ejercicio del sistema, false = personalizado
    public Guid? CreatedByUserId { get; set; } // null si es ejercicio del sistema
    
    // Para el marketplace
    public bool IsPublic { get; set; } = false;
    public decimal AverageRating { get; set; } = 0;
    public int RatingCount { get; set; } = 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    
    // Relaciones
    public User? CreatedBy { get; set; }
    public Masters.ExerciseCategory? ExerciseCategory { get; set; }
    public Masters.Difficulty? Difficulty { get; set; }
    public ICollection<ExerciseConcept> ExerciseConcepts { get; set; } = new List<ExerciseConcept>();
    public ICollection<SessionExercise> SessionExercises { get; set; } = new List<SessionExercise>();
    public ICollection<ExerciseRating> Ratings { get; set; } = new List<ExerciseRating>();
}

public class ExerciseConcept
{
    public Guid ExerciseId { get; set; }
    public Guid ConceptId { get; set; }
    
    // Relaciones
    public Exercise Exercise { get; set; } = null!;
    public Concept Concept { get; set; } = null!;
}

public class ExerciseRating
{
    public Guid Id { get; set; }
    public Guid ExerciseId { get; set; }
    public Guid UserId { get; set; }
    
    public int Rating { get; set; } // 1-5 estrellas
    
    [MaxLength(500)]
    public string Comment { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Relaciones
    public Exercise Exercise { get; set; } = null!;
    public User User { get; set; } = null!;
}