using System;

namespace SportPlanner.Application.DTOs;

public class PlanDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int Level { get; set; }
    public decimal Price { get; set; }
    public int? MaxTeams { get; set; }
    public int? MaxMembersPerTeam { get; set; }
}
