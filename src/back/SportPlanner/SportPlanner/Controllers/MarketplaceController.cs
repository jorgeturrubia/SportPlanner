using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;
using System.Security.Claims;

namespace SportPlanner.Controllers;

/// <summary>
/// Controller para gestionar el marketplace de planificaciones
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MarketplaceController : ControllerBase
{
    private readonly IMarketplaceService _marketplaceService;
    private readonly ILogger<MarketplaceController> _logger;

    public MarketplaceController(
        IMarketplaceService marketplaceService,
        ILogger<MarketplaceController> logger)
    {
        _marketplaceService = marketplaceService;
        _logger = logger;
    }

    /// <summary>
    /// Buscar planificaciones en el marketplace con filtros
    /// </summary>
    /// <param name="criteria">Criterios de búsqueda</param>
    /// <returns>Resultado paginado de planificaciones</returns>
    [HttpGet("plannings")]
    public async Task<ActionResult<MarketplaceSearchResultDto>> SearchPlannings([FromQuery] MarketplaceSearchDto criteria)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            _logger.LogInformation("Searching marketplace plannings for user {UserId} with criteria: {SearchTerm}", 
                currentUserId, criteria.SearchTerm);

            var result = await _marketplaceService.SearchPlanningsAsync(criteria, currentUserId);
            
            _logger.LogInformation("Found {Count} plannings in marketplace search", result.Plannings.Count);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching marketplace plannings");
            return StatusCode(500, "An error occurred while searching plannings");
        }
    }

    /// <summary>
    /// Obtener detalles de una planificación específica del marketplace
    /// </summary>
    /// <param name="id">ID de la planificación</param>
    /// <returns>Detalles completos de la planificación</returns>
    [HttpGet("plannings/{id}")]
    public async Task<ActionResult<MarketplacePlanningDetailDto>> GetPlanningDetail(Guid id)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            _logger.LogInformation("Getting marketplace planning detail {PlanningId} for user {UserId}", id, currentUserId);

            var planning = await _marketplaceService.GetPlanningDetailAsync(id, currentUserId);
            
            if (planning == null)
            {
                _logger.LogWarning("Planning {PlanningId} not found or not accessible", id);
                return NotFound($"Planning with ID {id} not found or not available in marketplace");
            }

            return Ok(planning);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting marketplace planning detail {PlanningId}", id);
            return StatusCode(500, "An error occurred while retrieving the planning details");
        }
    }

    /// <summary>
    /// Importar una planificación del marketplace a un equipo propio
    /// </summary>
    /// <param name="id">ID de la planificación a importar</param>
    /// <param name="importDto">Datos para la importación</param>
    /// <returns>Resultado de la importación</returns>
    [HttpPost("plannings/{id}/import")]
    public async Task<ActionResult<ImportResultDto>> ImportPlanning(Guid id, [FromBody] ImportPlanningDto importDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid import planning request for planning {PlanningId}: {ModelState}", 
                    id, ModelState);
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            _logger.LogInformation("Importing planning {PlanningId} to team {TeamId} by user {UserId}", 
                id, importDto.TeamId, userId);

            var result = await _marketplaceService.ImportPlanningAsync(id, importDto, userId);
            
            _logger.LogInformation("Planning {PlanningId} imported successfully as {NewPlanningId}", 
                id, result.NewPlanningId);
            
            return CreatedAtAction(
                nameof(GetPlanningDetail), 
                new { id = result.NewPlanningId }, 
                result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized import attempt for planning {PlanningId} by user {UserId}", 
                id, GetCurrentUserId());
            return Forbid("You do not have permission to import this planning or access the target team");
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Planning {PlanningId} not found for import", id);
            return NotFound($"Planning with ID {id} not found or not available for import");
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid import operation for planning {PlanningId}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error importing planning {PlanningId}", id);
            return StatusCode(500, "An error occurred while importing the planning");
        }
    }

    /// <summary>
    /// Valorar una planificación del marketplace
    /// </summary>
    /// <param name="id">ID de la planificación a valorar</param>
    /// <param name="ratingDto">Datos de la valoración</param>
    /// <returns>Valoración creada o actualizada</returns>
    [HttpPost("plannings/{id}/rate")]
    public async Task<ActionResult<PlanningRatingDto>> RatePlanning(Guid id, [FromBody] RatePlanningDto ratingDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid rating request for planning {PlanningId}: {ModelState}", 
                    id, ModelState);
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            _logger.LogInformation("Rating planning {PlanningId} with {Rating} stars by user {UserId}", 
                id, ratingDto.Rating, userId);

            var result = await _marketplaceService.RatePlanningAsync(id, ratingDto, userId);
            
            _logger.LogInformation("Planning {PlanningId} rated successfully by user {UserId}", id, userId);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized rating attempt for planning {PlanningId} by user {UserId}", 
                id, GetCurrentUserId());
            return Forbid("You do not have permission to rate this planning");
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Planning {PlanningId} not found for rating", id);
            return NotFound($"Planning with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rating planning {PlanningId}", id);
            return StatusCode(500, "An error occurred while rating the planning");
        }
    }

    /// <summary>
    /// Obtener valoraciones de una planificación
    /// </summary>
    /// <param name="id">ID de la planificación</param>
    /// <param name="page">Número de página</param>
    /// <param name="pageSize">Tamaño de página</param>
    /// <returns>Lista paginada de valoraciones</returns>
    [HttpGet("plannings/{id}/ratings")]
    public async Task<ActionResult<List<PlanningRatingDto>>> GetPlanningRatings(
        Guid id, 
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10)
    {
        try
        {
            if (page < 1 || pageSize < 1 || pageSize > 50)
            {
                return BadRequest("Invalid pagination parameters");
            }

            _logger.LogInformation("Getting ratings for planning {PlanningId}, page {Page}, size {PageSize}", 
                id, page, pageSize);

            var ratings = await _marketplaceService.GetPlanningRatingsAsync(id, page, pageSize);
            
            return Ok(ratings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting ratings for planning {PlanningId}", id);
            return StatusCode(500, "An error occurred while retrieving ratings");
        }
    }

    /// <summary>
    /// Publicar una planificación propia en el marketplace
    /// </summary>
    /// <param name="id">ID de la planificación a publicar</param>
    /// <param name="publishDto">Datos de publicación</param>
    /// <returns>Planificación publicada</returns>
    [HttpPost("plannings/{id}/publish")]
    public async Task<ActionResult<MarketplacePlanningDto>> PublishPlanning(Guid id, [FromBody] PublishPlanningDto publishDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid publish request for planning {PlanningId}: {ModelState}", 
                    id, ModelState);
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            _logger.LogInformation("Publishing planning {PlanningId} to marketplace by user {UserId}", id, userId);

            var result = await _marketplaceService.PublishPlanningAsync(id, publishDto, userId);
            
            _logger.LogInformation("Planning {PlanningId} published successfully to marketplace", id);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized publish attempt for planning {PlanningId} by user {UserId}", 
                id, GetCurrentUserId());
            return Forbid("You do not have permission to publish this planning");
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Planning {PlanningId} not found for publishing", id);
            return NotFound($"Planning with ID {id} not found");
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid publish operation for planning {PlanningId}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing planning {PlanningId}", id);
            return StatusCode(500, "An error occurred while publishing the planning");
        }
    }

    /// <summary>
    /// Despublicar una planificación del marketplace
    /// </summary>
    /// <param name="id">ID de la planificación a despublicar</param>
    /// <returns>Resultado de la operación</returns>
    [HttpDelete("plannings/{id}/publish")]
    public async Task<IActionResult> UnpublishPlanning(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("Unpublishing planning {PlanningId} from marketplace by user {UserId}", id, userId);

            await _marketplaceService.UnpublishPlanningAsync(id, userId);
            
            _logger.LogInformation("Planning {PlanningId} unpublished successfully from marketplace", id);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized unpublish attempt for planning {PlanningId} by user {UserId}", 
                id, GetCurrentUserId());
            return Forbid("You do not have permission to unpublish this planning");
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Planning {PlanningId} not found for unpublishing", id);
            return NotFound($"Planning with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unpublishing planning {PlanningId}", id);
            return StatusCode(500, "An error occurred while unpublishing the planning");
        }
    }

    /// <summary>
    /// Obtener estadísticas de una planificación en el marketplace
    /// </summary>
    /// <param name="id">ID de la planificación</param>
    /// <returns>Estadísticas de la planificación</returns>
    [HttpGet("plannings/{id}/stats")]
    public async Task<ActionResult<object>> GetPlanningStats(Guid id)
    {
        try
        {
            _logger.LogInformation("Getting stats for planning {PlanningId}", id);

            var averageRating = await _marketplaceService.GetAverageRatingAsync(id);
            var canAccess = await _marketplaceService.CanUserAccessPlanningAsync(id, GetCurrentUserId());

            if (!canAccess)
            {
                return Forbid("You do not have permission to view this planning's stats");
            }

            var stats = new
            {
                PlanningId = id,
                AverageRating = averageRating,
                // Aquí se pueden agregar más estadísticas cuando estén implementadas
                ImportCount = 0 // Pendiente de implementación
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting stats for planning {PlanningId}", id);
            return StatusCode(500, "An error occurred while retrieving planning stats");
        }
    }

    /// <summary>
    /// Verificar si el usuario actual puede realizar acciones sobre una planificación
    /// </summary>
    /// <param name="id">ID de la planificación</param>
    /// <returns>Permisos del usuario para la planificación</returns>
    [HttpGet("plannings/{id}/permissions")]
    public async Task<ActionResult<object>> GetUserPermissions(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("Getting permissions for planning {PlanningId} and user {UserId}", id, userId);

            var permissions = new
            {
                CanAccess = await _marketplaceService.CanUserAccessPlanningAsync(id, userId),
                CanImport = await _marketplaceService.CanUserImportPlanningAsync(id, userId),
                CanRate = await _marketplaceService.CanUserRatePlanningAsync(id, userId),
                CanPublish = await _marketplaceService.CanUserPublishPlanningAsync(id, userId)
            };

            return Ok(permissions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting permissions for planning {PlanningId}", id);
            return StatusCode(500, "An error occurred while checking permissions");
        }
    }

    /// <summary>
    /// Obtener planificaciones populares del marketplace
    /// </summary>
    /// <param name="limit">Número máximo de planificaciones a retornar</param>
    /// <returns>Lista de planificaciones populares</returns>
    [HttpGet("plannings/popular")]
    public async Task<ActionResult<List<MarketplacePlanningDto>>> GetPopularPlannings([FromQuery] int limit = 10)
    {
        try
        {
            if (limit < 1 || limit > 50)
            {
                return BadRequest("Limit must be between 1 and 50");
            }

            _logger.LogInformation("Getting {Limit} popular plannings from marketplace", limit);

            var criteria = new MarketplaceSearchDto
            {
                Page = 1,
                PageSize = limit,
                SortBy = MarketplaceSortBy.Rating,
                SortDirection = SortDirection.Descending,
                MinRating = 3 // Solo planificaciones bien valoradas
            };

            var result = await _marketplaceService.SearchPlanningsAsync(criteria, GetCurrentUserId());
            
            return Ok(result.Plannings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting popular plannings");
            return StatusCode(500, "An error occurred while retrieving popular plannings");
        }
    }

    /// <summary>
    /// Obtener planificaciones recientes del marketplace
    /// </summary>
    /// <param name="limit">Número máximo de planificaciones a retornar</param>
    /// <returns>Lista de planificaciones recientes</returns>
    [HttpGet("plannings/recent")]
    public async Task<ActionResult<List<MarketplacePlanningDto>>> GetRecentPlannings([FromQuery] int limit = 10)
    {
        try
        {
            if (limit < 1 || limit > 50)
            {
                return BadRequest("Limit must be between 1 and 50");
            }

            _logger.LogInformation("Getting {Limit} recent plannings from marketplace", limit);

            var criteria = new MarketplaceSearchDto
            {
                Page = 1,
                PageSize = limit,
                SortBy = MarketplaceSortBy.CreatedAt,
                SortDirection = SortDirection.Descending
            };

            var result = await _marketplaceService.SearchPlanningsAsync(criteria, GetCurrentUserId());
            
            return Ok(result.Plannings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting recent plannings");
            return StatusCode(500, "An error occurred while retrieving recent plannings");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        return userId;
    }
}