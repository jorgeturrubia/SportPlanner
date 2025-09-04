using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models.DTOs;

public class TeamDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Sport { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public TeamLevel Level { get; set; }
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
    [MaxLength(50)]
    public string Sport { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;
    
    public Gender Gender { get; set; }
    public TeamLevel Level { get; set; }
    
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
    [MaxLength(50)]
    public string Sport { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;
    
    public Gender Gender { get; set; }
    public TeamLevel Level { get; set; }
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
}