using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class TeamCategory
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!; // e.g. U10, U12, Senior
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}
