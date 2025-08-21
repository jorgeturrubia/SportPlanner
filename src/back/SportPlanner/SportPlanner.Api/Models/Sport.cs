using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Api.Models;

/// <summary>
/// Represents a sport within the PlanSport platform
/// </summary>
public class Sport
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty; // Deportes de equipo, individuales, etc.

    [Required]
    public int DefaultMaxPlayers { get; set; } = 20; // Número por defecto de jugadores

    [Required]
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Team> Teams { get; set; } = new List<Team>();
}