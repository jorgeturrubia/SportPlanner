namespace SportPlanner.Application.DTOs.ConceptTemplate;

public class ConceptTemplateCreateDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int TechnicalComplexity { get; set; }
    public int TacticalComplexity { get; set; }
    public int? ConceptCategoryId { get; set; }
    public int SportId { get; set; }
}

public class ConceptTemplateUpdateDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int? TechnicalComplexity { get; set; }
    public int? TacticalComplexity { get; set; }
    public int? ConceptCategoryId { get; set; }
    public bool? IsActive { get; set; }
}

public class ConceptTemplateResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int TechnicalComplexity { get; set; }
    public int TacticalComplexity { get; set; }
    public int? ConceptCategoryId { get; set; }
    public string? ConceptCategoryName { get; set; }
    public int SportId { get; set; }
    public string? SportName { get; set; }
    public bool IsActive { get; set; }
}
