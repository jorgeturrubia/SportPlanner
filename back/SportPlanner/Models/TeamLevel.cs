using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class TeamLevel
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!; // e.g. A, B, C
    public int Rank { get; set; } // higher = stronger
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}
