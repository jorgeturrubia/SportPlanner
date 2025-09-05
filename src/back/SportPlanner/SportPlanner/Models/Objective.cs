using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class Objective
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    public ObjectivePriority Priority { get; set; } = ObjectivePriority.Medium;
    
    public ObjectiveStatus Status { get; set; } = ObjectiveStatus.NotStarted;
    
    [Range(0, 100)]
    public int Progress { get; set; } = 0;
    
    public DateTime? TargetDate { get; set; }
    
    public DateTime? CompletedDate { get; set; }
    
    public Guid? TeamId { get; set; }
    
    public List<string> Tags { get; set; } = new();
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public Guid CreatedByUserId { get; set; }
    
    // Navigation properties
    public Team? Team { get; set; }
    public User? CreatedBy { get; set; }
}

public enum ObjectivePriority
{
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
}

public enum ObjectiveStatus
{
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    OnHold = 3
}