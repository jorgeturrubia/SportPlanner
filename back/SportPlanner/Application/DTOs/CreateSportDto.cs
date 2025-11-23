using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Application.DTOs;

public class CreateSportDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    public bool IsActive { get; set; } = true;
}
