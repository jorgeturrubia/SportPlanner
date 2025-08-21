using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Api.Models;

/// <summary>
/// Represents a sports team within the PlanSport platform
/// </summary>
public class Team
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public Guid SportId { get; set; }

    [ForeignKey(nameof(SportId))]
    public Sport Sport { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty; // Categoría por edad: Sub-8, Sub-10, etc.

    [Required]
    [MaxLength(10)]
    public string Gender { get; set; } = string.Empty; // Masculino, Femenino, Mixto

    [Required]
    [MaxLength(10)]
    public string Level { get; set; } = string.Empty; // A, B, C

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public int MaxPlayers { get; set; } = 20; // Número máximo de jugadores

    [Required]
    public TeamStatus Status { get; set; } = TeamStatus.Active;

    [Required]
    public Guid CreatedByUserId { get; set; } // ID del usuario que creó el equipo

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<TeamMember> TeamMembers { get; set; } = new List<TeamMember>();
}

/// <summary>
/// Represents the status of a team
/// </summary>
public enum TeamStatus
{
    Active = 1,
    Inactive = 2,
    Suspended = 3,
    Archived = 4
}