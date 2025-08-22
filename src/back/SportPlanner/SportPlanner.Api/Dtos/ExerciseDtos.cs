using SportPlanner.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Api.Dtos;

/// <summary>
/// DTO for creating a new exercise
/// </summary>
public class CreateExerciseDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(2000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public ExerciseCategory Category { get; set; }

    [Required]
    public ExerciseDifficulty Difficulty { get; set; }

    [Required]
    [Range(1, 180)]
    public int Duration { get; set; }

    [Required]
    [Range(1, 50)]
    public int MinParticipants { get; set; } = 1;

    [Required]
    [Range(1, 100)]
    public int MaxParticipants { get; set; } = 25;

    public List<string> TargetAgeGroup { get; set; } = new();

    [Required]
    [StringLength(50)]
    public string Sport { get; set; } = string.Empty;

    public List<string> Objectives { get; set; } = new();

    public List<string> Instructions { get; set; } = new();

    public List<string> SafetyNotes { get; set; } = new();

    public List<string> Equipment { get; set; } = new();

    public List<string> Variations { get; set; } = new();

    public List<string> Tags { get; set; } = new();

    [Required]
    [StringLength(100)]
    public string SpaceRequired { get; set; } = string.Empty;

    [Required]
    public bool IsPublic { get; set; } = true;
}

/// <summary>
/// DTO for updating an existing exercise
/// </summary>
public class UpdateExerciseDto
{
    [StringLength(200, MinimumLength = 3)]
    public string? Name { get; set; }

    [StringLength(2000, MinimumLength = 10)]
    public string? Description { get; set; }

    public ExerciseCategory? Category { get; set; }

    public ExerciseDifficulty? Difficulty { get; set; }

    public ExerciseStatus? Status { get; set; }

    [Range(1, 180)]
    public int? Duration { get; set; }

    [Range(1, 50)]
    public int? MinParticipants { get; set; }

    [Range(1, 100)]
    public int? MaxParticipants { get; set; }

    public List<string>? TargetAgeGroup { get; set; }

    [StringLength(50)]
    public string? Sport { get; set; }

    public List<string>? Objectives { get; set; }

    public List<string>? Instructions { get; set; }

    public List<string>? SafetyNotes { get; set; }

    public List<string>? Equipment { get; set; }

    public List<string>? Variations { get; set; }

    public List<string>? Tags { get; set; }

    [StringLength(100)]
    public string? SpaceRequired { get; set; }

    public bool? IsPublic { get; set; }

    public bool? IsVerified { get; set; }
}

/// <summary>
/// DTO for exercise responses
/// </summary>
public class ExerciseResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ExerciseCategory Category { get; set; }
    public ExerciseDifficulty Difficulty { get; set; }
    public ExerciseStatus Status { get; set; }
    public int Duration { get; set; }
    public int MinParticipants { get; set; }
    public int MaxParticipants { get; set; }
    public List<string> TargetAgeGroup { get; set; } = new();
    public string Sport { get; set; } = string.Empty;
    public List<string> Objectives { get; set; } = new();
    public List<string> Instructions { get; set; } = new();
    public List<string> SafetyNotes { get; set; } = new();
    public List<string> Equipment { get; set; } = new();
    public List<string> Variations { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public string SpaceRequired { get; set; } = string.Empty;
    public bool IsPublic { get; set; }
    public bool IsVerified { get; set; }
    public Guid CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int UsageCount { get; set; }
    public decimal Rating { get; set; }
    public List<ExerciseMediaDto> Media { get; set; } = new();
    public List<ExerciseReviewDto> Reviews { get; set; } = new();
}

/// <summary>
/// DTO for paginated exercise responses
/// </summary>
public class ExercisesListResponseDto
{
    public List<ExerciseResponseDto> Exercises { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int Limit { get; set; }
}

/// <summary>
/// DTO for exercise filters
/// </summary>
public class ExerciseFilterDto
{
    public ExerciseCategory? Category { get; set; }
    public ExerciseDifficulty? Difficulty { get; set; }
    public string? Sport { get; set; }
    public bool? IsPublic { get; set; }
    public bool? IsVerified { get; set; }
    public int? MinDuration { get; set; }
    public int? MaxDuration { get; set; }
    public int? Page { get; set; } = 1;
    public int? Limit { get; set; } = 10;
    public string? Search { get; set; }
}

/// <summary>
/// DTO for exercise media
/// </summary>
public class ExerciseMediaDto
{
    public Guid Id { get; set; }
    public ExerciseMediaType Type { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public int Order { get; set; }
}

/// <summary>
/// DTO for creating exercise media
/// </summary>
public class CreateExerciseMediaDto
{
    [Required]
    public ExerciseMediaType Type { get; set; }

    [Required]
    [StringLength(500)]
    public string Url { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Caption { get; set; }

    [Required]
    public int Order { get; set; } = 0;
}

/// <summary>
/// DTO for exercise reviews
/// </summary>
public class ExerciseReviewDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO for creating exercise reviews
/// </summary>
public class CreateExerciseReviewDto
{
    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    [StringLength(1000, MinimumLength = 5)]
    public string Comment { get; set; } = string.Empty;
}