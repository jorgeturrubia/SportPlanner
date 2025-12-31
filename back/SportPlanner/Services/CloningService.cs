using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

/// <summary>
/// Service for deep-cloning system content to a user's private space.
/// Handles cascading dependencies and avoids duplicates using OriginSystemId tracking.
/// </summary>
public class CloningService : ICloningService
{
    private readonly AppDbContext _db;

    public CloningService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<MethodologicalItinerary> CloneItineraryAsync(int systemItineraryId, string userId)
    {
        var systemItinerary = await _db.MethodologicalItineraries
            .Include(i => i.PlanningTemplates)
                .ThenInclude(t => t.TemplateConcepts)
                    .ThenInclude(tc => tc.SportConcept)
                        .ThenInclude(sc => sc!.ConceptCategory)
            .FirstOrDefaultAsync(i => i.Id == systemItineraryId && i.IsSystem);

        if (systemItinerary == null)
            throw new KeyNotFoundException("System itinerary not found.");

        // Check if already cloned
        var existingClone = await _db.MethodologicalItineraries
            .FirstOrDefaultAsync(i => i.SystemSourceId == systemItineraryId && i.OwnerId == userId);
        
        if (existingClone != null)
            return existingClone;

        // Create the itinerary clone
        var clonedItinerary = new MethodologicalItinerary
        {
            Name = systemItinerary.Name,
            Description = systemItinerary.Description,
            SportId = systemItinerary.SportId,
            IsSystem = false,
            OwnerId = userId,
            SystemSourceId = systemItinerary.Id,
            Version = 1,
            IsActive = true
        };

        _db.MethodologicalItineraries.Add(clonedItinerary);
        await _db.SaveChangesAsync();

        // Clone all templates
        foreach (var systemTemplate in systemItinerary.PlanningTemplates)
        {
            var clonedTemplate = await CloneTemplateInternalAsync(systemTemplate, userId, clonedItinerary.Id);
            clonedItinerary.PlanningTemplates.Add(clonedTemplate);
        }

        return clonedItinerary;
    }

    public async Task<PlanningTemplate> CloneTemplateAsync(int systemTemplateId, string userId)
    {
        var systemTemplate = await _db.PlanningTemplates
            .Include(t => t.TemplateConcepts)
                .ThenInclude(tc => tc.SportConcept)
                    .ThenInclude(sc => sc!.ConceptCategory)
            .FirstOrDefaultAsync(t => t.Id == systemTemplateId && t.IsSystem);

        if (systemTemplate == null)
            throw new KeyNotFoundException("System template not found.");

        // Check if already cloned
        var existingClone = await _db.PlanningTemplates
            .FirstOrDefaultAsync(t => t.SystemSourceId == systemTemplateId && t.OwnerId == userId);
        
        if (existingClone != null)
            return existingClone;

        return await CloneTemplateInternalAsync(systemTemplate, userId, null);
    }

    private async Task<PlanningTemplate> CloneTemplateInternalAsync(
        PlanningTemplate systemTemplate, 
        string userId, 
        int? methodologicalItineraryId)
    {
        var clonedTemplate = new PlanningTemplate
        {
            Name = systemTemplate.Name,
            Code = null, // User templates don't have codes to avoid uniqueness conflicts
            Level = systemTemplate.Level,
            TeamCategoryId = systemTemplate.TeamCategoryId,
            Description = systemTemplate.Description,
            IsActive = true,
            IsSystem = false,
            OwnerId = userId,
            Version = 1,
            SystemSourceId = systemTemplate.Id,
            MethodologicalItineraryId = methodologicalItineraryId
        };

        _db.PlanningTemplates.Add(clonedTemplate);
        await _db.SaveChangesAsync();

        // Clone all associated concepts and link them
        foreach (var tc in systemTemplate.TemplateConcepts)
        {
            if (tc.SportConcept == null) continue;

            var clonedConcept = await EnsureConceptClonedAsync(tc.SportConcept, userId);

            var templateConcept = new PlanningTemplateConcept
            {
                PlanningTemplateId = clonedTemplate.Id,
                SportConceptId = clonedConcept.Id,
                Order = tc.Order,
                CustomDescription = tc.CustomDescription
            };
            _db.Set<PlanningTemplateConcept>().Add(templateConcept);
        }

        await _db.SaveChangesAsync();
        return clonedTemplate;
    }

    public async Task<SportConcept> CloneConceptAsync(int systemConceptId, string userId)
    {
        var systemConcept = await _db.SportConcepts
            .Include(sc => sc.ConceptCategory)
            .FirstOrDefaultAsync(sc => sc.Id == systemConceptId && sc.IsSystem);

        if (systemConcept == null)
            throw new KeyNotFoundException("System concept not found.");

        return await EnsureConceptClonedAsync(systemConcept, userId);
    }

    private async Task<SportConcept> EnsureConceptClonedAsync(SportConcept systemConcept, string userId)
    {
        // Check if already cloned
        var existingClone = await _db.SportConcepts
            .FirstOrDefaultAsync(sc => sc.OriginSystemId == systemConcept.Id && sc.OwnerId == userId);

        if (existingClone != null)
            return existingClone;

        // Ensure category is cloned first (if exists)
        ConceptCategory? clonedCategory = null;
        if (systemConcept.ConceptCategory != null)
        {
            clonedCategory = await EnsureCategoryClonedAsync(systemConcept.ConceptCategory, userId);
        }

        var clonedConcept = new SportConcept
        {
            Name = systemConcept.Name,
            Description = systemConcept.Description,
            Url = systemConcept.Url,
            OwnerId = userId,
            ConceptCategoryId = clonedCategory?.Id,
            TechnicalDifficulty = systemConcept.TechnicalDifficulty,
            TacticalComplexity = systemConcept.TacticalComplexity,
            TechnicalTacticalFocus = systemConcept.TechnicalTacticalFocus,
            DevelopmentLevel = systemConcept.DevelopmentLevel,
            SportId = systemConcept.SportId,
            IsSystem = false,
            IsActive = true,
            OriginSystemId = systemConcept.Id
        };

        _db.SportConcepts.Add(clonedConcept);
        await _db.SaveChangesAsync();

        return clonedConcept;
    }

    public async Task<ConceptCategory> CloneCategoryAsync(int systemCategoryId, string userId)
    {
        var systemCategory = await _db.ConceptCategories
            .Include(c => c.Parent)
            .FirstOrDefaultAsync(c => c.Id == systemCategoryId && c.IsSystem);

        if (systemCategory == null)
            throw new KeyNotFoundException("System category not found.");

        return await EnsureCategoryClonedAsync(systemCategory, userId);
    }

    private async Task<ConceptCategory> EnsureCategoryClonedAsync(ConceptCategory systemCategory, string userId)
    {
        // Check if already cloned
        var existingClone = await _db.ConceptCategories
            .FirstOrDefaultAsync(c => c.OriginSystemId == systemCategory.Id && c.OwnerId == userId);

        if (existingClone != null)
            return existingClone;

        // Clone parent hierarchy first (recursively)
        ConceptCategory? clonedParent = null;
        if (systemCategory.Parent != null)
        {
            // Load the parent if not loaded
            if (systemCategory.Parent.IsSystem)
            {
                clonedParent = await EnsureCategoryClonedAsync(systemCategory.Parent, userId);
            }
        }

        var clonedCategory = new ConceptCategory
        {
            Name = systemCategory.Name,
            Description = systemCategory.Description,
            IsActive = true,
            ParentId = clonedParent?.Id,
            OwnerId = userId,
            IsSystem = false,
            OriginSystemId = systemCategory.Id
        };

        _db.ConceptCategories.Add(clonedCategory);
        await _db.SaveChangesAsync();

        return clonedCategory;
    }

    public async Task<bool> IsAlreadyDownloadedAsync(int systemItemId, string itemType, string userId)
    {
        return itemType.ToLowerInvariant() switch
        {
            "itinerary" => await _db.MethodologicalItineraries
                .AnyAsync(i => i.SystemSourceId == systemItemId && i.OwnerId == userId),
            "template" => await _db.PlanningTemplates
                .AnyAsync(t => t.SystemSourceId == systemItemId && t.OwnerId == userId),
            "concept" => await _db.SportConcepts
                .AnyAsync(sc => sc.OriginSystemId == systemItemId && sc.OwnerId == userId),
            "category" => await _db.ConceptCategories
                .AnyAsync(c => c.OriginSystemId == systemItemId && c.OwnerId == userId),
            "exercise" => await _db.Exercises
                .AnyAsync(e => e.OriginSystemId == systemItemId && e.OwnerId == userId),
            _ => false
        };
    }

    public async Task<HashSet<int>> GetDownloadedIdsAsync(IEnumerable<int> systemItemIds, string itemType, string userId)
    {
        // Avoid potential issues with large lists in EF Core `Contains` by chunking if necessary,
        // but for typical search result sizes (e.g. < 1000), a single query is fine.
        var idsToCheck = systemItemIds.ToList();
        if (!idsToCheck.Any()) return new HashSet<int>();

        List<int> downloadedIds = new List<int>();

        switch (itemType.ToLowerInvariant())
        {
            case "itinerary":
                downloadedIds = await _db.MethodologicalItineraries
                    .Where(i => i.SystemSourceId.HasValue && idsToCheck.Contains(i.SystemSourceId.Value) && i.OwnerId == userId)
                    .Select(i => i.SystemSourceId!.Value)
                    .ToListAsync();
                break;
            case "template":
                downloadedIds = await _db.PlanningTemplates
                    .Where(t => t.SystemSourceId.HasValue && idsToCheck.Contains(t.SystemSourceId.Value) && t.OwnerId == userId)
                    .Select(t => t.SystemSourceId!.Value)
                    .ToListAsync();
                break;
            case "concept":
                downloadedIds = await _db.SportConcepts
                    .Where(sc => sc.OriginSystemId.HasValue && idsToCheck.Contains(sc.OriginSystemId.Value) && sc.OwnerId == userId)
                    .Select(sc => sc.OriginSystemId!.Value)
                    .ToListAsync();
                break;
            case "category":
                downloadedIds = await _db.ConceptCategories
                    .Where(c => c.OriginSystemId.HasValue && idsToCheck.Contains(c.OriginSystemId.Value) && c.OwnerId == userId)
                    .Select(c => c.OriginSystemId!.Value)
                    .ToListAsync();
                break;
            case "exercise":
                downloadedIds = await _db.Exercises
                    .Where(e => e.OriginSystemId.HasValue && idsToCheck.Contains(e.OriginSystemId.Value) && e.OwnerId == userId)
                    .Select(e => e.OriginSystemId!.Value)
                    .ToListAsync();
                break;
        }

        return new HashSet<int>(downloadedIds);
    }
}
