using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SportPlanner.Models.DTOs;

public class ObjectiveDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;
    
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    
    [JsonPropertyName("priority")]
    public ObjectivePriority Priority { get; set; }
    
    [JsonPropertyName("status")]
    public ObjectiveStatus Status { get; set; }
    
    [JsonPropertyName("progress")]
    public int Progress { get; set; }
    
    [JsonPropertyName("targetDate")]
    public DateTime? TargetDate { get; set; }
    
    [JsonPropertyName("completedDate")]
    public DateTime? CompletedDate { get; set; }
    
    [JsonPropertyName("teamId")]
    public string? TeamId { get; set; }
    
    [JsonPropertyName("teamName")]
    public string? TeamName { get; set; }
    
    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = new();
    
    [JsonPropertyName("createdBy")]
    public string CreatedBy { get; set; } = string.Empty;
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
}

public class CreateObjectiveRequest
{
    [Required]
    [MaxLength(200)]
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    
    [JsonPropertyName("priority")]
    public ObjectivePriority Priority { get; set; } = ObjectivePriority.Medium;
    
    [JsonPropertyName("targetDate")]
    public DateTime? TargetDate { get; set; }
    
    [JsonPropertyName("teamId")]
    public string? TeamId { get; set; }
    
    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = new();
}

public class UpdateObjectiveRequest
{
    [Required]
    [MaxLength(200)]
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    
    [JsonPropertyName("priority")]
    public ObjectivePriority Priority { get; set; }
    
    [JsonPropertyName("status")]
    public ObjectiveStatus Status { get; set; }
    
    [Range(0, 100)]
    [JsonPropertyName("progress")]
    public int Progress { get; set; }
    
    [JsonPropertyName("targetDate")]
    public DateTime? TargetDate { get; set; }
    
    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = new();
}

public class ObjectiveFilterDto
{
    public ObjectivePriority? Priority { get; set; }
    public ObjectiveStatus? Status { get; set; }
    public string? TeamId { get; set; }
    public DateTime? DueBefore { get; set; }
    public DateTime? DueAfter { get; set; }
    public string? Tag { get; set; }
    public string? Search { get; set; }
    public int? MinProgress { get; set; }
    public int? MaxProgress { get; set; }
}