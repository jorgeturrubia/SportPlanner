using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class CustomExercise
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string Instructions { get; set; } = string.Empty;
    
    public ExerciseCategory Category { get; set; } = ExerciseCategory.Tecnico;
    
    public DifficultyLevel Difficulty { get; set; } = DifficultyLevel.Principiante;
    
    [Range(1, 300)]
    public int DurationMinutes { get; set; } = 15;
    
    [Range(1, 50)]
    public int MinPlayers { get; set; } = 1;
    
    [Range(1, 50)]
    public int MaxPlayers { get; set; } = 10;
    
    [MaxLength(500)]
    public string Equipment { get; set; } = string.Empty;
    
    public List<string> Tags { get; set; } = new();
    
    public bool IsPublic { get; set; } = false;
    
    public bool IsCustom { get; set; } = true;
    
    public int UsageCount { get; set; } = 0;
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public Guid CreatedByUserId { get; set; }
    
    // Navigation properties
    public User? CreatedBy { get; set; }
}

public enum ExerciseCategory
{
    Tecnico = 0,
    Tactico = 1,
    Fisico = 2,
    Psicologico = 3,
    Coordinacion = 4
}

public enum DifficultyLevel
{
    Principiante = 0,
    Intermedio = 1,
    Avanzado = 2,
    Experto = 3
}