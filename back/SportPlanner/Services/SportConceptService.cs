using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

public class SportConceptService : ISportConceptService
{
    private readonly AppDbContext _db;
    public SportConceptService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<SportConcept> CreateAsync(CreateSportConceptDto dto)
    {
        var concept = new SportConcept
        {
            Name = dto.Name,
            Description = dto.Description,
            ConceptCategoryId = dto.ConceptCategoryId,
            DifficultyLevelId = dto.DifficultyLevelId,
            ProgressWeight = dto.ProgressWeight,
            IsProgressive = dto.IsProgressive,
            SportId = dto.SportId
        };
        _db.SportConcepts.Add(concept);
        await _db.SaveChangesAsync();
        return concept;
    }

    public async Task<List<SportConcept>> GetBySportAsync(int sportId)
    {
        return await _db.SportConcepts
            .Include(sc => sc.ConceptCategory)
            .Include(sc => sc.DifficultyLevel)
            .Where(sc => sc.SportId == sportId && sc.IsActive)
            .ToListAsync();
    }

    public async Task<List<SportConcept>> GetAllAsync(int? sportId = null)
    {
        var query = _db.SportConcepts
            .Include(sc => sc.ConceptCategory)
            .Include(sc => sc.DifficultyLevel)
            .Where(sc => sc.IsActive);

        if (sportId.HasValue)
        {
            query = query.Where(sc => sc.SportId == sportId);
        }

        return await query.OrderBy(sc => sc.Name).ToListAsync();
    }

    public async Task<SportConcept?> GetByIdAsync(int id)
    {
        return await _db.SportConcepts
            .Include(sc => sc.ConceptCategory)
            .Include(sc => sc.DifficultyLevel)
            .FirstOrDefaultAsync(sc => sc.Id == id);
    }

    public async Task<SportConcept> UpdateAsync(int id, CreateSportConceptDto dto)
    {
        var concept = await _db.SportConcepts.FindAsync(id);
        if (concept == null)
            throw new ArgumentException("Concept not found");

        concept.Name = dto.Name;
        concept.Description = dto.Description;
        concept.ConceptCategoryId = dto.ConceptCategoryId;
        concept.DifficultyLevelId = dto.DifficultyLevelId;
        concept.ProgressWeight = dto.ProgressWeight;
        concept.IsProgressive = dto.IsProgressive;
        concept.SportId = dto.SportId;

        await _db.SaveChangesAsync();
        return concept;
    }

    public async Task DeleteAsync(int id)
    {
        var concept = await _db.SportConcepts.FindAsync(id);
        if (concept != null)
        {
            concept.IsActive = false;
            await _db.SaveChangesAsync();
        }
    }
}
