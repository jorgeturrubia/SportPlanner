using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public class MarketplaceService : IMarketplaceService
{
    private readonly SportPlannerDbContext _context;
    private readonly ILogger<MarketplaceService> _logger;
    private readonly IUserContextService _userContextService;

    public MarketplaceService(
        SportPlannerDbContext context, 
        ILogger<MarketplaceService> logger,
        IUserContextService userContextService)
    {
        _context = context;
        _logger = logger;
        _userContextService = userContextService;
    }

    public async Task<MarketplaceSearchResultDto> SearchPlanningsAsync(MarketplaceSearchDto criteria, Guid? currentUserId = null)
    {
        try
        {
            _logger.LogInformation("Searching marketplace plannings with criteria: {Criteria}", criteria);

            var query = _context.Plannings
                .Where(p => p.IsActive && p.IsPublic)
                .Include(p => p.CreatedBy)
                .Include(p => p.Ratings)
                .Include(p => p.PlanningConcepts)
                    .ThenInclude(pc => pc.Concept)
                .AsQueryable();

            // Aplicar filtros
            if (!string.IsNullOrWhiteSpace(criteria.SearchTerm))
            {
                var searchTerm = criteria.SearchTerm.ToLower();
                query = query.Where(p => 
                    p.Name.ToLower().Contains(searchTerm) || 
                    p.Description.ToLower().Contains(searchTerm) ||
                    p.Tags.Any(tag => tag.ToLower().Contains(searchTerm)));
            }

            if (!string.IsNullOrWhiteSpace(criteria.Sport))
            {
                // Assumiendo que Sport se almacena como string en Team
                query = query.Where(p => p.Team != null && p.Team.Sport.ToLower() == criteria.Sport.ToLower());
            }

            if (criteria.MinRating.HasValue)
            {
                query = query.Where(p => p.Ratings.Any() && 
                    p.Ratings.Average(r => r.Rating) >= criteria.MinRating.Value);
            }

            if (criteria.Tags != null && criteria.Tags.Any())
            {
                foreach (var tag in criteria.Tags)
                {
                    var tagLower = tag.ToLower();
                    query = query.Where(p => p.Tags.Any(t => t.ToLower() == tagLower));
                }
            }

            if (!string.IsNullOrWhiteSpace(criteria.Category))
            {
                query = query.Where(p => p.Team != null && 
                    p.Team.Category.ToLower() == criteria.Category.ToLower());
            }

            // Contar total antes de aplicar paginación
            var totalCount = await query.CountAsync();

            // Aplicar ordenamiento
            query = ApplySorting(query, criteria.SortBy, criteria.SortDirection);

            // Aplicar paginación
            var plannings = await query
                .Skip((criteria.Page - 1) * criteria.PageSize)
                .Take(criteria.PageSize)
                .ToListAsync();

            var result = new MarketplaceSearchResultDto
            {
                Plannings = plannings.Select(p => MapToMarketplacePlanningDto(p, currentUserId)).ToList(),
                TotalCount = totalCount,
                Page = criteria.Page,
                PageSize = criteria.PageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / criteria.PageSize),
                HasNextPage = criteria.Page < Math.Ceiling((double)totalCount / criteria.PageSize),
                HasPreviousPage = criteria.Page > 1
            };

            _logger.LogInformation("Found {Count} plannings in marketplace", result.Plannings.Count);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching marketplace plannings");
            throw;
        }
    }

    public async Task<MarketplacePlanningDetailDto?> GetPlanningDetailAsync(Guid planningId, Guid? currentUserId = null)
    {
        try
        {
            _logger.LogInformation("Getting marketplace planning detail for {PlanningId}", planningId);

            var planning = await _context.Plannings
                .Where(p => p.Id == planningId && p.IsActive && p.IsPublic)
                .Include(p => p.CreatedBy)
                .Include(p => p.Ratings)
                    .ThenInclude(r => r.User)
                .Include(p => p.PlanningConcepts)
                    .ThenInclude(pc => pc.Concept)
                .Include(p => p.Team)
                .FirstOrDefaultAsync();

            if (planning == null)
            {
                _logger.LogWarning("Planning {PlanningId} not found or not public", planningId);
                return null;
            }

            var detail = MapToMarketplacePlanningDetailDto(planning, currentUserId);
            
            // Agregar información específica del usuario actual
            if (currentUserId.HasValue)
            {
                detail.CanRate = await CanUserRatePlanningAsync(planningId, currentUserId.Value);
                detail.HasUserRated = await _context.PlanningRatings
                    .AnyAsync(r => r.PlanningId == planningId && r.UserId == currentUserId.Value);
                
                if (detail.HasUserRated)
                {
                    var userRating = await _context.PlanningRatings
                        .Where(r => r.PlanningId == planningId && r.UserId == currentUserId.Value)
                        .Select(r => r.Rating)
                        .FirstOrDefaultAsync();
                    detail.UserRating = userRating;
                }
            }

            return detail;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting planning detail for {PlanningId}", planningId);
            throw;
        }
    }

    public async Task<MarketplacePlanningDto> PublishPlanningAsync(Guid planningId, PublishPlanningDto publishDto, Guid userId)
    {
        try
        {
            _logger.LogInformation("Publishing planning {PlanningId} to marketplace by user {UserId}", planningId, userId);

            // Verificar que el usuario puede publicar esta planificación
            if (!await CanUserPublishPlanningAsync(planningId, userId))
            {
                throw new UnauthorizedAccessException("User does not have permission to publish this planning");
            }

            var planning = await _context.Plannings
                .Include(p => p.CreatedBy)
                .Include(p => p.PlanningConcepts)
                    .ThenInclude(pc => pc.Concept)
                .FirstOrDefaultAsync(p => p.Id == planningId && p.IsActive);

            if (planning == null)
            {
                throw new KeyNotFoundException($"Planning {planningId} not found");
            }

            // Verificar que la planificación tiene contenido mínimo para publicar
            if (planning.PlanningConcepts.Count == 0)
            {
                throw new InvalidOperationException("Cannot publish a planning without concepts");
            }

            // Actualizar planificación para marketplace
            planning.IsPublic = true;
            planning.Description = publishDto.Description;
            planning.Tags = publishDto.Tags;
            planning.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Planning {PlanningId} published successfully to marketplace", planningId);
            return MapToMarketplacePlanningDto(planning, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing planning {PlanningId} to marketplace", planningId);
            throw;
        }
    }

    public async Task UnpublishPlanningAsync(Guid planningId, Guid userId)
    {
        try
        {
            _logger.LogInformation("Unpublishing planning {PlanningId} from marketplace by user {UserId}", planningId, userId);

            if (!await CanUserPublishPlanningAsync(planningId, userId))
            {
                throw new UnauthorizedAccessException("User does not have permission to unpublish this planning");
            }

            var planning = await _context.Plannings
                .FirstOrDefaultAsync(p => p.Id == planningId && p.IsActive);

            if (planning == null)
            {
                throw new KeyNotFoundException($"Planning {planningId} not found");
            }

            planning.IsPublic = false;
            planning.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Planning {PlanningId} unpublished successfully from marketplace", planningId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unpublishing planning {PlanningId} from marketplace", planningId);
            throw;
        }
    }

    public async Task<ImportResultDto> ImportPlanningAsync(Guid planningId, ImportPlanningDto importDto, Guid userId)
    {
        try
        {
            _logger.LogInformation("Importing planning {PlanningId} by user {UserId} to team {TeamId}", 
                planningId, userId, importDto.TeamId);

            // Verificar permisos
            if (!await CanUserImportPlanningAsync(planningId, userId))
            {
                throw new UnauthorizedAccessException("User does not have permission to import this planning");
            }

            // Verificar que el usuario puede acceder al equipo destino
            var canAccessTeam = await _context.Teams
                .AnyAsync(t => t.Id == importDto.TeamId && t.IsActive &&
                              (t.CreatedByUserId == userId || 
                               t.UserTeams.Any(ut => ut.UserId == userId && ut.IsActive)));

            if (!canAccessTeam)
            {
                throw new UnauthorizedAccessException("User does not have access to the target team");
            }

            // Verificar límites de suscripción
            await ValidateSubscriptionLimitsAsync(userId);

            // Obtener planificación original
            var originalPlanning = await _context.Plannings
                .Include(p => p.CreatedBy)
                .Include(p => p.PlanningConcepts)
                    .ThenInclude(pc => pc.Concept)
                .FirstOrDefaultAsync(p => p.Id == planningId && p.IsActive && p.IsPublic);

            if (originalPlanning == null)
            {
                throw new KeyNotFoundException($"Planning {planningId} not found or not available for import");
            }

            // Crear nueva planificación
            var newPlanning = new Planning
            {
                Id = Guid.NewGuid(),
                Name = importDto.Name,
                Description = $"Importada de: {originalPlanning.Name} (por {originalPlanning.CreatedBy.FirstName} {originalPlanning.CreatedBy.LastName})\n\n{importDto.Description}",
                Type = PlanningType.TeamSpecific,
                Status = PlanningStatus.Draft,
                TeamId = importDto.TeamId,
                StartDate = importDto.StartDate,
                EndDate = importDto.EndDate,
                TrainingDays = importDto.TrainingDays ?? originalPlanning.TrainingDays,
                StartTime = importDto.StartTime ?? originalPlanning.StartTime,
                DurationMinutes = importDto.DurationMinutes ?? originalPlanning.DurationMinutes,
                SessionsPerWeek = originalPlanning.SessionsPerWeek,
                TotalSessions = originalPlanning.TotalSessions,
                IsActive = true,
                IsPublic = false,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Tags = new List<string>(originalPlanning.Tags)
            };

            _context.Plannings.Add(newPlanning);

            // Copiar conceptos de la planificación original
            foreach (var originalConcept in originalPlanning.PlanningConcepts)
            {
                var newPlanningConcept = new PlanningConcept
                {
                    PlanningId = newPlanning.Id,
                    ConceptId = originalConcept.ConceptId,
                    Order = originalConcept.Order,
                    PlannedSessions = originalConcept.PlannedSessions,
                    CompletedSessions = 0
                };

                _context.PlanningConcepts.Add(newPlanningConcept);
            }

            await _context.SaveChangesAsync();

            // Actualizar contador de importaciones
            await UpdateImportCountAsync(planningId);

            _logger.LogInformation("Planning {PlanningId} imported successfully as {NewPlanningId}", 
                planningId, newPlanning.Id);

            return new ImportResultDto
            {
                NewPlanningId = newPlanning.Id,
                Message = "Planificación importada exitosamente",
                OriginalPlanningId = planningId,
                OriginalAuthor = $"{originalPlanning.CreatedBy.FirstName} {originalPlanning.CreatedBy.LastName}"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error importing planning {PlanningId}", planningId);
            throw;
        }
    }

    public async Task<PlanningRatingDto> RatePlanningAsync(Guid planningId, RatePlanningDto ratingDto, Guid userId)
    {
        try
        {
            _logger.LogInformation("Rating planning {PlanningId} by user {UserId} with rating {Rating}", 
                planningId, userId, ratingDto.Rating);

            if (!await CanUserRatePlanningAsync(planningId, userId))
            {
                throw new UnauthorizedAccessException("User cannot rate this planning");
            }

            // Verificar si ya existe una valoración del usuario
            var existingRating = await _context.PlanningRatings
                .FirstOrDefaultAsync(r => r.PlanningId == planningId && r.UserId == userId);

            if (existingRating != null)
            {
                // Actualizar valoración existente
                existingRating.Rating = ratingDto.Rating;
                existingRating.Comment = ratingDto.Comment;
                existingRating.CreatedAt = DateTime.UtcNow;
            }
            else
            {
                // Crear nueva valoración
                existingRating = new PlanningRating
                {
                    PlanningId = planningId,
                    UserId = userId,
                    Rating = ratingDto.Rating,
                    Comment = ratingDto.Comment,
                    CreatedAt = DateTime.UtcNow
                };

                _context.PlanningRatings.Add(existingRating);
            }

            await _context.SaveChangesAsync();

            // Obtener información del usuario para el DTO
            var user = await _context.Users.FindAsync(userId);
            
            var result = new PlanningRatingDto
            {
                Id = existingRating.Id,
                PlanningId = planningId,
                UserName = $"{user?.FirstName} {user?.LastName}".Trim(),
                Rating = existingRating.Rating,
                Comment = existingRating.Comment,
                CreatedAt = existingRating.CreatedAt
            };

            _logger.LogInformation("Planning {PlanningId} rated successfully by user {UserId}", planningId, userId);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rating planning {PlanningId}", planningId);
            throw;
        }
    }

    public async Task<List<PlanningRatingDto>> GetPlanningRatingsAsync(Guid planningId, int page = 1, int pageSize = 10)
    {
        try
        {
            var ratings = await _context.PlanningRatings
                .Where(r => r.PlanningId == planningId)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new PlanningRatingDto
                {
                    Id = r.Id,
                    PlanningId = r.PlanningId,
                    UserName = $"{r.User.FirstName} {r.User.LastName}".Trim(),
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return ratings;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting ratings for planning {PlanningId}", planningId);
            throw;
        }
    }

    public async Task<bool> CanUserAccessPlanningAsync(Guid planningId, Guid userId)
    {
        try
        {
            return await _context.Plannings
                .AnyAsync(p => p.Id == planningId && p.IsActive && 
                              (p.IsPublic || p.CreatedByUserId == userId ||
                               (p.TeamId.HasValue && p.Team!.UserTeams.Any(ut => ut.UserId == userId && ut.IsActive))));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking planning access for user {UserId} and planning {PlanningId}", userId, planningId);
            return false;
        }
    }

    public async Task<bool> CanUserImportPlanningAsync(Guid planningId, Guid userId)
    {
        try
        {
            // El usuario puede importar si la planificación es pública y no es suya
            var planning = await _context.Plannings
                .FirstOrDefaultAsync(p => p.Id == planningId && p.IsActive);

            return planning != null && planning.IsPublic && planning.CreatedByUserId != userId;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking import permission for user {UserId} and planning {PlanningId}", userId, planningId);
            return false;
        }
    }

    public async Task<bool> CanUserRatePlanningAsync(Guid planningId, Guid userId)
    {
        try
        {
            // El usuario puede valorar si la planificación es pública, no es suya y la ha importado o usado
            var planning = await _context.Plannings
                .FirstOrDefaultAsync(p => p.Id == planningId && p.IsActive);

            if (planning == null || !planning.IsPublic || planning.CreatedByUserId == userId)
            {
                return false;
            }

            // Verificar si el usuario ya tiene una valoración (puede actualizar)
            var hasRated = await _context.PlanningRatings
                .AnyAsync(r => r.PlanningId == planningId && r.UserId == userId);

            if (hasRated)
            {
                return true; // Puede actualizar su valoración
            }

            // Verificar si el usuario ha importado esta planificación
            var hasImported = await _context.Plannings
                .AnyAsync(p => p.CreatedByUserId == userId && p.IsActive &&
                              p.Description.Contains($"Importada de: {planning.Name}"));

            return hasImported;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking rating permission for user {UserId} and planning {PlanningId}", userId, planningId);
            return false;
        }
    }

    public async Task<bool> CanUserPublishPlanningAsync(Guid planningId, Guid userId)
    {
        try
        {
            return await _context.Plannings
                .AnyAsync(p => p.Id == planningId && p.IsActive && p.CreatedByUserId == userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking publish permission for user {UserId} and planning {PlanningId}", userId, planningId);
            return false;
        }
    }

    public async Task UpdateImportCountAsync(Guid planningId)
    {
        try
        {
            // Esta funcionalidad requeriría una nueva columna ImportCount en Planning
            // Por ahora, simplemente logueamos el evento
            _logger.LogInformation("Planning {PlanningId} was imported", planningId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating import count for planning {PlanningId}", planningId);
        }
    }

    public async Task<decimal> GetAverageRatingAsync(Guid planningId)
    {
        try
        {
            var ratings = await _context.PlanningRatings
                .Where(r => r.PlanningId == planningId)
                .Select(r => r.Rating)
                .ToListAsync();

            return ratings.Any() ? (decimal)ratings.Average() : 0;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating average rating for planning {PlanningId}", planningId);
            return 0;
        }
    }

    // Private helper methods

    private async Task ValidateSubscriptionLimitsAsync(Guid userId)
    {
        // Obtener suscripción activa del usuario
        var userSubscription = await _context.UserSubscriptions
            .Include(us => us.Subscription)
            .FirstOrDefaultAsync(us => us.UserId == userId && us.IsActive &&
                                      (us.EndDate == null || us.EndDate > DateTime.UtcNow));

        if (userSubscription?.Subscription.Type == SubscriptionType.Free)
        {
            // Verificar límites para usuarios gratuitos
            var planningCount = await _context.Plannings
                .CountAsync(p => p.CreatedByUserId == userId && p.IsActive);

            if (planningCount >= userSubscription.Subscription.MaxTrainingSessions)
            {
                throw new InvalidOperationException("User has reached the maximum number of plannings for their subscription");
            }
        }
    }

    private static IQueryable<Planning> ApplySorting(IQueryable<Planning> query, MarketplaceSortBy sortBy, SortDirection direction)
    {
        return sortBy switch
        {
            MarketplaceSortBy.Rating => direction == SortDirection.Ascending 
                ? query.OrderBy(p => p.Ratings.Any() ? p.Ratings.Average(r => r.Rating) : 0)
                : query.OrderByDescending(p => p.Ratings.Any() ? p.Ratings.Average(r => r.Rating) : 0),
            
            MarketplaceSortBy.Name => direction == SortDirection.Ascending 
                ? query.OrderBy(p => p.Name)
                : query.OrderByDescending(p => p.Name),
            
            MarketplaceSortBy.CreatedAt => direction == SortDirection.Ascending 
                ? query.OrderBy(p => p.CreatedAt)
                : query.OrderByDescending(p => p.CreatedAt),
            
            MarketplaceSortBy.TotalRatings => direction == SortDirection.Ascending 
                ? query.OrderBy(p => p.Ratings.Count)
                : query.OrderByDescending(p => p.Ratings.Count),
            
            _ => query.OrderByDescending(p => p.Ratings.Any() ? p.Ratings.Average(r => r.Rating) : 0)
        };
    }

    private static MarketplacePlanningDto MapToMarketplacePlanningDto(Planning planning, Guid? currentUserId = null)
    {
        return new MarketplacePlanningDto
        {
            Id = planning.Id,
            Name = planning.Name,
            Description = planning.Description,
            Sport = planning.Team?.Sport ?? string.Empty,
            Tags = planning.Tags,
            CreatedByName = $"{planning.CreatedBy?.FirstName} {planning.CreatedBy?.LastName}".Trim(),
            CreatedByEmail = planning.CreatedBy?.Email ?? string.Empty,
            AverageRating = planning.Ratings.Any() ? (decimal)planning.Ratings.Average(r => r.Rating) : 0,
            TotalRatings = planning.Ratings.Count,
            ImportCount = 0, // Requiere implementación adicional
            CreatedAt = planning.CreatedAt,
            UpdatedAt = planning.UpdatedAt,
            SessionsPerWeek = planning.SessionsPerWeek,
            TotalSessions = planning.TotalSessions,
            DurationMinutes = planning.DurationMinutes,
            TrainingDays = planning.TrainingDays,
            StartTime = planning.StartTime,
            ConceptNames = planning.PlanningConcepts?.Select(pc => pc.Concept?.Name ?? string.Empty).ToList() ?? new List<string>(),
            TotalConcepts = planning.PlanningConcepts?.Count ?? 0
        };
    }

    private static MarketplacePlanningDetailDto MapToMarketplacePlanningDetailDto(Planning planning, Guid? currentUserId = null)
    {
        var baseDto = MapToMarketplacePlanningDto(planning, currentUserId);
        
        return new MarketplacePlanningDetailDto
        {
            Id = baseDto.Id,
            Name = baseDto.Name,
            Description = baseDto.Description,
            Sport = baseDto.Sport,
            Tags = baseDto.Tags,
            CreatedByName = baseDto.CreatedByName,
            CreatedByEmail = baseDto.CreatedByEmail,
            AverageRating = baseDto.AverageRating,
            TotalRatings = baseDto.TotalRatings,
            ImportCount = baseDto.ImportCount,
            CreatedAt = baseDto.CreatedAt,
            UpdatedAt = baseDto.UpdatedAt,
            SessionsPerWeek = baseDto.SessionsPerWeek,
            TotalSessions = baseDto.TotalSessions,
            DurationMinutes = baseDto.DurationMinutes,
            TrainingDays = baseDto.TrainingDays,
            StartTime = baseDto.StartTime,
            ConceptNames = baseDto.ConceptNames,
            TotalConcepts = baseDto.TotalConcepts,
            
            Concepts = planning.PlanningConcepts?.Select(pc => new PlanningConceptSummaryDto
            {
                ConceptId = pc.ConceptId,
                ConceptName = pc.Concept?.Name ?? string.Empty,
                Category = pc.Concept?.Category ?? string.Empty,
                Subcategory = pc.Concept?.Subcategory ?? string.Empty,
                PlannedSessions = pc.PlannedSessions,
                Order = pc.Order
            }).OrderBy(c => c.Order).ToList() ?? new List<PlanningConceptSummaryDto>(),
            
            RecentRatings = planning.Ratings?.OrderByDescending(r => r.CreatedAt).Take(5).Select(r => new PlanningRatingDto
            {
                Id = r.Id,
                PlanningId = r.PlanningId,
                UserName = $"{r.User?.FirstName} {r.User?.LastName}".Trim(),
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList() ?? new List<PlanningRatingDto>(),
            
            CanRate = false, // Se calculará en el método que llama
            HasUserRated = false, // Se calculará en el método que llama
            UserRating = null // Se calculará en el método que llama
        };
    }
}