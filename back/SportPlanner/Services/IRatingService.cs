using System.Threading.Tasks;

namespace SportPlanner.Services;

/// <summary>
/// Service for managing template ratings.
/// </summary>
public interface IRatingService
{
    /// <summary>
    /// Adds or updates a rating for a methodological itinerary.
    /// </summary>
    /// <param name="itineraryId">ID of the itinerary being rated.</param>
    /// <param name="userId">ID of the user voting.</param>
    /// <param name="rating">Numeric value (1-5).</param>
    Task<bool> RateItineraryAsync(int itineraryId, string userId, int rating);

    /// <summary>
    /// Gets the rating given by a specific user to an itinerary.
    /// </summary>
    Task<int?> GetUserRatingAsync(int itineraryId, string userId);
}
