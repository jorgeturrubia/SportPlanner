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
    /// Searches for system itineraries based on a set of filters.
    /// </summary>
    /// <param name="filter">The filtering criteria.</param>
    /// <returns>A list of matching itineraries.</returns>
    Task<List<MethodologicalItinerary>> SearchItinerariesAsync(MarketplaceFilterDto filter);

    /// <summary>
    /// Deletes a system itinerary from the marketplace.
    /// Only accessible by SuperAdmin.
    /// </summary>
    Task<bool> DeleteSystemItineraryAsync(int id);
}
