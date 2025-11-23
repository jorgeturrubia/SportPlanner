using System;

namespace SportPlanner.Application.DTOs;

public class CreateSubscriptionDto
{
    // If omitted, we'll assume this is the authenticated user creating it
    public string? UserSupabaseId { get; set; }
    public int? OrganizationId { get; set; }
    public int PlanId { get; set; }
    public int SportId { get; set; }
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    public bool AutoRenew { get; set; } = false;
}
