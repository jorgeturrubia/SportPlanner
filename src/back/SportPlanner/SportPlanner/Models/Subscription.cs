using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public enum SubscriptionType
{
    Free = 0,
    Coach = 1,
    Club = 2
}

public enum SportType
{
    Football = 0,
    Basketball = 1,
    Tennis = 2,
    Volleyball = 3,
    Rugby = 4,
    Handball = 5,
    Hockey = 6,
    Baseball = 7,
    Swimming = 8,
    Athletics = 9,
    Other = 10
}

public class Subscription
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    
    public SubscriptionType Type { get; set; }
    
    public decimal Price { get; set; }
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    public int MaxTeams { get; set; }
    public int MaxTrainingSessions { get; set; }
    public bool CanCreateCustomConcepts { get; set; }
    public bool CanCreateItineraries { get; set; }
    public bool HasDirectorMode { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Relaciones
    public ICollection<UserSubscription> UserSubscriptions { get; set; } = new List<UserSubscription>();
}

public class UserSubscription
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int SubscriptionId { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    
    [Required]
    public SportType Sport { get; set; }
    
    // Relaciones
    public User User { get; set; } = null!;
    public Subscription Subscription { get; set; } = null!;
}
