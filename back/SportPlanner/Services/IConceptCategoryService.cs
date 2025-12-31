using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Services;

public interface IConceptCategoryService
{
    Task<ConceptCategory> CreateAsync(CreateConceptCategoryDto dto);
    Task<List<ConceptCategory>> GetAllAsync(bool includeInactive = false, string? userId = null);
    Task<ConceptCategory?> GetByIdAsync(int id);
    Task<ConceptCategory> UpdateAsync(int id, CreateConceptCategoryDto dto);
    Task DeleteAsync(int id);
}
