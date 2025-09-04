using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class User
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string SupabaseId { get; set; } = string.Empty;
    
    public UserRole Role { get; set; } = UserRole.Coach;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    
    // Relaciones
    public ICollection<UserSubscription> Subscriptions { get; set; } = new List<UserSubscription>();
    public ICollection<UserTeam> UserTeams { get; set; } = new List<UserTeam>();
    public ICollection<Organization> CreatedOrganizations { get; set; } = new List<Organization>();
}