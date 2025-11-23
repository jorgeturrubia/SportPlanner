using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class DifficultyLevel
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!; // Beginner, Easy, Medium, Hard, Expert
    public int Rank { get; set; } // 1..N, smaller = easier
    public bool IsActive { get; set; } = true;
}
