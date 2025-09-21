using System.ComponentModel.DataAnnotations;
using SportPlanner.Models.Masters;

namespace SportPlanner.Models;

public class Team
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    // Foreign Keys to Master entities
    public int SportId { get; set; }
    public int CategoryId { get; set; }
    public int SportGenderId { get; set; }
    public int LevelId { get; set; }
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    public Guid? OrganizationId { get; set; }
    public Guid CreatedByUserId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public bool IsVisible { get; set; } = true; // Para ocultar equipos de años anteriores
    
    // Navigation properties to Master entities
    public Sport Sport { get; set; } = null!;
    public Category Category { get; set; } = null!;
    public SportGender SportGender { get; set; } = null!;
    public Level Level { get; set; } = null!;

    // Other navigation properties
    public Organization? Organization { get; set; }
    public User CreatedBy { get; set; } = null!;
    public ICollection<UserTeam> UserTeams { get; set; } = new List<UserTeam>();
}

public class UserTeam
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid TeamId { get; set; }
    public int Role { get; set; } = 3; // Coach by default

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    // Relaciones
    public User User { get; set; } = null!;
    public Team Team { get; set; } = null!;
}