using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Services;

public interface IConceptInterpretationService
{
    Task<ConceptInterpretation> CreateAsync(ConceptInterpretationCreateDto dto);
    Task<ConceptInterpretation?> ResolveForTeamAsync(int sportConceptId, int teamId);
}
