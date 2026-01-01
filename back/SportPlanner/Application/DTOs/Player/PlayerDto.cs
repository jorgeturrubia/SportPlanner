using System;

namespace SportPlanner.Application.DTOs.Player;

public class PlayerDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string FullName => $"{FirstName} {LastName}";
    public DateTime? DateOfBirth { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public int TeamId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
