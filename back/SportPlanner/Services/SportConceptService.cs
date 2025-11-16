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
            ConceptPhaseId = dto.ConceptPhaseId,
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
        return await _db.SportConcepts.Where(sc => sc.SportId == sportId).ToListAsync();
    }
}
