using SportPlanner.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SportPlanner.Services;

/// <summary>
/// Service for managing user planning templates and shadowing logic from the marketplace.
/// </summary>
public interface IPlanningTemplateService
{
    /// <summary>
    /// Gets all templates belonging to a user (including downloads).
    /// </summary>
    Task<List<PlanningTemplate>> GetUserTemplatesAsync(string userId, int? sportId = null);

    /// <summary>
    /// Links a system template to a user's local workspace.
    /// This creates a "shadow" copy of the template.
    /// </summary>
    Task<PlanningTemplate> LinkSystemTemplateAsync(int systemTemplateId, string userId);

    /// <summary>
    /// Deletes a user's template.
    /// </summary>
    Task<bool> DeleteTemplateAsync(int id, string userId);

    /// <summary>
    /// Gets a template by ID, ensuring the user has access.
    /// </summary>
    Task<PlanningTemplate?> GetTemplateByIdAsync(int id, string userId);

    /// <summary>
    /// Updates a user's template.
    /// </summary>
    Task<bool> UpdateTemplateAsync(PlanningTemplate template, string userId);

    /// <summary>
    /// Creates a new template for a user.
    /// </summary>
    Task<PlanningTemplate> CreateTemplateAsync(PlanningTemplate template, string userId);

    /// <summary>
    /// Updates the concepts of a template (replace all).
    /// </summary>
    Task<bool> UpdateTemplateConceptsAsync(int templateId, List<PlanningTemplateConcept> concepts, string userId);

    /// <summary>
    /// Downloads all templates within an itinerary to a user's local workspace.
    /// </summary>
    Task<List<PlanningTemplate>> DownloadItineraryAsync(int itineraryId, string userId);

    // MethodologicalItinerary methods
    Task<List<MethodologicalItinerary>> GetUserItinerariesAsync(string userId);
    Task<MethodologicalItinerary?> GetItineraryByIdAsync(int id, string userId);
    Task<MethodologicalItinerary> CreateItineraryAsync(MethodologicalItinerary itinerary, string userId);
    Task<bool> UpdateItineraryAsync(MethodologicalItinerary itinerary, string userId);
    Task<bool> DeleteItineraryAsync(int id, string userId);
}
