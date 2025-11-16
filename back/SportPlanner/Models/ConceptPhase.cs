using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class ConceptPhase
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!; // Offense, Defense, Both
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}
