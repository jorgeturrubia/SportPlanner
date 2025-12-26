namespace SportPlanner.Application.DTOs;

public class MarketplaceFilterDto
{
    public string? AuthorId { get; set; }
    public int? MinRating { get; set; }
    public int? TeamCategoryId { get; set; }
    public string? SearchTerm { get; set; }
}
