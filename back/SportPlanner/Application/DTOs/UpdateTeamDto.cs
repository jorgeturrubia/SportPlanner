using System;

namespace SportPlanner.Application.DTOs;

public class UpdateTeamDto
{
    public string Name { get; set; } = null!;
    public int? TeamCategoryId { get; set; }
    public int? TeamLevelId { get; set; }
    public int CurrentTechnicalLevel { get; set; }
    public int CurrentTacticalLevel { get; set; }
    public string? PhotoUrl { get; set; }
    public int? SeasonId { get; set; }
}
