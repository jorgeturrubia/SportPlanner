using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public interface ISportService
{
    Task<IEnumerable<SportDto>> GetAllSportsAsync();
    Task<IEnumerable<SportSummaryDto>> GetSportsSummaryAsync();
    Task<SportDto?> GetSportByIdAsync(int id);
    Task<SportDto> CreateSportAsync(CreateSportDto createSportDto);
    Task<SportDto?> UpdateSportAsync(int id, UpdateSportDto updateSportDto);
    Task<bool> DeleteSportAsync(int id);
    Task<bool> SportExistsAsync(int id);
}

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
    Task<IEnumerable<CategoryDto>> GetCategoriesBySportAsync(int sportId);
    Task<IEnumerable<CategorySummaryDto>> GetCategoriesSummaryAsync();
    Task<CategoryDto?> GetCategoryByIdAsync(int id);
    Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto);
    Task<CategoryDto?> UpdateCategoryAsync(int id, UpdateCategoryDto updateCategoryDto);
    Task<bool> DeleteCategoryAsync(int id);
    Task<bool> CategoryExistsAsync(int id);
}

public interface ISportGenderService
{
    Task<IEnumerable<SportGenderDto>> GetAllSportGendersAsync();
    Task<IEnumerable<SportGenderDto>> GetSportGendersBySportAsync(int sportId);
    Task<IEnumerable<SportGenderSummaryDto>> GetSportGendersSummaryAsync();
    Task<SportGenderDto?> GetSportGenderByIdAsync(int id);
    Task<SportGenderDto> CreateSportGenderAsync(CreateSportGenderDto createSportGenderDto);
    Task<SportGenderDto?> UpdateSportGenderAsync(int id, UpdateSportGenderDto updateSportGenderDto);
    Task<bool> DeleteSportGenderAsync(int id);
    Task<bool> SportGenderExistsAsync(int id);
}

public interface ILevelService
{
    Task<IEnumerable<LevelDto>> GetAllLevelsAsync();
    Task<IEnumerable<LevelDto>> GetLevelsBySportAsync(int sportId);
    Task<IEnumerable<LevelSummaryDto>> GetLevelsSummaryAsync();
    Task<LevelDto?> GetLevelByIdAsync(int id);
    Task<LevelDto> CreateLevelAsync(CreateLevelDto createLevelDto);
    Task<LevelDto?> UpdateLevelAsync(int id, UpdateLevelDto updateLevelDto);
    Task<bool> DeleteLevelAsync(int id);
    Task<bool> LevelExistsAsync(int id);
}

public interface IExerciseCategoryService
{
    Task<IEnumerable<ExerciseCategoryDto>> GetAllExerciseCategoriesAsync();
    Task<IEnumerable<ExerciseCategorySummaryDto>> GetExerciseCategoriesSummaryAsync();
    Task<ExerciseCategoryDto?> GetExerciseCategoryByIdAsync(int id);
    Task<ExerciseCategoryDto> CreateExerciseCategoryAsync(CreateExerciseCategoryDto createExerciseCategoryDto);
    Task<ExerciseCategoryDto?> UpdateExerciseCategoryAsync(int id, UpdateExerciseCategoryDto updateExerciseCategoryDto);
    Task<bool> DeleteExerciseCategoryAsync(int id);
    Task<bool> ExerciseCategoryExistsAsync(int id);
}

public interface IDifficultyService
{
    Task<IEnumerable<DifficultyDto>> GetAllDifficultiesAsync();
    Task<IEnumerable<DifficultySummaryDto>> GetDifficultiesSummaryAsync();
    Task<DifficultyDto?> GetDifficultyByIdAsync(int id);
    Task<DifficultyDto> CreateDifficultyAsync(CreateDifficultyDto createDifficultyDto);
    Task<DifficultyDto?> UpdateDifficultyAsync(int id, UpdateDifficultyDto updateDifficultyDto);
    Task<bool> DeleteDifficultyAsync(int id);
    Task<bool> DifficultyExistsAsync(int id);
}