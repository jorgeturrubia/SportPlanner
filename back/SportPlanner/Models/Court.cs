using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class Court
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    public string? Location { get; set; }
    public bool IsActive { get; set; } = true;
}
