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
            SportId = dto.SportId ?? throw new ArgumentException("SportId is required for creation")
        };
        _db.SportConcepts.Add(concept);
        await _db.SaveChangesAsync();
        return concept;
    }

    public async Task<List<SportConcept>> GetBySportAsync(int sportId)
    {
        // 1. Fetch concepts
        var concepts = await _db.SportConcepts
            .Include(sc => sc.ConceptCategory)
            .Where(sc => sc.SportId == sportId && sc.IsActive)
            .ToListAsync();

        // 2. Fetch all categories to build the full hierarchy
        // This is efficient enough as categories are usually < 1000
        var allCategories = await _db.ConceptCategories
            .Where(c => c.IsActive)
            .ToListAsync();

        var categoryMap = allCategories.ToDictionary(c => c.Id);

        // 3. Reconstruct hierarchy for each concept's category
        foreach (var concept in concepts)
        {
            if (concept.ConceptCategory != null && concept.ConceptCategory.ParentId.HasValue)
            {
                // Manually traverse up to ensure full chain is populated
                var current = concept.ConceptCategory;
                while (current.ParentId.HasValue && categoryMap.ContainsKey(current.ParentId.Value))
                {
                    current.Parent = categoryMap[current.ParentId.Value];
                    current = current.Parent;
                }
            }
        }

        return concepts;
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

    public async Task<List<SportConceptWithSuggestionDto>> GetConceptsWithSuggestionsAsync(int teamId, int seasonId)
    {
        // 1. Get team with season details
        var team = await _db.Teams
            .Include(t => t.TeamSeasons)
            .FirstOrDefaultAsync(t => t.Id == teamId);

        if (team == null) return new List<SportConceptWithSuggestionDto>();

        var teamSeason = team.TeamSeasons.FirstOrDefault(ts => ts.SeasonId == seasonId);
        // Default to 0 levels if no season data found (or maybe throw exception?)
        // For robustness, default to 0.
        int technicalLevel = teamSeason?.TechnicalLevel ?? 0;
        int tacticalLevel = teamSeason?.TacticalLevel ?? 0;

        // 2. Get all concepts
        var concepts = await _db.SportConcepts
            .Include(c => c.ConceptCategory)
                .ThenInclude(cc => cc!.Parent)
            .Where(c => c.IsActive && c.SportId == team.SportId) // Ensure sport matches
            .ToListAsync();

        var dtos = new List<SportConceptWithSuggestionDto>();

        foreach (var c in concepts)
        {
            var dto = _mapper.Map<SportConceptWithSuggestionDto>(c);

            // Suggestion Logic
            bool isSuggested = true;

            // 1. Check Difficulty/Complexity vs Team Level
            // Concept Technical Difficulty should be within range of Team Technical Level (+/- 2?)
            // If concept difficulty is much higher than team level, it might be too hard.
            // If much lower, it might be too easy (but still useful for warmup/review).
            // Let's filter out "Too Hard" only.

            if (Math.Abs(dto.TechnicalDifficulty - technicalLevel) > 2)
            {
                isSuggested = false;
            }

            // 2. Check Usefulness (Tactical Complexity)
            // Similar logic
            if (isSuggested && Math.Abs(dto.TacticalComplexity - tacticalLevel) > 2)
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
        
        // Do not update SportId on edit usually, but if needed:
        if (dto.SportId.HasValue) 
        {
            concept.SportId = dto.SportId.Value;
        }

        await _db.SaveChangesAsync();
        return concept;
    }

    public async Task DeleteAsync(int id)
    {
        var concept = await _db.SportConcepts
            .Include(sc => sc.Exercises)
            .FirstOrDefaultAsync(sc => sc.Id == id);

        if (concept == null) return;

        // Check for associations in Templates, Plans and Training Sessions
        bool hasAssociations = await _db.Set<PlanningTemplateConcept>().AnyAsync(ptc => ptc.SportConceptId == id) ||
                               await _db.Set<PlanConcept>().AnyAsync(pc => pc.SportConceptId == id) ||
                               await _db.Set<TrainingSessionConcept>().AnyAsync(tsc => tsc.SportConceptId == id) ||
                               await _db.Set<TrainingSessionExercise>().AnyAsync(tse => tse.SportConceptId == id) ||
                               concept.Exercises.Any();

        if (hasAssociations)
        {
            // Soft Delete: Just deactivate
            concept.IsActive = false;
        }
        else
        {
            // Hard Delete: Remove from DB
            _db.SportConcepts.Remove(concept);
        }

        await _db.SaveChangesAsync();
    }
}
