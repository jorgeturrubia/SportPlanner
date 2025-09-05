using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SportPlanner.Models.DTOs;

public class CustomExerciseDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    
    [JsonPropertyName("instructions")]
    public string Instructions { get; set; } = string.Empty;
    
    [JsonPropertyName("category")]
    public ExerciseCategory Category { get; set; }
    
    [JsonPropertyName("difficulty")]
    public DifficultyLevel Difficulty { get; set; }
    
    [JsonPropertyName("durationMinutes")]
    public int DurationMinutes { get; set; }
    
    [JsonPropertyName("minPlayers")]
    public int MinPlayers { get; set; }
    
    [JsonPropertyName("maxPlayers")]
    public int MaxPlayers { get; set; }
    
    [JsonPropertyName("equipment")]
    public string Equipment { get; set; } = string.Empty;
    
    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = new();
    
    [JsonPropertyName("isPublic")]
    public bool IsPublic { get; set; }
    
    [JsonPropertyName("isCustom")]
    public bool IsCustom { get; set; }
    
    [JsonPropertyName("usageCount")]
    public int UsageCount { get; set; }
    
    [JsonPropertyName("createdBy")]
    public string CreatedBy { get; set; } = string.Empty;
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
}

public class CreateCustomExerciseRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string Instructions { get; set; } = string.Empty;
    
    public ExerciseCategory Category { get; set; } = ExerciseCategory.Technical;
    
    public DifficultyLevel Difficulty { get; set; } = DifficultyLevel.Beginner;
    
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
}

public class UpdateCustomExerciseRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string Instructions { get; set; } = string.Empty;
    
    public ExerciseCategory Category { get; set; }
    
    public DifficultyLevel Difficulty { get; set; }
    
    [Range(1, 300)]
    public int DurationMinutes { get; set; }
    
    [Range(1, 50)]
    public int MinPlayers { get; set; }
    
    [Range(1, 50)]
    public int MaxPlayers { get; set; }
    
    [MaxLength(500)]
    public string Equipment { get; set; } = string.Empty;
    
    public List<string> Tags { get; set; } = new();
    
    public bool IsPublic { get; set; }
}

public class CustomExerciseFilterDto
{
    public ExerciseCategory? Category { get; set; }
    public DifficultyLevel? Difficulty { get; set; }
    public int? MinDuration { get; set; }
    public int? MaxDuration { get; set; }
    public int? MinPlayers { get; set; }
    public int? MaxPlayers { get; set; }
    public string? Tag { get; set; }
    public string? Search { get; set; }
    public bool? IsPublic { get; set; }
    public bool? IsCustom { get; set; }
    public string? Equipment { get; set; }
}