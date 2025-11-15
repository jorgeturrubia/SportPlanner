using System;

namespace SportPlanner.Application.DTOs;

public class SubscriptionDto
{
    public int Id { get; set; }
    public string? UserSupabaseId { get; set; }
    public int? OrganizationId { get; set; }
    public int PlanId { get; set; }
    public PlanDto? Plan { get; set; }
    public int SportId { get; set; }
    public SportDto? Sport { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }
    public string Status { get; set; } = null!;
    public DateTime? NextBillingDate { get; set; }
    public DateTime? CancelledAt { get; set; }
    public DateTime? RetentionEndsAt { get; set; }
}
