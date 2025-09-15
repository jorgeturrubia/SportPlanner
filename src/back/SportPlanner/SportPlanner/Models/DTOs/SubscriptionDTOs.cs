using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models.DTOs;

public class CreateSubscriptionRequest
{
    [Required]
    public int SubscriptionId { get; set; }
    
    [Required]
    public SportType Sport { get; set; }
    
    public DateTime? EndDate { get; set; }
}

public class UpdateSubscriptionRequest
{
    [Required]
    public int SubscriptionId { get; set; }
    
    [Required]
    public SportType Sport { get; set; }
    
    public DateTime? EndDate { get; set; }
    
    public bool IsActive { get; set; } = true;
}

public class SubscriptionResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int SubscriptionId { get; set; }
    public SubscriptionType SubscriptionType { get; set; }
    public string SubscriptionName { get; set; } = string.Empty;
    public SportType Sport { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UserSubscriptionStatusResponse
{
    public bool HasActiveSubscription { get; set; }
    public SubscriptionResponse? ActiveSubscription { get; set; }
    public List<SubscriptionResponse> AllSubscriptions { get; set; } = new();
}

public class AvailableSubscriptionResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public SubscriptionType Type { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public int MaxTeams { get; set; }
    public int MaxTrainingSessions { get; set; }
    public bool CanCreateCustomConcepts { get; set; }
    public bool CanCreateItineraries { get; set; }
    public bool HasDirectorMode { get; set; }
}

public class SportTypeResponse
{
    public SportType SportType { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
