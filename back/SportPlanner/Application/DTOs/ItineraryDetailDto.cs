using System.Collections.Generic;

namespace SportPlanner.Application.DTOs;

public class ItineraryDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? SportName { get; set; }
    public string? AuthorName { get; set; }
    public double AverageRating { get; set; }
    public int RatingCount { get; set; }
    public int Version { get; set; }
    
    public List<string> UniqueConcepts { get; set; } = new();
    public List<TemplateDetailDto> Templates { get; set; } = new();
}

public class TemplateDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? CategoryName { get; set; }
    public List<string> Concepts { get; set; } = new();
}
