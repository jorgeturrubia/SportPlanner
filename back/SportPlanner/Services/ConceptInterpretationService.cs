using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

public class ConceptInterpretationService : IConceptInterpretationService
{
    private readonly AppDbContext _db;
    public ConceptInterpretationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ConceptInterpretation> CreateAsync(ConceptInterpretationCreateDto dto)
    {
        var entity = new ConceptInterpretation
        {
            SportConceptId = dto.SportConceptId,
            TeamId = dto.TeamId,
            TeamCategoryId = dto.TeamCategoryId,
            TeamLevelId = dto.TeamLevelId,
            InterpretedDifficultyLevelId = dto.InterpretedDifficultyLevelId,
            DurationMultiplier = dto.DurationMultiplier,
            PriorityMultiplier = dto.PriorityMultiplier,
            IsSuggested = dto.IsSuggested,
            Notes = dto.Notes
        };
        _db.ConceptInterpretations.Add(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task<ConceptInterpretation?> ResolveForTeamAsync(int sportConceptId, int teamId)
    {
        // Precedence: TeamId > (TeamCategory + TeamLevel) > TeamCategory > TeamLevel > null
        var team = await _db.Teams.FindAsync(teamId);
        if (team == null) return null;

        var candidates = _db.ConceptInterpretations
            .Where(ci => ci.SportConceptId == sportConceptId);

        // Team specific
        var teamSpecific = await candidates.FirstOrDefaultAsync(ci => ci.TeamId == teamId);
        if (teamSpecific != null) return teamSpecific;

        // TeamCategory + TeamLevel
        if (team.TeamCategoryId.HasValue && team.TeamLevelId.HasValue)
        {
            var combo = await candidates.FirstOrDefaultAsync(ci => ci.TeamCategoryId == team.TeamCategoryId && ci.TeamLevelId == team.TeamLevelId);
            if (combo != null) return combo;
        }

        // TeamCategory only
        if (team.TeamCategoryId.HasValue)
        {
            var cat = await candidates.FirstOrDefaultAsync(ci => ci.TeamCategoryId == team.TeamCategoryId && ci.TeamLevelId == null);
            if (cat != null) return cat;
        }

        // TeamLevel only
        if (team.TeamLevelId.HasValue)
        {
            var lvl = await candidates.FirstOrDefaultAsync(ci => ci.TeamLevelId == team.TeamLevelId && ci.TeamCategoryId == null);
            if (lvl != null) return lvl;
        }

        return null; // no interpretation, use defaults
    }
}
