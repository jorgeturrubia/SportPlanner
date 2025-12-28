using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

public class ConceptCategoryService : IConceptCategoryService
{
    private readonly AppDbContext _db;

    public ConceptCategoryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ConceptCategory> CreateAsync(CreateConceptCategoryDto dto)
    {
        var category = new ConceptCategory
        {
            Name = dto.Name,
            Description = dto.Description,
            ParentId = dto.ParentId
        };
        _db.ConceptCategories.Add(category);
        await _db.SaveChangesAsync();
        return category;
    }

    public async Task<List<ConceptCategory>> GetAllAsync(bool includeInactive = false)
    {
        var query = _db.ConceptCategories.AsQueryable();
        
        if (!includeInactive)
        {
            query = query.Where(c => c.IsActive);
        }
        var categories = await query
            .Include(c => c.SportConcepts)
            .OrderBy(c => c.Name)
            .ToListAsync();

        return categories;
    }

    public async Task<ConceptCategory?> GetByIdAsync(int id)
    {
        return await _db.ConceptCategories
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<ConceptCategory> UpdateAsync(int id, CreateConceptCategoryDto dto)
    {
        var category = await _db.ConceptCategories.FindAsync(id);
        if (category == null)
            throw new ArgumentException("Category not found");

        // Prevent circular dependency if ParentId is updated
        if (dto.ParentId.HasValue && dto.ParentId.Value == id)
        {
            throw new ArgumentException("A category cannot be its own parent.");
        }

        category.Name = dto.Name;
        category.Description = dto.Description;
        category.ParentId = dto.ParentId;

        await _db.SaveChangesAsync();
        return category;
    }

    public async Task DeleteAsync(int id)
    {
        var category = await _db.ConceptCategories
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id);
            
        if (category == null) return;

        // Get all IDs in the hierarchy
        var allRelatedIds = new List<int>();
        await GetAllSubCategoryIdsRecursive(id, allRelatedIds);

        // Check if any category in the hierarchy is used in SportConcepts
        var isUsed = await _db.SportConcepts
            .AnyAsync(sc => allRelatedIds.Contains(sc.ConceptCategoryId ?? 0));

        if (isUsed)
        {
            // If used, deactivate the whole branch
            var categoriesToDeactivate = await _db.ConceptCategories
                .Where(c => allRelatedIds.Contains(c.Id))
                .ToListAsync();

            foreach (var cat in categoriesToDeactivate)
            {
                cat.IsActive = false;
            }
        }
        else
        {
            // If not used, physical delete of the whole branch
            var categoriesToDelete = await _db.ConceptCategories
                .Where(c => allRelatedIds.Contains(c.Id))
                .ToListAsync();

            _db.ConceptCategories.RemoveRange(categoriesToDelete);
        }

        await _db.SaveChangesAsync();
    }

    private async Task GetAllSubCategoryIdsRecursive(int parentId, List<int> ids)
    {
        ids.Add(parentId);
        var subIds = await _db.ConceptCategories
            .Where(c => c.ParentId == parentId)
            .Select(c => c.Id)
            .ToListAsync();

        foreach (var subId in subIds)
        {
            await GetAllSubCategoryIdsRecursive(subId, ids);
        }
    }
}
