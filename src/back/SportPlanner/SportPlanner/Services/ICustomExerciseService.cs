using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public interface ICustomExerciseService
{
    Task<IEnumerable<CustomExerciseDto>> GetUserCustomExercisesAsync(Guid userId);
    Task<IEnumerable<CustomExerciseDto>> GetFilteredCustomExercisesAsync(Guid userId, CustomExerciseFilterDto filter);
    Task<CustomExerciseDto?> GetCustomExerciseAsync(int exerciseId, Guid userId);
    Task<CustomExerciseDto> CreateCustomExerciseAsync(CreateCustomExerciseRequest request, Guid userId);
    Task<CustomExerciseDto> UpdateCustomExerciseAsync(int exerciseId, UpdateCustomExerciseRequest request, Guid userId);
    Task DeleteCustomExerciseAsync(int exerciseId, Guid userId);
    Task<bool> UserCanAccessCustomExerciseAsync(int exerciseId, Guid userId);
    Task IncrementUsageCountAsync(int exerciseId);
}