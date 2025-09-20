using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public interface IMarketplaceService
{
    // Búsqueda y obtención de planificaciones del marketplace
    Task<MarketplaceSearchResultDto> SearchPlanningsAsync(MarketplaceSearchDto criteria, Guid? currentUserId = null);
    Task<MarketplacePlanningDetailDto?> GetPlanningDetailAsync(Guid planningId, Guid? currentUserId = null);
    
    // Publicación en marketplace
    Task<MarketplacePlanningDto> PublishPlanningAsync(Guid planningId, PublishPlanningDto publishDto, Guid userId);
    Task UnpublishPlanningAsync(Guid planningId, Guid userId);
    
    // Importación de planificaciones
    Task<ImportResultDto> ImportPlanningAsync(Guid planningId, ImportPlanningDto importDto, Guid userId);
    
    // Sistema de valoraciones
    Task<PlanningRatingDto> RatePlanningAsync(Guid planningId, RatePlanningDto ratingDto, Guid userId);
    Task<List<PlanningRatingDto>> GetPlanningRatingsAsync(Guid planningId, int page = 1, int pageSize = 10);
    
    // Validaciones y permisos
    Task<bool> CanUserAccessPlanningAsync(Guid planningId, Guid userId);
    Task<bool> CanUserImportPlanningAsync(Guid planningId, Guid userId);
    Task<bool> CanUserRatePlanningAsync(Guid planningId, Guid userId);
    Task<bool> CanUserPublishPlanningAsync(Guid planningId, Guid userId);
    
    // Estadísticas
    Task UpdateImportCountAsync(Guid planningId);
    Task<decimal> GetAverageRatingAsync(Guid planningId);
}