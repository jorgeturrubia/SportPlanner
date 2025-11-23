using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Application.DTOs;

public class CreateConceptCategoryDto
{
    [Required]
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int? ParentId { get; set; }
}
