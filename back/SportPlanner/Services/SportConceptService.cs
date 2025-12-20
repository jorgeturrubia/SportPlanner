using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

public class SportConceptService : ISportConceptService
{
    private readonly AppDbContext _db;
    private readonly AutoMapper.IMapper _mapper;

    public SportConceptService(AppDbContext db, AutoMapper.IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<SportConcept> CreateAsync(CreateSportConceptDto dto)
    {
        var concept = new SportConcept
        {
            Name = dto.Name,
            Description = dto.Description,
            Url = dto.Url,
            ConceptCategoryId = dto.ConceptCategoryId,
            TechnicalDifficulty = dto.TechnicalDifficulty,
            TacticalComplexity = dto.TacticalComplexity,
            TechnicalTacticalFocus = dto.TechnicalTacticalFocus,
            DevelopmentLevel = dto.DevelopmentLevel,
            ConceptTemplateId = dto.ConceptTemplateId,
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
                .ThenInclude(cc => cc!.Parent)

            .Where(sc => sc.SportId == sportId && sc.IsActive)
            .ToListAsync();
    }

    public async Task<List<SportConcept>> GetAllAsync(int? sportId = null)
    {
        var query = _db.SportConcepts
            .Include(sc => sc.ConceptCategory)
                .ThenInclude(cc => cc!.Parent)

            .Where(sc => sc.IsActive);

        if (sportId.HasValue)
        {
            query = query.Where(sc => sc.SportId == sportId);
        }

        return await query.OrderBy(sc => sc.Name).ToListAsync();
    }

    public async Task<List<SportConceptWithSuggestionDto>> GetConceptsWithSuggestionsAsync(int teamId)
    {
        var team = await _db.Teams
            .Include(t => t.TeamCategory)
            .FirstOrDefaultAsync(t => t.Id == teamId);

        if (team == null || team.SportId == null) return new List<SportConceptWithSuggestionDto>();

        var concepts = await GetBySportAsync(team.SportId.Value);
        var dtos = _mapper.Map<List<SportConceptWithSuggestionDto>>(concepts);

        foreach (var dto in dtos)
        {
            bool isSuggested = true;

            // 1. Check Technical Level (Concept Difficulty vs Team Level)
            // Suggested if concept difficulty is close to team level (within range)
            // We suggest concepts that are reachable: e.g., difficulty <= teamLevel + 2
            // And not too easy? e.g., difficulty >= teamLevel - 2
            if (Math.Abs(dto.TechnicalDifficulty - team.CurrentTechnicalLevel) > 2)
            {
                isSuggested = false;
            }

            // 2. Check Tactical Level
            if (isSuggested && Math.Abs(dto.TacticalComplexity - team.CurrentTacticalLevel) > 2)
            {
                isSuggested = false;
            }

            // 3. Check Age Appropriateness (if TeamCategory has age limits)
            // Note: SportConcept currently doesn't have explicit age limits, 
            // but we could infer or add logic if ConceptCategory had age hints.
            // For now, we rely on difficulty/complexity as a proxy for age suitability.
            // Future improvement: Add MinAge/MaxAge to SportConcept or ConceptCategory.

            dto.IsSuggested = isSuggested;
        }

        return dtos.OrderByDescending(d => d.IsSuggested).ThenBy(d => d.Name).ToList();
    }

    public async Task<SportConcept?> GetByIdAsync(int id)
    {
        return await _db.SportConcepts
            .Include(sc => sc.ConceptCategory)
                .ThenInclude(cc => cc!.Parent)

            .FirstOrDefaultAsync(sc => sc.Id == id);
    }

    public async Task<SportConcept> UpdateAsync(int id, CreateSportConceptDto dto)
    {
        var concept = await _db.SportConcepts.FindAsync(id);
        if (concept == null)
            throw new ArgumentException("Concept not found");

        concept.Name = dto.Name;
        concept.Description = dto.Description;
        concept.Url = dto.Url;
        concept.ConceptCategoryId = dto.ConceptCategoryId;
        concept.TechnicalDifficulty = dto.TechnicalDifficulty;
        concept.TacticalComplexity = dto.TacticalComplexity;
        concept.TechnicalTacticalFocus = dto.TechnicalTacticalFocus;
        concept.DevelopmentLevel = dto.DevelopmentLevel;
        concept.ConceptTemplateId = dto.ConceptTemplateId;
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
