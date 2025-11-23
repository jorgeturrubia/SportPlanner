using System;
using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public enum SubscriptionChangeType
{
    Upgrade,
    Downgrade,
    Cancel,
    Reactivate,
    Extend
}

public class SubscriptionHistory
{
    public int Id { get; set; }
    [Required]
    public int SubscriptionId { get; set; }
    public Subscription? Subscription { get; set; }
    public int? OldPlanId { get; set; }
    public int? NewPlanId { get; set; }
    public SubscriptionChangeType ChangeType { get; set; }
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public DateTime EffectiveAt { get; set; }
    public string? ChangedByUserSupabaseId { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
