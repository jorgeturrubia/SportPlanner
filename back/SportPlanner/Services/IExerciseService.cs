using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Services;

public interface IExerciseService
{
    Task<List<Exercise>> GetAllAsync(int? conceptId = null, string? userId = null);
    Task<Exercise?> GetByIdAsync(int id);
    Task<Exercise> CreateAsync(CreateExerciseDto dto);
    Task<Exercise> UpdateAsync(int id, CreateExerciseDto dto);
    Task DeleteAsync(int id);
}
