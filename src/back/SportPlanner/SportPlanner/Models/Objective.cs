using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class Objective
{
    public int Id { get; set; }
    
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
    Baja = 0,
    Media = 1,
    Alta = 2,
    Critica = 3
}

public enum ObjectiveStatus
{
    NoIniciado = 0,
    EnProgreso = 1,
    Completado = 2,
    EnPausa = 3
}