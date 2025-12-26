using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SportPlanner.Services;

public class RatingService : IRatingService
{
    private readonly AppDbContext _db;

    public RatingService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<bool> RateItineraryAsync(int itineraryId, string userId, int rating)
    {
        if (rating < 1 || rating > 5) return false;

        var itinerary = await _db.MethodologicalItineraries.FindAsync(itineraryId);
        if (itinerary == null) return false;

        var existingRating = await _db.MethodologicalItineraryRatings
            .FirstOrDefaultAsync(r => r.MethodologicalItineraryId == itineraryId && r.UserId == userId);

        if (existingRating == null)
        {
            _db.MethodologicalItineraryRatings.Add(new MethodologicalItineraryRating
            {
                MethodologicalItineraryId = itineraryId,
                UserId = userId,
                Rating = rating,
                CreatedAt = DateTime.UtcNow
            });
        }
        else
        {
            existingRating.Rating = rating;
            existingRating.CreatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        // Background update of averages
        await UpdateItineraryStatsAsync(itineraryId);

        return true;
    }

    public async Task<int?> GetUserRatingAsync(int itineraryId, string userId)
    {
        var rating = await _db.MethodologicalItineraryRatings
            .Where(r => r.MethodologicalItineraryId == itineraryId && r.UserId == userId)
            .Select(r => r.Rating)
            .FirstOrDefaultAsync();
        
        return rating == 0 ? null : rating;
    }

    private async Task UpdateItineraryStatsAsync(int itineraryId)
    {
        var ratings = await _db.MethodologicalItineraryRatings
            .Where(r => r.MethodologicalItineraryId == itineraryId)
            .Select(r => r.Rating)
            .ToListAsync();

        var itinerary = await _db.MethodologicalItineraries.FindAsync(itineraryId);
        if (itinerary != null)
        {
            itinerary.RatingCount = ratings.Count;
            itinerary.AverageRating = ratings.Count > 0 ? ratings.Average() : 0;
            await _db.SaveChangesAsync();
        }
    }
}
