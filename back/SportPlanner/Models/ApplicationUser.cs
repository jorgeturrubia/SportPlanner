using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Models;

public class ApplicationUser
{
    // Use the Supabase `sub` claim as the primary key (string UUID)
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public string SupabaseId { get; set; } = null!;

    public string? Email { get; set; }
    public string? Name { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
