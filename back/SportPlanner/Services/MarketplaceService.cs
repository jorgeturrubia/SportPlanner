using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Services;

public class MarketplaceService : IMarketplaceService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly ICloningService _cloningService;

    public MarketplaceService(AppDbContext db, IMapper mapper, ICloningService cloningService)
    {
        _db = db;
        _mapper = mapper;
        _cloningService = cloningService;
    }

    public async Task<List<MarketplaceItemDto>> SearchAsync(MarketplaceFilterDto filter, string? userId)
    {
        if (filter.ItemType == "template")
        {
            var templateQuery = _db.PlanningTemplates
                .Where(t => t.IsSystem && t.IsActive)
                .Include(t => t.TeamCategory)
                    .ThenInclude(tc => tc!.Sport)
                .Include(t => t.TemplateConcepts)
                .AsQueryable();

            if (filter.SportId.HasValue)
            {
                templateQuery = templateQuery.Where(t => t.TeamCategory != null && t.TeamCategory.SportId == filter.SportId.Value);
            }

            if (filter.TeamCategoryId.HasValue)
            {
                templateQuery = templateQuery.Where(t => t.TeamCategoryId == filter.TeamCategoryId.Value);
            }

            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                templateQuery = templateQuery.Where(t => t.Name.Contains(filter.SearchTerm) 
                    || (t.Description != null && t.Description.Contains(filter.SearchTerm)));
            }

            var templates = await templateQuery.ToListAsync();
            var templateDtos = _mapper.Map<List<MarketplaceItemDto>>(templates);
            return await SetIsDownloadedAsync(templateDtos, "template", userId);
        }

        if (filter.ItemType == "concept")
        {
            var conceptQuery = _db.SportConcepts
                .Where(c => c.IsSystem && c.IsActive)
                .Include(c => c.Sport)
                .Include(c => c.ConceptCategory)
                .Include(c => c.Exercises)
                .AsQueryable();

            if (filter.SportId.HasValue)
            {
                conceptQuery = conceptQuery.Where(c => c.SportId == filter.SportId.Value);
            }

            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                conceptQuery = conceptQuery.Where(c => c.Name.Contains(filter.SearchTerm) 
                    || (c.Description != null && c.Description.Contains(filter.SearchTerm)));
            }

            var concepts = await conceptQuery.ToListAsync();
            var conceptDtos = _mapper.Map<List<MarketplaceItemDto>>(concepts);
            return await SetIsDownloadedAsync(conceptDtos, "concept", userId);
        }

        if (filter.ItemType == "exercise")
        {
            var exerciseQuery = _db.Exercises
                .Where(e => e.IsSystem && e.IsActive)
                .Include(e => e.Sport)
                .Include(e => e.Concepts)
                .AsQueryable();

            if (filter.SportId.HasValue)
            {
                exerciseQuery = exerciseQuery.Where(e => e.SportId == filter.SportId.Value);
            }

            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                exerciseQuery = exerciseQuery.Where(e => e.Name.Contains(filter.SearchTerm) 
                    || (e.Description != null && e.Description.Contains(filter.SearchTerm)));
            }

            var exercises = await exerciseQuery.ToListAsync();
            var exerciseDtos = _mapper.Map<List<MarketplaceItemDto>>(exercises);
            return await SetIsDownloadedAsync(exerciseDtos, "exercise", userId);
        }

        // Default / Itineraries
        if (!string.IsNullOrEmpty(filter.ItemType) && filter.ItemType != "itinerary")
        {
            return new List<MarketplaceItemDto>();
        }

        var query = _db.MethodologicalItineraries
            .Where(i => i.IsSystem && i.IsActive)
            .Include(i => i.Sport)
            .Include(i => i.PlanningTemplates)
            .AsQueryable();

        if (filter.SportId.HasValue)
        {
            query = query.Where(i => i.SportId == filter.SportId.Value);
        }

        if (filter.MinRating.HasValue)
        {
            query = query.Where(i => i.AverageRating >= filter.MinRating.Value);
        }

        if (filter.TeamCategoryId.HasValue)
        {
            query = query.Where(i => i.PlanningTemplates.Any(pt => pt.TeamCategoryId == filter.TeamCategoryId.Value));
        }

        if (!string.IsNullOrEmpty(filter.SearchTerm))
        {
            query = query.Where(i => i.Name.Contains(filter.SearchTerm) 
                || (i.Description != null && i.Description.Contains(filter.SearchTerm)));
        }

        var results = await query.ToListAsync();
        var resultDtos = _mapper.Map<List<MarketplaceItemDto>>(results);
        return await SetIsDownloadedAsync(resultDtos, "itinerary", userId);
    }

    public async Task<ItineraryDetailDto?> GetItineraryDetailAsync(int id)
    {
        var itinerary = await _db.MethodologicalItineraries
            .Include(i => i.Sport)
            .Include(i => i.PlanningTemplates)
                .ThenInclude(t => t.TeamCategory)
            .Include(i => i.PlanningTemplates)
                .ThenInclude(t => t.TemplateConcepts)
                    .ThenInclude(tc => tc.SportConcept)
            .FirstOrDefaultAsync(i => i.Id == id && i.IsSystem);

        if (itinerary == null) return null;

        return _mapper.Map<ItineraryDetailDto>(itinerary);
    }

    public async Task<TemplateDetailDto?> GetTemplateDetailAsync(int id)
    {
        var template = await _db.PlanningTemplates
            .Include(t => t.TeamCategory)
            .Include(t => t.TemplateConcepts)
                .ThenInclude(tc => tc.SportConcept)
            .FirstOrDefaultAsync(t => t.Id == id && t.IsSystem);

        if (template == null) return null;

        return _mapper.Map<TemplateDetailDto>(template);
    }

    public async Task<bool> DeleteSystemItineraryAsync(int id)
    {
        var itinerary = await _db.MethodologicalItineraries
            .FirstOrDefaultAsync(i => i.Id == id && i.IsSystem);

        if (itinerary == null) return false;

        _db.MethodologicalItineraries.Remove(itinerary);
        await _db.SaveChangesAsync();
        return true;
    }

        private async Task<List<MarketplaceItemDto>> SetIsDownloadedAsync(

            List<MarketplaceItemDto> items, 

            string itemType, 

            string? userId)

        {

            if (string.IsNullOrEmpty(userId) || !items.Any())

                return items;

    

            var ids = items.Select(i => i.Id).ToList();

            var downloadedIds = await _cloningService.GetDownloadedIdsAsync(ids, itemType, userId);

    

            foreach (var item in items)

            {

                item.IsDownloaded = downloadedIds.Contains(item.Id);

            }

            return items;

        }

    }

    