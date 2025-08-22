using SportPlanner.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Api.Dtos;

/// <summary>
/// DTO for creating a new objective
/// </summary>
public class CreateObjectiveDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(1000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public ObjectiveCategory Category { get; set; }

    [Required]
    public ObjectiveDifficulty Difficulty { get; set; }

    [Required]
    [Range(5, 300)]
    public int EstimatedDuration { get; set; }

    [Required]
    [StringLength(100)]
    public string TargetAgeGroup { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Sport { get; set; } = string.Empty;

    public List<string> Tags { get; set; } = new();

    public List<string>? Prerequisites { get; set; }

    public List<string> EquipmentNeeded { get; set; } = new();

    [Required]
    [Range(1, 100)]
    public int MaxParticipants { get; set; } = 25;

    [Required]
    [Range(1, 50)]
    public int MinParticipants { get; set; } = 1;

    [Required]
    public bool IsPublic { get; set; } = true;
}

/// <summary>
/// DTO for updating an existing objective
/// </summary>
public class UpdateObjectiveDto
{
    [StringLength(200, MinimumLength = 3)]
    public string? Title { get; set; }

    [StringLength(1000, MinimumLength = 10)]
    public string? Description { get; set; }

    public ObjectiveCategory? Category { get; set; }

    public ObjectiveDifficulty? Difficulty { get; set; }

    public ObjectiveStatus? Status { get; set; }

    [Range(5, 300)]
    public int? EstimatedDuration { get; set; }

    [StringLength(100)]
    public string? TargetAgeGroup { get; set; }

    [StringLength(50)]
    public string? Sport { get; set; }

    public List<string>? Tags { get; set; }

    public List<string>? Prerequisites { get; set; }

    public List<string>? EquipmentNeeded { get; set; }

    [Range(1, 100)]
    public int? MaxParticipants { get; set; }

    [Range(1, 50)]
    public int? MinParticipants { get; set; }

    public bool? IsPublic { get; set; }
}

/// <summary>
/// DTO for objective responses
/// </summary>
public class ObjectiveResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ObjectiveCategory Category { get; set; }
    public ObjectiveDifficulty Difficulty { get; set; }
    public ObjectiveStatus Status { get; set; }
    public int EstimatedDuration { get; set; }
    public string TargetAgeGroup { get; set; } = string.Empty;
    public string Sport { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public List<string>? Prerequisites { get; set; }
    public List<string> EquipmentNeeded { get; set; } = new();
    public int MaxParticipants { get; set; }
    public int MinParticipants { get; set; }
    public bool IsPublic { get; set; }
    public Guid CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public decimal Rating { get; set; }
    public int UsageCount { get; set; }
}

/// <summary>
/// DTO for paginated objective responses
/// </summary>
public class ObjectivesListResponseDto
{
    public List<ObjectiveResponseDto> Objectives { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int Limit { get; set; }
}

/// <summary>
/// DTO for objective filters
/// </summary>
public class ObjectiveFilterDto
{
    public ObjectiveCategory? Category { get; set; }
    public ObjectiveDifficulty? Difficulty { get; set; }
    public string? Sport { get; set; }
    public bool? IsPublic { get; set; }
    public int? Page { get; set; } = 1;
    public int? Limit { get; set; } = 10;
    public string? Search { get; set; }
}