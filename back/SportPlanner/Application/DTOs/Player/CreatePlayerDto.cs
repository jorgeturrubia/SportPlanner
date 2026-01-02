using System;

namespace SportPlanner.Application.DTOs.Player;

public class CreatePlayerDto
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public DateTime? DateOfBirth { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public int TeamId { get; set; }
}
