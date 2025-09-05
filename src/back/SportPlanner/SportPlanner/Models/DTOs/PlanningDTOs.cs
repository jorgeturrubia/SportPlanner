using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SportPlanner.Models.DTOs;

public class PlanningDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("type")]
    public PlanningType Type { get; set; }
    
    [JsonPropertyName("status")]
    public PlanningStatus Status { get; set; }
    
    [JsonPropertyName("teamId")]
    public string? TeamId { get; set; }
    
    [JsonPropertyName("teamName")]
    public string? TeamName { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }
    
    [JsonPropertyName("trainingDays")]
    public List<DayOfWeek> TrainingDays { get; set; } = new();
    
    [JsonPropertyName("startTime")]
    public string StartTime { get; set; } = string.Empty;
    
    [JsonPropertyName("durationMinutes")]
    public int DurationMinutes { get; set; }
    
    [JsonPropertyName("sessionsPerWeek")]
    public int SessionsPerWeek { get; set; }
    
    [JsonPropertyName("totalSessions")]
    public int TotalSessions { get; set; }
    
    [JsonPropertyName("completedSessions")]
    public int CompletedSessions { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
    
    [JsonPropertyName("isPublic")]
    public bool? IsPublic { get; set; }
    
    [JsonPropertyName("createdBy")]
    public string CreatedBy { get; set; } = string.Empty;
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }
    
    [JsonPropertyName("tags")]
    public List<string>? Tags { get; set; } = new();
}

public class CreatePlanningRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    public PlanningType Type { get; set; } = PlanningType.TeamSpecific;
    
    public PlanningStatus Status { get; set; } = PlanningStatus.Draft;
    
    public Guid? TeamId { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }
    
    [Required]
    public DateTime EndDate { get; set; }
    
    public List<DayOfWeek> TrainingDays { get; set; } = new();
    
    [Required]
    public TimeSpan StartTime { get; set; }
    
    [Range(30, 300)]
    public int DurationMinutes { get; set; } = 90;
    
    [Range(1, 7)]
    public int SessionsPerWeek { get; set; } = 2;
    
    public bool IsPublic { get; set; } = false;
    
    public List<string> Tags { get; set; } = new();
}

public class UpdatePlanningRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    public PlanningType Type { get; set; }
    
    public PlanningStatus Status { get; set; }
    
    public Guid? TeamId { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }
    
    [Required]
    public DateTime EndDate { get; set; }
    
    public List<DayOfWeek> TrainingDays { get; set; } = new();
    
    [Required]
    public TimeSpan StartTime { get; set; }
    
    [Range(30, 300)]
    public int DurationMinutes { get; set; }
    
    [Range(1, 7)]
    public int SessionsPerWeek { get; set; }
    
    public bool IsPublic { get; set; }
    
    public List<string> Tags { get; set; } = new();
}

public class PlanningFilterDto
{
    public PlanningType? Type { get; set; }
    public PlanningStatus? Status { get; set; }
    public Guid? TeamId { get; set; }
    public DateTime? StartDateFrom { get; set; }
    public DateTime? StartDateTo { get; set; }
    public DateTime? EndDateFrom { get; set; }
    public DateTime? EndDateTo { get; set; }
    public bool? IsPublic { get; set; }
    public bool? IsActive { get; set; }
    public string? Search { get; set; }
    public string? Tag { get; set; }
    public List<DayOfWeek>? TrainingDays { get; set; }
    public int? MinDuration { get; set; }
    public int? MaxDuration { get; set; }
    public int? MinSessionsPerWeek { get; set; }
    public int? MaxSessionsPerWeek { get; set; }
}