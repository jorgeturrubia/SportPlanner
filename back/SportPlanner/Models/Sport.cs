using System;
using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class Sport
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
