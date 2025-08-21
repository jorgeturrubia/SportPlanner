using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Api.Models;

/// <summary>
/// Represents a team member relationship between users and teams
/// </summary>
public class TeamMember
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid TeamId { get; set; }

    [ForeignKey(nameof(TeamId))]
    public Team Team { get; set; } = null!;

    [Required]
    public Guid UserId { get; set; } // Supabase user ID

    [Required]
    [MaxLength(50)]
    public string UserName { get; set; } = string.Empty; // Cached user name

    [Required]
    [MaxLength(100)]
    public string UserEmail { get; set; } = string.Empty; // Cached user email

    [Required]
    public TeamMemberRole Role { get; set; } = TeamMemberRole.Player;

    [MaxLength(20)]
    public string? JerseyNumber { get; set; } // Número de camiseta para jugadores

    [MaxLength(50)]
    public string? Position { get; set; } // Posición en el deporte

    [Required]
    public TeamMemberStatus Status { get; set; } = TeamMemberStatus.Active;

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(200)]
    public string? Notes { get; set; } // Notas adicionales
}

/// <summary>
/// Represents the role of a team member
/// </summary>
public enum TeamMemberRole
{
    Player = 1,
    Coach = 2,
    AssistantCoach = 3,
    Manager = 4
}

/// <summary>
/// Represents the status of a team member
/// </summary>
public enum TeamMemberStatus
{
    Active = 1,
    Inactive = 2,
    Suspended = 3,
    Removed = 4
}