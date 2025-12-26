using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SportPlanner.Services;

public class PlanningTemplateService : IPlanningTemplateService
{
    private readonly AppDbContext _db;

    public PlanningTemplateService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<PlanningTemplate>> GetUserTemplatesAsync(string userId, int? sportId = null)
    {
        var query = _db.PlanningTemplates
            .Where(i => i.OwnerId == userId && !i.IsSystem);

        if (sportId.HasValue)
        {
            query = query.Where(i => i.TeamCategoryId == null || i.TeamCategory!.SportId == sportId.Value);
        }

        return await query
            .Include(i => i.TeamCategory)
            .Include(i => i.SystemSource)
            .ToListAsync();
    }

    public async Task<PlanningTemplate?> GetTemplateByIdAsync(int id, string userId)
    {
        return await _db.PlanningTemplates
            .Include(i => i.TeamCategory)
            .Include(i => i.TemplateConcepts)
                .ThenInclude(ic => ic.SportConcept)
            .FirstOrDefaultAsync(i => i.Id == id && (i.IsSystem || i.OwnerId == userId));
    }

    public async Task<PlanningTemplate> LinkSystemTemplateAsync(int systemTemplateId, string userId)
    {
        var systemTemplate = await _db.PlanningTemplates
            .Include(i => i.TemplateConcepts)
            .FirstOrDefaultAsync(i => i.Id == systemTemplateId && i.IsSystem);

        if (systemTemplate == null)
        {
            throw new KeyNotFoundException("System template not found.");
        }

        // Check if already linked
        var existing = await _db.PlanningTemplates
            .FirstOrDefaultAsync(i => i.SystemSourceId == systemTemplateId && i.OwnerId == userId);
        
        if (existing != null)
        {
            return existing;
        }

        // Create Shadow Copy
        var shadow = new PlanningTemplate
        {
            Name = systemTemplate.Name,
            Code = $"{systemTemplate.Code}_{userId}", 
            Level = systemTemplate.Level,
            ParentTemplateId = systemTemplate.ParentTemplateId,
            TeamCategoryId = systemTemplate.TeamCategoryId,
            Description = systemTemplate.Description,
            IsSystem = false,
            OwnerId = userId,
            SystemSourceId = systemTemplate.Id,
            Version = systemTemplate.Version,
            IsActive = true
        };

        _db.PlanningTemplates.Add(shadow);
        await _db.SaveChangesAsync(); // Save to get shadow ID

        // Copy Concepts
        foreach (var concept in systemTemplate.TemplateConcepts)
        {
            var shadowConcept = new PlanningTemplateConcept
            {
                PlanningTemplateId = shadow.Id,
                SportConceptId = concept.SportConceptId,
                CustomDescription = concept.CustomDescription,
                Order = concept.Order
            };
            _db.Set<PlanningTemplateConcept>().Add(shadowConcept);
        }

        await _db.SaveChangesAsync();

        return shadow;
    }

    public async Task<bool> DeleteTemplateAsync(int id, string userId)
    {
        var template = await _db.PlanningTemplates
            .FirstOrDefaultAsync(i => i.Id == id && i.OwnerId == userId);

        if (template == null) return false;

        _db.PlanningTemplates.Remove(template);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateTemplateAsync(PlanningTemplate template, string userId)
    {
        var existing = await _db.PlanningTemplates
            .FirstOrDefaultAsync(i => i.Id == template.Id && i.OwnerId == userId);

        if (existing == null) return false;

        // Update basic fields
        existing.Name = template.Name;
        existing.Description = template.Description;
        existing.Level = template.Level;
        existing.IsActive = template.IsActive;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<PlanningTemplate>> DownloadItineraryAsync(int itineraryId, string userId)
    {
        var itinerary = await _db.MethodologicalItineraries
            .Include(i => i.PlanningTemplates)
            .FirstOrDefaultAsync(i => i.Id == itineraryId && i.IsSystem);

        if (itinerary == null)
        {
            throw new KeyNotFoundException("System itinerary not found.");
        }

        var downloadedTemplates = new List<PlanningTemplate>();

        foreach (var systemTemplate in itinerary.PlanningTemplates)
        {
            // LinkSystemTemplateAsync handles the heavy lifting of copying concepts and metadata
            var downloaded = await LinkSystemTemplateAsync(systemTemplate.Id, userId);
            downloadedTemplates.Add(downloaded);
        }

        return downloadedTemplates;
    }
}
