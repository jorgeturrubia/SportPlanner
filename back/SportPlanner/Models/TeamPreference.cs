using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class TeamPreference
{
    public int Id { get; set; }
    public int TeamId { get; set; }
    public Team? Team { get; set; }
    public string? PreferencesJson { get; set; } // JSON containing weights like {"Technical":70, "Tactical":30, "Dribbling":40}
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
