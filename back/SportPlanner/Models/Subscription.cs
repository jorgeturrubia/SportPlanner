using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Models;

public enum SubscriptionStatus
{
    Pending = 0,
    Active = 1,
    Suspended = 2,
    Cancelled = 3,
    Expired = 4
}

public class Subscription
{
    public int Id { get; set; }

    // Either UserSupabaseId OR OrganizationId should be set (validation / DB check constraint)
    public string? UserSupabaseId { get; set; }
    public int? OrganizationId { get; set; }

    [Required]
    public int PlanId { get; set; }
    public SubscriptionPlan? Plan { get; set; }

    [Required]
    public int SportId { get; set; }
    public Sport? Sport { get; set; }

    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Pending;
    public bool AutoRenew { get; set; } = false;
    public DateTime? NextBillingDate { get; set; }
    public DateTime? CancelledAt { get; set; }
    public DateTime? RetentionEndsAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Nav properties
    public ApplicationUser? User { get; set; }
    public Organization? Organization { get; set; }
}
