using System;

namespace SportPlanner.Application.DTOs;

public class CreateTeamDto
{
    public string Name { get; set; } = null!;
    public string? OwnerUserSupabaseId { get; set; }
    public int? OrganizationId { get; set; }
    public int SportId { get; set; }
    public int? SubscriptionId { get; set; }
    public int? TeamCategoryId { get; set; }
    public int? TeamLevelId { get; set; }
    public int CurrentTechnicalLevel { get; set; }
    public int CurrentTacticalLevel { get; set; }
}
