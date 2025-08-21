using System.ComponentModel.DataAnnotations;
using SportPlanner.Api.Models;

namespace SportPlanner.Api.Dtos;

/// <summary>
/// DTO for team response
/// </summary>
public record TeamResponseDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public SportResponseDto Sport { get; init; } = null!;
    public string Category { get; init; } = string.Empty;
    public string Gender { get; init; } = string.Empty;
    public string Level { get; init; } = string.Empty;
    public string? Description { get; init; }
    public int MaxPlayers { get; init; }
    public TeamStatus Status { get; init; }
    public int PlayersCount { get; init; }
    public int CoachesCount { get; init; }
    public int TotalMembersCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
    public List<TeamMemberResponseDto> Members { get; init; } = new();
}

/// <summary>
/// DTO for creating a team
/// </summary>
public record CreateTeamDto
{
    [Required]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres")]
    public string Name { get; init; } = string.Empty;

    [Required]
    public Guid SportId { get; init; }

    [Required]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "La categoría debe tener entre 3 y 50 caracteres")]
    public string Category { get; init; } = string.Empty;

    [Required]
    [RegularExpression("^(Masculino|Femenino|Mixto)$", ErrorMessage = "El género debe ser Masculino, Femenino o Mixto")]
    public string Gender { get; init; } = string.Empty;

    [Required]
    [RegularExpression("^[ABC]$", ErrorMessage = "El nivel debe ser A, B o C")]
    public string Level { get; init; } = string.Empty;

    [StringLength(500, ErrorMessage = "La descripción no puede exceder los 500 caracteres")]
    public string? Description { get; init; }

    [Range(5, 50, ErrorMessage = "El número máximo de jugadores debe estar entre 5 y 50")]
    public int MaxPlayers { get; init; } = 20;
}

/// <summary>
/// DTO for updating a team
/// </summary>
public record UpdateTeamDto
{
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres")]
    public string? Name { get; init; }

    [StringLength(50, MinimumLength = 3, ErrorMessage = "La categoría debe tener entre 3 y 50 caracteres")]
    public string? Category { get; init; }

    [RegularExpression("^(Masculino|Femenino|Mixto)$", ErrorMessage = "El género debe ser Masculino, Femenino o Mixto")]
    public string? Gender { get; init; }

    [RegularExpression("^[ABC]$", ErrorMessage = "El nivel debe ser A, B o C")]
    public string? Level { get; init; }

    [StringLength(500, ErrorMessage = "La descripción no puede exceder los 500 caracteres")]
    public string? Description { get; init; }

    [Range(5, 50, ErrorMessage = "El número máximo de jugadores debe estar entre 5 y 50")]
    public int? MaxPlayers { get; init; }

    public TeamStatus? Status { get; init; }
}

/// <summary>
/// DTO for sport response
/// </summary>
public record SportResponseDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public int DefaultMaxPlayers { get; init; }
}

/// <summary>
/// DTO for team member response
/// </summary>
public record TeamMemberResponseDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public string UserName { get; init; } = string.Empty;
    public string UserEmail { get; init; } = string.Empty;
    public TeamMemberRole Role { get; init; }
    public string? JerseyNumber { get; init; }
    public string? Position { get; init; }
    public TeamMemberStatus Status { get; init; }
    public DateTime JoinedAt { get; init; }
    public string? Notes { get; init; }
}

/// <summary>
/// DTO for adding a team member
/// </summary>
public record AddTeamMemberDto
{
    [Required]
    public Guid UserId { get; init; }

    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 50 caracteres")]
    public string UserName { get; init; } = string.Empty;

    [Required]
    [EmailAddress(ErrorMessage = "Email inválido")]
    [StringLength(100, ErrorMessage = "El email no puede exceder los 100 caracteres")]
    public string UserEmail { get; init; } = string.Empty;

    [Required]
    public TeamMemberRole Role { get; init; }

    [StringLength(20, ErrorMessage = "El número de camiseta no puede exceder los 20 caracteres")]
    public string? JerseyNumber { get; init; }

    [StringLength(50, ErrorMessage = "La posición no puede exceder los 50 caracteres")]
    public string? Position { get; init; }

    [StringLength(200, ErrorMessage = "Las notas no pueden exceder los 200 caracteres")]
    public string? Notes { get; init; }
}

/// <summary>
/// DTO for updating a team member
/// </summary>
public record UpdateTeamMemberDto
{
    public TeamMemberRole? Role { get; init; }

    [StringLength(20, ErrorMessage = "El número de camiseta no puede exceder los 20 caracteres")]
    public string? JerseyNumber { get; init; }

    [StringLength(50, ErrorMessage = "La posición no puede exceder los 50 caracteres")]
    public string? Position { get; init; }

    public TeamMemberStatus? Status { get; init; }

    [StringLength(200, ErrorMessage = "Las notas no pueden exceder los 200 caracteres")]
    public string? Notes { get; init; }
}