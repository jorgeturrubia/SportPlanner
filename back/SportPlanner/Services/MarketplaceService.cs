using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Services;

public class MarketplaceService : IMarketplaceService
{
    private readonly AppDbContext _db;

    public MarketplaceService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<MethodologicalItinerary>> SearchItinerariesAsync(MarketplaceFilterDto filter)
    {
        var query = _db.MethodologicalItineraries
            .Where(i => i.IsSystem && i.IsActive)
            .Include(i => i.Sport)
            .Include(i => i.PlanningTemplates)
                .ThenInclude(pt => pt.TeamCategory)
            .AsQueryable();

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

        return await query.ToListAsync();
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
}