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
            .Include(i => i.TemplateConcepts)
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

    public async Task<PlanningTemplate> CreateTemplateAsync(PlanningTemplate template, string userId)
    {
        template.OwnerId = userId;
        template.IsSystem = false;
        // Ensure Code is set if not provided, though typically required
        if (string.IsNullOrEmpty(template.Code))
        {
            template.Code = $"{template.Name.Replace(" ", "_").ToUpper()}_{Guid.NewGuid().ToString().Substring(0, 8)}";
        }
        
        _db.PlanningTemplates.Add(template);
        await _db.SaveChangesAsync();
        return template;
    }

    public async Task<bool> UpdateTemplateConceptsAsync(int templateId, List<PlanningTemplateConcept> concepts, string userId)
    {
        var template = await _db.PlanningTemplates
            .Include(t => t.TemplateConcepts)
            .FirstOrDefaultAsync(t => t.Id == templateId && t.OwnerId == userId);

        if (template == null) return false;

        // Clear existing
        _db.RemoveRange(template.TemplateConcepts);
        
        // Add new
        foreach (var concept in concepts)
        {
            concept.PlanningTemplateId = templateId; // Ensure ID is linked
            concept.Id = 0; // Reset ID to ensure insert
            concept.PlanningTemplate = null;
            concept.SportConcept = null;
            _db.Set<PlanningTemplateConcept>().Add(concept);
        }

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

    public async Task<List<MethodologicalItinerary>> GetUserItinerariesAsync(string userId)
    {
        return await _db.MethodologicalItineraries
            .Where(i => i.OwnerId == userId && !i.IsSystem)
            .Include(i => i.Sport)
            .Include(i => i.PlanningTemplates)
            .ToListAsync();
    }

    public async Task<MethodologicalItinerary?> GetItineraryByIdAsync(int id, string userId)
    {
        return await _db.MethodologicalItineraries
            .Include(i => i.Sport)
            .Include(i => i.PlanningTemplates)
            .FirstOrDefaultAsync(i => i.Id == id && i.OwnerId == userId);
    }

    public async Task<MethodologicalItinerary> CreateItineraryAsync(MethodologicalItinerary itinerary, string userId)
    {
        itinerary.OwnerId = userId;
        itinerary.IsSystem = false;

        // If SportId is not provided, infer from active subscription
        if (itinerary.SportId == 0)
        {
            var subscription = await _db.Subscriptions
                .FirstOrDefaultAsync(s => s.UserSupabaseId == userId && s.IsActive);
            
            if (subscription != null)
            {
                itinerary.SportId = subscription.SportId;
            }
            else
            {
                // Fallback or error? For now, if no subscription, we might fail DB constraint if SportId is required.
                // But let's assume valid user has valid subscription.
                // Or maybe check if user is in an Organization?
                // Check if user is in an Organization
                var orgMembership = await _db.OrganizationMemberships
                     .FirstOrDefaultAsync(m => m.UserSupabaseId == userId);
                
                if (orgMembership != null)
                {
                    var orgSub = await _db.Subscriptions
                        .FirstOrDefaultAsync(s => s.OrganizationId == orgMembership.OrganizationId && s.IsActive);
                    
                    if (orgSub != null)
                    {
                         itinerary.SportId = orgSub.SportId;
                    }
                }
            }

            if (itinerary.SportId == 0) 
            {
                throw new InvalidOperationException("Cannot determine Sport for Itinerary. User has no active subscription.");
            }
        }
        
        // Extract templates to avoid EF inserting them as new
        var inputTemplates = itinerary.PlanningTemplates?.ToList();
        itinerary.PlanningTemplates = null; // Clear to prevent duplicate insertion
        
        // Save first to get ID
        _db.MethodologicalItineraries.Add(itinerary);
        await _db.SaveChangesAsync();

        // If templates are provided, link them
        if (inputTemplates != null && inputTemplates.Any())
        {
            var templateIds = inputTemplates.Select(t => t.Id).ToList();
            var userTemplates = await _db.PlanningTemplates
                .Where(t => templateIds.Contains(t.Id) && t.OwnerId == userId)
                .ToListAsync();

            foreach (var template in userTemplates)
            {
                template.MethodologicalItineraryId = itinerary.Id;
            }
            await _db.SaveChangesAsync();
        }

        return itinerary;
    }

    public async Task<bool> UpdateItineraryAsync(MethodologicalItinerary itinerary, string userId)
    {
        var existing = await _db.MethodologicalItineraries
            .Include(i => i.PlanningTemplates)
            .FirstOrDefaultAsync(i => i.Id == itinerary.Id && i.OwnerId == userId);

        if (existing == null) return false;

        existing.Name = itinerary.Name;
        existing.Description = itinerary.Description;
        existing.SportId = itinerary.SportId;
        existing.IsActive = itinerary.IsActive;

        // Handle Template Updates
        if (itinerary.PlanningTemplates != null)
        {
            var newTemplateIds = itinerary.PlanningTemplates.Select(t => t.Id).ToHashSet();
            
            // 1. Unlink templates that are no longer in the list
            foreach (var existingTemplate in existing.PlanningTemplates.ToList())
            {
                if (!newTemplateIds.Contains(existingTemplate.Id))
                {
                    existingTemplate.MethodologicalItineraryId = null;
                }
            }

            // 2. Link new templates
            var existingTemplateIds = existing.PlanningTemplates.Select(t => t.Id).ToHashSet();
            var templatesToAdd = newTemplateIds.Where(id => !existingTemplateIds.Contains(id)).ToList();

            if (templatesToAdd.Any())
            {
                var templatesToLink = await _db.PlanningTemplates
                    .Where(t => templatesToAdd.Contains(t.Id) && t.OwnerId == userId)
                    .ToListAsync();

                foreach (var template in templatesToLink)
                {
                    template.MethodologicalItineraryId = existing.Id;
                }
            }
        }

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteItineraryAsync(int id, string userId)
    {
        var itinerary = await _db.MethodologicalItineraries
            .FirstOrDefaultAsync(i => i.Id == id && i.OwnerId == userId);

        if (itinerary == null) return false;

        _db.MethodologicalItineraries.Remove(itinerary);
        await _db.SaveChangesAsync();
        return true;
    }
}
