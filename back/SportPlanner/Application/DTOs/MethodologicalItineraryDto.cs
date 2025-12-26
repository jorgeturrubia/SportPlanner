using SportPlanner.Application.DTOs.Team;

namespace SportPlanner.Application.DTOs;

public class MethodologicalItineraryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int SportId { get; set; }
    public string? SportName { get; set; }
    
    public List<PlanningTemplateSimpleDto> PlanningTemplates { get; set; } = new();
    
    // Marketplace stats
    public double AverageRating { get; set; }
    public int RatingCount { get; set; }
    public bool IsSystem { get; set; }
    public string? AuthorName { get; set; }
    public string? OwnerId { get; set; }
    public int Version { get; set; }
}
