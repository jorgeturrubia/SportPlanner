using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class ConceptCategory
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}
