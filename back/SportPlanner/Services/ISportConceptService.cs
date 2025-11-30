using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Services;

public interface ISportConceptService
{
    Task<SportConcept> CreateAsync(CreateSportConceptDto dto);
    Task<List<SportConcept>> GetBySportAsync(int sportId);
    Task<List<SportConcept>> GetAllAsync(int? sportId = null);
    Task<List<SportConceptWithSuggestionDto>> GetConceptsWithSuggestionsAsync(int teamId);
    Task<SportConcept?> GetByIdAsync(int id);
    Task<SportConcept> UpdateAsync(int id, CreateSportConceptDto dto);
    Task DeleteAsync(int id);
}
