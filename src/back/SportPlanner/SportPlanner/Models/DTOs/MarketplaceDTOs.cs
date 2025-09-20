using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models.DTOs;

/// <summary>
/// DTO para mostrar planificaciones en el marketplace
/// </summary>
public class MarketplacePlanningDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Sport { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    
    // Información del autor
    public string CreatedByName { get; set; } = string.Empty;
    public string CreatedByEmail { get; set; } = string.Empty;
    
    // Estadísticas del marketplace
    public decimal AverageRating { get; set; }
    public int TotalRatings { get; set; }
    public int ImportCount { get; set; }
    
    // Metadatos
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Información de la planificación
    public int SessionsPerWeek { get; set; }
    public int TotalSessions { get; set; }
    public int DurationMinutes { get; set; }
    public List<DayOfWeek> TrainingDays { get; set; } = new();
    public TimeSpan StartTime { get; set; }
    
    // Conceptos incluidos (resumen)
    public List<string> ConceptNames { get; set; } = new();
    public int TotalConcepts { get; set; }
}

/// <summary>
/// DTO detallado para una planificación específica del marketplace
/// </summary>
public class MarketplacePlanningDetailDto : MarketplacePlanningDto
{
    // Información detallada de conceptos
    public List<PlanningConceptSummaryDto> Concepts { get; set; } = new();
    
    // Últimas valoraciones
    public List<PlanningRatingDto> RecentRatings { get; set; } = new();
    
    // Información adicional
    public bool CanRate { get; set; } // Si el usuario actual puede valorar
    public bool HasUserRated { get; set; } // Si el usuario actual ya valoró
    public int? UserRating { get; set; } // Valoración del usuario actual
}

/// <summary>
/// DTO para criterios de búsqueda en el marketplace
/// </summary>
public class MarketplaceSearchDto
{
    [MaxLength(100)]
    public string? SearchTerm { get; set; }
    
    [MaxLength(50)]
    public string? Sport { get; set; }
    
    [Range(1, 5)]
    public int? MinRating { get; set; }
    
    public List<string>? Tags { get; set; }
    
    [MaxLength(50)]
    public string? Category { get; set; }
    
    // Paginación
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    
    // Ordenamiento
    public MarketplaceSortBy SortBy { get; set; } = MarketplaceSortBy.Rating;
    public SortDirection SortDirection { get; set; } = SortDirection.Descending;
}

/// <summary>
/// DTO para valorar una planificación
/// </summary>
public class RatePlanningDto
{
    [Range(1, 5, ErrorMessage = "La valoración debe estar entre 1 y 5 estrellas")]
    public int Rating { get; set; }
    
    [MaxLength(500, ErrorMessage = "El comentario no puede exceder 500 caracteres")]
    public string Comment { get; set; } = string.Empty;
}

/// <summary>
/// DTO para importar una planificación del marketplace
/// </summary>
public class ImportPlanningDto
{
    [Required]
    public Guid TeamId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    // Fechas para la nueva planificación
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    // Permitir modificar días y horarios
    public List<DayOfWeek>? TrainingDays { get; set; }
    public TimeSpan? StartTime { get; set; }
    public int? DurationMinutes { get; set; }
}

/// <summary>
/// DTO para publicar una planificación en el marketplace
/// </summary>
public class PublishPlanningDto
{
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    public List<string> Tags { get; set; } = new();
    
    // Indicar si se quiere hacer pública para buscar o solo para invitados
    public bool IsPubliclySearchable { get; set; } = true;
}

/// <summary>
/// DTO para valoraciones de planificaciones
/// </summary>
public class PlanningRatingDto
{
    public int Id { get; set; }
    public Guid PlanningId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO resumido para conceptos en planificaciones del marketplace
/// </summary>
public class PlanningConceptSummaryDto
{
    public Guid ConceptId { get; set; }
    public string ConceptName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Subcategory { get; set; } = string.Empty;
    public int PlannedSessions { get; set; }
    public int Order { get; set; }
}

/// <summary>
/// DTO para respuesta paginada del marketplace
/// </summary>
public class MarketplaceSearchResultDto
{
    public List<MarketplacePlanningDto> Plannings { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}

/// <summary>
/// DTO para resultado de importación
/// </summary>
public class ImportResultDto
{
    public Guid NewPlanningId { get; set; }
    public string Message { get; set; } = string.Empty;
    public Guid OriginalPlanningId { get; set; }
    public string OriginalAuthor { get; set; } = string.Empty;
}

/// <summary>
/// Enums para ordenamiento
/// </summary>
public enum MarketplaceSortBy
{
    Rating,
    Name,
    CreatedAt,
    ImportCount,
    TotalRatings
}

public enum SortDirection
{
    Ascending,
    Descending
}