using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models.DTOs;

public class ObjectiveDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ObjectivePriority Priority { get; set; }
    public ObjectiveStatus Status { get; set; }
    public int Progress { get; set; }
    public DateTime? DueDate { get; set; }
    public int? TeamId { get; set; }
    public string TeamName { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; }
}

public class CreateObjectiveRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    public ObjectivePriority Priority { get; set; } = ObjectivePriority.Media;
    
    public ObjectiveStatus Status { get; set; } = ObjectiveStatus.NoIniciado;
    
    [Range(0, 100)]
    public int Progress { get; set; } = 0;
    
    public DateTime? DueDate { get; set; }
    
    public int? TeamId { get; set; }
    
    public List<string> Tags { get; set; } = new();
}

public class UpdateObjectiveRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    public ObjectivePriority Priority { get; set; }
    
    public ObjectiveStatus Status { get; set; }
    
    [Range(0, 100)]
    public int Progress { get; set; }
    
    public DateTime? DueDate { get; set; }
    
    public int? TeamId { get; set; }
    
    public List<string> Tags { get; set; } = new();
}

public class ObjectiveFilterDto
{
    public ObjectivePriority? Priority { get; set; }
    public ObjectiveStatus? Status { get; set; }
    public int? TeamId { get; set; }
    public DateTime? DueBefore { get; set; }
    public DateTime? DueAfter { get; set; }
    public string? Tag { get; set; }
    public string? Search { get; set; }
    public int? MinProgress { get; set; }
    public int? MaxProgress { get; set; }
}