using SportPlanner.Application.DTOs;

namespace SportPlanner.Application.DTOs;

public class MarketplaceItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string ItemType { get; set; } = null!; // "itinerary", "template", "concept", "exercise"
    
    // Common Metadata
    public string? AuthorName { get; set; }
    public double AverageRating { get; set; }
    public int RatingCount { get; set; }
    public int Version { get; set; }
    
    // Specific metadata (optional)
    public string? SportName { get; set; }
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public int? ParentCategoryId { get; set; }
    public int? ElementCount { get; set; } // e.g., number of templates in itinerary, number of concepts in template
    
    // Indicates if the current user has already downloaded this item
    public bool IsDownloaded { get; set; }
}
