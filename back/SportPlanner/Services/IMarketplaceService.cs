using SportPlanner.Application.DTOs;
using SportPlanner.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SportPlanner.Services;

/// <summary>
/// Service for searching and filtering system templates in the marketplace.
/// </summary>
public interface IMarketplaceService
{
    /// <summary>
    /// Searches for system items (itineraries, templates, concepts, exercises) based on a set of filters.
    /// </summary>
    /// <param name="filter">The filtering criteria.</param>
    /// <returns>A list of matching marketplace items.</returns>
    Task<List<MarketplaceItemDto>> SearchAsync(MarketplaceFilterDto filter);

    /// <summary>
    /// Gets the full details of an itinerary, including its templates and concepts.
    /// </summary>
    Task<ItineraryDetailDto?> GetItineraryDetailAsync(int id);

    /// <summary>
    /// Gets the full details of a single template, including its concepts.
    /// </summary>
    Task<TemplateDetailDto?> GetTemplateDetailAsync(int id);

    /// <summary>
    /// Deletes a system itinerary from the marketplace.
    /// Only accessible by SuperAdmin.
    /// </summary>
    Task<bool> DeleteSystemItineraryAsync(int id);
}
