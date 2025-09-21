using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models.DTOs;

// Sport DTOs
public class SportDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateSportDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }
}

public class UpdateSportDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
}

// Category DTOs
public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public bool IsActive { get; set; }
    public int SportId { get; set; }
    public string SportName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateCategoryDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(0, 50)]
    public int? MinAge { get; set; }

    [Range(0, 50)]
    public int? MaxAge { get; set; }

    [Required]
    public int SportId { get; set; }
}

public class UpdateCategoryDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(0, 50)]
    public int? MinAge { get; set; }

    [Range(0, 50)]
    public int? MaxAge { get; set; }

    public bool IsActive { get; set; } = true;

    [Required]
    public int SportId { get; set; }
}

// SportGender DTOs
public class SportGenderDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public int SportId { get; set; }
    public string SportName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateSportGenderDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    public int SportId { get; set; }
}

public class UpdateSportGenderDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    [Required]
    public int SportId { get; set; }
}

// Level DTOs
public class LevelDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Difficulty { get; set; }
    public bool IsActive { get; set; }
    public int SportId { get; set; }
    public string SportName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

// ExerciseCategory DTOs
public class ExerciseCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateExerciseCategoryDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }
}

public class UpdateExerciseCategoryDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
}

// Difficulty DTOs
public class DifficultyDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateDifficultyDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [Range(1, 10)]
    public int Level { get; set; } = 1;

    [StringLength(500)]
    public string? Description { get; set; }
}

public class UpdateDifficultyDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [Range(1, 10)]
    public int Level { get; set; } = 1;

    [StringLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
}

public class CreateLevelDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(1, 10)]
    public int Difficulty { get; set; } = 1;

    [Required]
    public int SportId { get; set; }
}

public class UpdateLevelDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(1, 10)]
    public int Difficulty { get; set; } = 1;

    public bool IsActive { get; set; } = true;

    [Required]
    public int SportId { get; set; }
}

// Summary DTOs for lists
public class SportSummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public int CategoriesCount { get; set; }
    public int SportGendersCount { get; set; }
    public int LevelsCount { get; set; }
}

public class CategorySummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public bool IsActive { get; set; }
    public int SportId { get; set; }
    public string SportName { get; set; } = string.Empty;
}

public class SportGenderSummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int SportId { get; set; }
    public string SportName { get; set; } = string.Empty;
}

public class LevelSummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Difficulty { get; set; }
    public bool IsActive { get; set; }
    public int SportId { get; set; }
    public string SportName { get; set; } = string.Empty;
}

// ExerciseCategory Summary DTO
public class ExerciseCategorySummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}

// Difficulty Summary DTO
public class DifficultySummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
    public bool IsActive { get; set; }
}