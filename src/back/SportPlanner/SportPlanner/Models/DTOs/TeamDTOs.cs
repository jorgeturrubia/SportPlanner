using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models.DTOs;

public class TeamDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // Master entity IDs
    public int SportId { get; set; }
    public int CategoryId { get; set; }
    public int SportGenderId { get; set; }
    public int LevelId { get; set; }

    // Master entity names for display
    public string SportName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string SportGenderName { get; set; } = string.Empty;
    public string LevelName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
    public Guid? OrganizationId { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int MemberCount { get; set; }
    public bool IsActive { get; set; }
    public bool IsVisible { get; set; }
}

public class CreateTeamRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public int SportId { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int SportGenderId { get; set; }

    [Required]
    public int LevelId { get; set; }

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public Guid? OrganizationId { get; set; }
}

public class UpdateTeamRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public int SportId { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int SportGenderId { get; set; }

    [Required]
    public int LevelId { get; set; }

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
}