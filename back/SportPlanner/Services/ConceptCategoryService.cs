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

    public async Task<List<ConceptCategory>> GetAllAsync()
    {
        return await _db.ConceptCategories
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<ConceptCategory?> GetByIdAsync(int id)
    {
        return await _db.ConceptCategories
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);
    }

    public async Task<ConceptCategory> UpdateAsync(int id, CreateConceptCategoryDto dto)
    {
        var category = await _db.ConceptCategories.FindAsync(id);
        if (category == null || !category.IsActive)
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
        var category = await _db.ConceptCategories.FindAsync(id);
        if (category != null)
        {
            category.IsActive = false;
            // Also deactivate subcategories or handle them as needed. 
            // For now, we just deactivate the parent. Logic could be extended to recursive deactivation.
            await _db.SaveChangesAsync();
        }
    }
}
