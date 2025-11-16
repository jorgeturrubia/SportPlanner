using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Services;

public interface ISportConceptService
{
    Task<SportConcept> CreateAsync(CreateSportConceptDto dto);
    Task<List<SportConcept>> GetBySportAsync(int sportId);
}
