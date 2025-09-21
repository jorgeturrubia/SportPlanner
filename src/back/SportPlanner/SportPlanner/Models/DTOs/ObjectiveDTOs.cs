using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SportPlanner.Models.DTOs;

// Objective Category DTOs
public class ObjectiveCategoryDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
}

public class ObjectiveSubcategoryDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("objectiveCategoryId")]
    public int ObjectiveCategoryId { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
}

public class ObjectiveDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    // Objective type
    [JsonPropertyName("objectiveCategoryId")]
    public int ObjectiveCategoryId { get; set; }

    [JsonPropertyName("objectiveSubcategoryId")]
    public int ObjectiveSubcategoryId { get; set; }

    [JsonPropertyName("objectiveCategoryName")]
    public string ObjectiveCategoryName { get; set; } = string.Empty;

    [JsonPropertyName("objectiveSubcategoryName")]
    public string ObjectiveSubcategoryName { get; set; } = string.Empty;

    // Identification
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("tags")]
    public string Tags { get; set; } = string.Empty;

    // Exercises
    [JsonPropertyName("exercises")]
    public List<ObjectiveExerciseDto> Exercises { get; set; } = new();

    // Relations
    [JsonPropertyName("teamId")]
    public string? TeamId { get; set; }

    // System fields
    [JsonPropertyName("createdBy")]
    public string CreatedBy { get; set; } = string.Empty;

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
}

public class ObjectiveExerciseDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("exerciseId")]
    public string ExerciseId { get; set; } = string.Empty;

    [JsonPropertyName("exerciseName")]
    public string ExerciseName { get; set; } = string.Empty;

    [JsonPropertyName("order")]
    public int Order { get; set; }

    [JsonPropertyName("notes")]
    public string? Notes { get; set; }
}

public class CreateObjectiveRequest
{
    // Objective type
    [Required]
    [JsonPropertyName("objectiveCategoryId")]
    public int ObjectiveCategoryId { get; set; }

    [Required]
    [JsonPropertyName("objectiveSubcategoryId")]
    public int ObjectiveSubcategoryId { get; set; }

    // Identification
    [Required]
    [MaxLength(200)]
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("tags")]
    public string Tags { get; set; } = string.Empty;

    [JsonPropertyName("teamId")]
    public string? TeamId { get; set; }
}

public class UpdateObjectiveRequest
{
    // Objective type
    [Required]
    [JsonPropertyName("objectiveCategoryId")]
    public int ObjectiveCategoryId { get; set; }

    [Required]
    [JsonPropertyName("objectiveSubcategoryId")]
    public int ObjectiveSubcategoryId { get; set; }

    // Identification
    [Required]
    [MaxLength(200)]
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("tags")]
    public string Tags { get; set; } = string.Empty;

    [JsonPropertyName("teamId")]
    public string? TeamId { get; set; }
}

public class ObjectiveFilterDto
{
    public int? Priority { get; set; }
    public int? Status { get; set; }
    public string? TeamId { get; set; }
    public DateTime? DueBefore { get; set; }
    public DateTime? DueAfter { get; set; }
    public string? Tag { get; set; }
    public string? Search { get; set; }
    public int? MinProgress { get; set; }
    public int? MaxProgress { get; set; }
}