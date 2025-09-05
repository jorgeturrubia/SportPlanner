using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public interface ICustomExerciseService
{
    Task<IEnumerable<CustomExerciseDto>> GetUserCustomExercisesAsync(Guid userId);
    Task<IEnumerable<CustomExerciseDto>> GetFilteredCustomExercisesAsync(Guid userId, CustomExerciseFilterDto filter);
    Task<CustomExerciseDto?> GetCustomExerciseAsync(string exerciseId, Guid userId);
    Task<CustomExerciseDto> CreateCustomExerciseAsync(CreateCustomExerciseRequest request, Guid userId);
    Task<CustomExerciseDto> UpdateCustomExerciseAsync(string exerciseId, UpdateCustomExerciseRequest request, Guid userId);
    Task DeleteCustomExerciseAsync(string exerciseId, Guid userId);
    Task<bool> UserCanAccessCustomExerciseAsync(string exerciseId, Guid userId);
    Task IncrementUsageCountAsync(string exerciseId);
}