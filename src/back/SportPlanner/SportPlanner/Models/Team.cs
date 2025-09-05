using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public enum Gender
{
    Male = 0,
    Female = 1,
    Mixed = 2
}

public enum TeamLevel
{
    A = 0, // Nivel alto
    B = 1, // Nivel medio
    C = 2  // Nivel básico
}

public class Team
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Sport { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty; // Categoría por edad (Alevín, Infantil, etc.)
    
    public Gender Gender { get; set; }
    public TeamLevel Level { get; set; }
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    public Guid? OrganizationId { get; set; }
    public Guid CreatedByUserId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public bool IsVisible { get; set; } = true; // Para ocultar equipos de años anteriores
    
    // Relaciones
    public Organization? Organization { get; set; }
    public User CreatedBy { get; set; } = null!;
    public ICollection<UserTeam> UserTeams { get; set; } = new List<UserTeam>();
}

public enum UserRole
{
    Administrator = 0,
    Director = 1,
    Coach = 2,
    Assistant = 3
}

public class UserTeam
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid TeamId { get; set; }
    public UserRole Role { get; set; }
    
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    
    // Relaciones
    public User User { get; set; } = null!;
    public Team Team { get; set; } = null!;
}