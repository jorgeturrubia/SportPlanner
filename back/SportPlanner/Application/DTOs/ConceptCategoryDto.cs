using System.Collections.Generic;

namespace SportPlanner.Application.DTOs;

public class ConceptCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int? ParentId { get; set; }
    public List<ConceptCategoryDto> SubCategories { get; set; } = new List<ConceptCategoryDto>();
}
