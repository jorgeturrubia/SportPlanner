using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models.DTOs;
using SportPlanner.Models.Masters;

namespace SportPlanner.Services;

public class SportService : ISportService
{
    private readonly SportPlannerDbContext _context;

    public SportService(SportPlannerDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SportDto>> GetAllSportsAsync()
    {
        return await _context.Sports
            .Where(s => s.IsActive)
            .OrderBy(s => s.Name)
            .Select(s => new SportDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                IsActive = s.IsActive,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<SportSummaryDto>> GetSportsSummaryAsync()
    {
        return await _context.Sports
            .Where(s => s.IsActive)
            .Select(s => new SportSummaryDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                IsActive = s.IsActive,
                CategoriesCount = s.Categories.Count(c => c.IsActive),
                SportGendersCount = s.SportGenders.Count(g => g.IsActive),
                LevelsCount = s.Levels.Count(l => l.IsActive)
            })
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<SportDto?> GetSportByIdAsync(int id)
    {
        var sport = await _context.Sports
            .FirstOrDefaultAsync(s => s.Id == id && s.IsActive);

        if (sport == null) return null;

        return new SportDto
        {
            Id = sport.Id,
            Name = sport.Name,
            Description = sport.Description,
            IsActive = sport.IsActive,
            CreatedAt = sport.CreatedAt,
            UpdatedAt = sport.UpdatedAt
        };
    }

    public async Task<SportDto> CreateSportAsync(CreateSportDto createSportDto)
    {
        var sport = new Sport
        {
            Name = createSportDto.Name,
            Description = createSportDto.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Sports.Add(sport);
        await _context.SaveChangesAsync();

        return new SportDto
        {
            Id = sport.Id,
            Name = sport.Name,
            Description = sport.Description,
            IsActive = sport.IsActive,
            CreatedAt = sport.CreatedAt,
            UpdatedAt = sport.UpdatedAt
        };
    }

    public async Task<SportDto?> UpdateSportAsync(int id, UpdateSportDto updateSportDto)
    {
        var sport = await _context.Sports.FirstOrDefaultAsync(s => s.Id == id);
        if (sport == null) return null;

        sport.Name = updateSportDto.Name;
        sport.Description = updateSportDto.Description;
        sport.IsActive = updateSportDto.IsActive;
        sport.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new SportDto
        {
            Id = sport.Id,
            Name = sport.Name,
            Description = sport.Description,
            IsActive = sport.IsActive,
            CreatedAt = sport.CreatedAt,
            UpdatedAt = sport.UpdatedAt
        };
    }

    public async Task<bool> DeleteSportAsync(int id)
    {
        var sport = await _context.Sports.FirstOrDefaultAsync(s => s.Id == id);
        if (sport == null) return false;

        sport.IsActive = false;
        sport.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> SportExistsAsync(int id)
    {
        return await _context.Sports.AnyAsync(s => s.Id == id && s.IsActive);
    }
}

public class CategoryService : ICategoryService
{
    private readonly SportPlannerDbContext _context;

    public CategoryService(SportPlannerDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
    {
        return await _context.Categories
            .Include(c => c.Sport)
            .Where(c => c.IsActive)
            .OrderBy(c => c.Sport.Name)
            .ThenBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                MinAge = c.MinAge,
                MaxAge = c.MaxAge,
                IsActive = c.IsActive,
                SportId = c.SportId,
                SportName = c.Sport.Name,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesBySportAsync(int sportId)
    {
        return await _context.Categories
            .Include(c => c.Sport)
            .Where(c => c.SportId == sportId && c.IsActive)
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                MinAge = c.MinAge,
                MaxAge = c.MaxAge,
                IsActive = c.IsActive,
                SportId = c.SportId,
                SportName = c.Sport.Name,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<CategorySummaryDto>> GetCategoriesSummaryAsync()
    {
        return await _context.Categories
            .Include(c => c.Sport)
            .Where(c => c.IsActive)
            .Select(c => new CategorySummaryDto
            {
                Id = c.Id,
                Name = c.Name,
                MinAge = c.MinAge,
                MaxAge = c.MaxAge,
                IsActive = c.IsActive,
                SportId = c.SportId,
                SportName = c.Sport.Name
            })
            .OrderBy(c => c.SportName)
            .ThenBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Sport)
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

        if (category == null) return null;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            MinAge = category.MinAge,
            MaxAge = category.MaxAge,
            IsActive = category.IsActive,
            SportId = category.SportId,
            SportName = category.Sport.Name,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
    {
        var category = new Category
        {
            Name = createCategoryDto.Name,
            Description = createCategoryDto.Description,
            MinAge = createCategoryDto.MinAge,
            MaxAge = createCategoryDto.MaxAge,
            SportId = createCategoryDto.SportId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        // Load the sport for the response
        await _context.Entry(category)
            .Reference(c => c.Sport)
            .LoadAsync();

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            MinAge = category.MinAge,
            MaxAge = category.MaxAge,
            IsActive = category.IsActive,
            SportId = category.SportId,
            SportName = category.Sport.Name,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }

    public async Task<CategoryDto?> UpdateCategoryAsync(int id, UpdateCategoryDto updateCategoryDto)
    {
        var category = await _context.Categories
            .Include(c => c.Sport)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null) return null;

        category.Name = updateCategoryDto.Name;
        category.Description = updateCategoryDto.Description;
        category.MinAge = updateCategoryDto.MinAge;
        category.MaxAge = updateCategoryDto.MaxAge;
        category.SportId = updateCategoryDto.SportId;
        category.IsActive = updateCategoryDto.IsActive;
        category.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            MinAge = category.MinAge,
            MaxAge = category.MaxAge,
            IsActive = category.IsActive,
            SportId = category.SportId,
            SportName = category.Sport.Name,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }

    public async Task<bool> DeleteCategoryAsync(int id)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return false;

        category.IsActive = false;
        category.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> CategoryExistsAsync(int id)
    {
        return await _context.Categories.AnyAsync(c => c.Id == id && c.IsActive);
    }
}

public class SportGenderService : ISportGenderService
{
    private readonly SportPlannerDbContext _context;

    public SportGenderService(SportPlannerDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SportGenderDto>> GetAllSportGendersAsync()
    {
        return await _context.SportGenders
            .Include(g => g.Sport)
            .Where(g => g.IsActive)
            .OrderBy(g => g.Sport.Name)
            .ThenBy(g => g.Name)
            .Select(g => new SportGenderDto
            {
                Id = g.Id,
                Name = g.Name,
                Description = g.Description,
                IsActive = g.IsActive,
                SportId = g.SportId,
                SportName = g.Sport.Name,
                CreatedAt = g.CreatedAt,
                UpdatedAt = g.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<SportGenderDto>> GetSportGendersBySportAsync(int sportId)
    {
        return await _context.SportGenders
            .Include(g => g.Sport)
            .Where(g => g.SportId == sportId && g.IsActive)
            .OrderBy(g => g.Name)
            .Select(g => new SportGenderDto
            {
                Id = g.Id,
                Name = g.Name,
                Description = g.Description,
                IsActive = g.IsActive,
                SportId = g.SportId,
                SportName = g.Sport.Name,
                CreatedAt = g.CreatedAt,
                UpdatedAt = g.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<SportGenderSummaryDto>> GetSportGendersSummaryAsync()
    {
        return await _context.SportGenders
            .Include(g => g.Sport)
            .Where(g => g.IsActive)
            .Select(g => new SportGenderSummaryDto
            {
                Id = g.Id,
                Name = g.Name,
                IsActive = g.IsActive,
                SportId = g.SportId,
                SportName = g.Sport.Name
            })
            .OrderBy(g => g.SportName)
            .ThenBy(g => g.Name)
            .ToListAsync();
    }

    public async Task<SportGenderDto?> GetSportGenderByIdAsync(int id)
    {
        var gender = await _context.SportGenders
            .Include(g => g.Sport)
            .FirstOrDefaultAsync(g => g.Id == id && g.IsActive);

        if (gender == null) return null;

        return new SportGenderDto
        {
            Id = gender.Id,
            Name = gender.Name,
            Description = gender.Description,
            IsActive = gender.IsActive,
            SportId = gender.SportId,
            SportName = gender.Sport.Name,
            CreatedAt = gender.CreatedAt,
            UpdatedAt = gender.UpdatedAt
        };
    }

    public async Task<SportGenderDto> CreateSportGenderAsync(CreateSportGenderDto createSportGenderDto)
    {
        var gender = new SportGender
        {
            Name = createSportGenderDto.Name,
            Description = createSportGenderDto.Description,
            SportId = createSportGenderDto.SportId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.SportGenders.Add(gender);
        await _context.SaveChangesAsync();

        // Load the sport for the response
        await _context.Entry(gender)
            .Reference(g => g.Sport)
            .LoadAsync();

        return new SportGenderDto
        {
            Id = gender.Id,
            Name = gender.Name,
            Description = gender.Description,
            IsActive = gender.IsActive,
            SportId = gender.SportId,
            SportName = gender.Sport.Name,
            CreatedAt = gender.CreatedAt,
            UpdatedAt = gender.UpdatedAt
        };
    }

    public async Task<SportGenderDto?> UpdateSportGenderAsync(int id, UpdateSportGenderDto updateSportGenderDto)
    {
        var gender = await _context.SportGenders
            .Include(g => g.Sport)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (gender == null) return null;

        gender.Name = updateSportGenderDto.Name;
        gender.Description = updateSportGenderDto.Description;
        gender.SportId = updateSportGenderDto.SportId;
        gender.IsActive = updateSportGenderDto.IsActive;
        gender.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new SportGenderDto
        {
            Id = gender.Id,
            Name = gender.Name,
            Description = gender.Description,
            IsActive = gender.IsActive,
            SportId = gender.SportId,
            SportName = gender.Sport.Name,
            CreatedAt = gender.CreatedAt,
            UpdatedAt = gender.UpdatedAt
        };
    }

    public async Task<bool> DeleteSportGenderAsync(int id)
    {
        var gender = await _context.SportGenders.FirstOrDefaultAsync(g => g.Id == id);
        if (gender == null) return false;

        gender.IsActive = false;
        gender.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> SportGenderExistsAsync(int id)
    {
        return await _context.SportGenders.AnyAsync(g => g.Id == id && g.IsActive);
    }
}

public class LevelService : ILevelService
{
    private readonly SportPlannerDbContext _context;

    public LevelService(SportPlannerDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<LevelDto>> GetAllLevelsAsync()
    {
        return await _context.Levels
            .Include(l => l.Sport)
            .Where(l => l.IsActive)
            .OrderBy(l => l.Sport.Name)
            .ThenBy(l => l.Difficulty)
            .ThenBy(l => l.Name)
            .Select(l => new LevelDto
            {
                Id = l.Id,
                Name = l.Name,
                Description = l.Description,
                Difficulty = l.Difficulty,
                IsActive = l.IsActive,
                SportId = l.SportId,
                SportName = l.Sport.Name,
                CreatedAt = l.CreatedAt,
                UpdatedAt = l.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<LevelDto>> GetLevelsBySportAsync(int sportId)
    {
        return await _context.Levels
            .Include(l => l.Sport)
            .Where(l => l.SportId == sportId && l.IsActive)
            .OrderBy(l => l.Difficulty)
            .ThenBy(l => l.Name)
            .Select(l => new LevelDto
            {
                Id = l.Id,
                Name = l.Name,
                Description = l.Description,
                Difficulty = l.Difficulty,
                IsActive = l.IsActive,
                SportId = l.SportId,
                SportName = l.Sport.Name,
                CreatedAt = l.CreatedAt,
                UpdatedAt = l.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<LevelSummaryDto>> GetLevelsSummaryAsync()
    {
        return await _context.Levels
            .Include(l => l.Sport)
            .Where(l => l.IsActive)
            .Select(l => new LevelSummaryDto
            {
                Id = l.Id,
                Name = l.Name,
                Difficulty = l.Difficulty,
                IsActive = l.IsActive,
                SportId = l.SportId,
                SportName = l.Sport.Name
            })
            .OrderBy(l => l.SportName)
            .ThenBy(l => l.Difficulty)
            .ThenBy(l => l.Name)
            .ToListAsync();
    }

    public async Task<LevelDto?> GetLevelByIdAsync(int id)
    {
        var level = await _context.Levels
            .Include(l => l.Sport)
            .FirstOrDefaultAsync(l => l.Id == id && l.IsActive);

        if (level == null) return null;

        return new LevelDto
        {
            Id = level.Id,
            Name = level.Name,
            Description = level.Description,
            Difficulty = level.Difficulty,
            IsActive = level.IsActive,
            SportId = level.SportId,
            SportName = level.Sport.Name,
            CreatedAt = level.CreatedAt,
            UpdatedAt = level.UpdatedAt
        };
    }

    public async Task<LevelDto> CreateLevelAsync(CreateLevelDto createLevelDto)
    {
        var level = new Level
        {
            Name = createLevelDto.Name,
            Description = createLevelDto.Description,
            Difficulty = createLevelDto.Difficulty,
            SportId = createLevelDto.SportId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Levels.Add(level);
        await _context.SaveChangesAsync();

        // Load the sport for the response
        await _context.Entry(level)
            .Reference(l => l.Sport)
            .LoadAsync();

        return new LevelDto
        {
            Id = level.Id,
            Name = level.Name,
            Description = level.Description,
            Difficulty = level.Difficulty,
            IsActive = level.IsActive,
            SportId = level.SportId,
            SportName = level.Sport.Name,
            CreatedAt = level.CreatedAt,
            UpdatedAt = level.UpdatedAt
        };
    }

    public async Task<LevelDto?> UpdateLevelAsync(int id, UpdateLevelDto updateLevelDto)
    {
        var level = await _context.Levels
            .Include(l => l.Sport)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (level == null) return null;

        level.Name = updateLevelDto.Name;
        level.Description = updateLevelDto.Description;
        level.Difficulty = updateLevelDto.Difficulty;
        level.SportId = updateLevelDto.SportId;
        level.IsActive = updateLevelDto.IsActive;
        level.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new LevelDto
        {
            Id = level.Id,
            Name = level.Name,
            Description = level.Description,
            Difficulty = level.Difficulty,
            IsActive = level.IsActive,
            SportId = level.SportId,
            SportName = level.Sport.Name,
            CreatedAt = level.CreatedAt,
            UpdatedAt = level.UpdatedAt
        };
    }

    public async Task<bool> DeleteLevelAsync(int id)
    {
        var level = await _context.Levels.FirstOrDefaultAsync(l => l.Id == id);
        if (level == null) return false;

        level.IsActive = false;
        level.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> LevelExistsAsync(int id)
    {
        return await _context.Levels.AnyAsync(l => l.Id == id && l.IsActive);
    }
}

public class ExerciseCategoryService : IExerciseCategoryService
{
    private readonly SportPlannerDbContext _context;

    public ExerciseCategoryService(SportPlannerDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ExerciseCategoryDto>> GetAllExerciseCategoriesAsync()
    {
        return await _context.ExerciseCategories
            .Where(ec => ec.IsActive)
            .OrderBy(ec => ec.Name)
            .Select(ec => new ExerciseCategoryDto
            {
                Id = ec.Id,
                Name = ec.Name,
                Description = ec.Description,
                IsActive = ec.IsActive,
                CreatedAt = ec.CreatedAt,
                UpdatedAt = ec.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<ExerciseCategorySummaryDto>> GetExerciseCategoriesSummaryAsync()
    {
        return await _context.ExerciseCategories
            .Where(ec => ec.IsActive)
            .Select(ec => new ExerciseCategorySummaryDto
            {
                Id = ec.Id,
                Name = ec.Name,
                Description = ec.Description,
                IsActive = ec.IsActive
            })
            .OrderBy(ec => ec.Name)
            .ToListAsync();
    }

    public async Task<ExerciseCategoryDto?> GetExerciseCategoryByIdAsync(int id)
    {
        var exerciseCategory = await _context.ExerciseCategories
            .FirstOrDefaultAsync(ec => ec.Id == id && ec.IsActive);

        if (exerciseCategory == null) return null;

        return new ExerciseCategoryDto
        {
            Id = exerciseCategory.Id,
            Name = exerciseCategory.Name,
            Description = exerciseCategory.Description,
            IsActive = exerciseCategory.IsActive,
            CreatedAt = exerciseCategory.CreatedAt,
            UpdatedAt = exerciseCategory.UpdatedAt
        };
    }

    public async Task<ExerciseCategoryDto> CreateExerciseCategoryAsync(CreateExerciseCategoryDto createExerciseCategoryDto)
    {
        var exerciseCategory = new ExerciseCategory
        {
            Name = createExerciseCategoryDto.Name,
            Description = createExerciseCategoryDto.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.ExerciseCategories.Add(exerciseCategory);
        await _context.SaveChangesAsync();

        return new ExerciseCategoryDto
        {
            Id = exerciseCategory.Id,
            Name = exerciseCategory.Name,
            Description = exerciseCategory.Description,
            IsActive = exerciseCategory.IsActive,
            CreatedAt = exerciseCategory.CreatedAt,
            UpdatedAt = exerciseCategory.UpdatedAt
        };
    }

    public async Task<ExerciseCategoryDto?> UpdateExerciseCategoryAsync(int id, UpdateExerciseCategoryDto updateExerciseCategoryDto)
    {
        var exerciseCategory = await _context.ExerciseCategories.FirstOrDefaultAsync(ec => ec.Id == id);
        if (exerciseCategory == null) return null;

        exerciseCategory.Name = updateExerciseCategoryDto.Name;
        exerciseCategory.Description = updateExerciseCategoryDto.Description;
        exerciseCategory.IsActive = updateExerciseCategoryDto.IsActive;
        exerciseCategory.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ExerciseCategoryDto
        {
            Id = exerciseCategory.Id,
            Name = exerciseCategory.Name,
            Description = exerciseCategory.Description,
            IsActive = exerciseCategory.IsActive,
            CreatedAt = exerciseCategory.CreatedAt,
            UpdatedAt = exerciseCategory.UpdatedAt
        };
    }

    public async Task<bool> DeleteExerciseCategoryAsync(int id)
    {
        var exerciseCategory = await _context.ExerciseCategories.FirstOrDefaultAsync(ec => ec.Id == id);
        if (exerciseCategory == null) return false;

        exerciseCategory.IsActive = false;
        exerciseCategory.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ExerciseCategoryExistsAsync(int id)
    {
        return await _context.ExerciseCategories.AnyAsync(ec => ec.Id == id && ec.IsActive);
    }
}

public class DifficultyService : IDifficultyService
{
    private readonly SportPlannerDbContext _context;

    public DifficultyService(SportPlannerDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DifficultyDto>> GetAllDifficultiesAsync()
    {
        return await _context.Difficulties
            .Where(d => d.IsActive)
            .OrderBy(d => d.Level)
            .ThenBy(d => d.Name)
            .Select(d => new DifficultyDto
            {
                Id = d.Id,
                Name = d.Name,
                Level = d.Level,
                Description = d.Description,
                IsActive = d.IsActive,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<DifficultySummaryDto>> GetDifficultiesSummaryAsync()
    {
        return await _context.Difficulties
            .Where(d => d.IsActive)
            .Select(d => new DifficultySummaryDto
            {
                Id = d.Id,
                Name = d.Name,
                Level = d.Level,
                IsActive = d.IsActive
            })
            .OrderBy(d => d.Level)
            .ThenBy(d => d.Name)
            .ToListAsync();
    }

    public async Task<DifficultyDto?> GetDifficultyByIdAsync(int id)
    {
        var difficulty = await _context.Difficulties
            .FirstOrDefaultAsync(d => d.Id == id && d.IsActive);

        if (difficulty == null) return null;

        return new DifficultyDto
        {
            Id = difficulty.Id,
            Name = difficulty.Name,
            Level = difficulty.Level,
            Description = difficulty.Description,
            IsActive = difficulty.IsActive,
            CreatedAt = difficulty.CreatedAt,
            UpdatedAt = difficulty.UpdatedAt
        };
    }

    public async Task<DifficultyDto> CreateDifficultyAsync(CreateDifficultyDto createDifficultyDto)
    {
        var difficulty = new Difficulty
        {
            Name = createDifficultyDto.Name,
            Level = createDifficultyDto.Level,
            Description = createDifficultyDto.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Difficulties.Add(difficulty);
        await _context.SaveChangesAsync();

        return new DifficultyDto
        {
            Id = difficulty.Id,
            Name = difficulty.Name,
            Level = difficulty.Level,
            Description = difficulty.Description,
            IsActive = difficulty.IsActive,
            CreatedAt = difficulty.CreatedAt,
            UpdatedAt = difficulty.UpdatedAt
        };
    }

    public async Task<DifficultyDto?> UpdateDifficultyAsync(int id, UpdateDifficultyDto updateDifficultyDto)
    {
        var difficulty = await _context.Difficulties.FirstOrDefaultAsync(d => d.Id == id);
        if (difficulty == null) return null;

        difficulty.Name = updateDifficultyDto.Name;
        difficulty.Level = updateDifficultyDto.Level;
        difficulty.Description = updateDifficultyDto.Description;
        difficulty.IsActive = updateDifficultyDto.IsActive;
        difficulty.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new DifficultyDto
        {
            Id = difficulty.Id,
            Name = difficulty.Name,
            Level = difficulty.Level,
            Description = difficulty.Description,
            IsActive = difficulty.IsActive,
            CreatedAt = difficulty.CreatedAt,
            UpdatedAt = difficulty.UpdatedAt
        };
    }

    public async Task<bool> DeleteDifficultyAsync(int id)
    {
        var difficulty = await _context.Difficulties.FirstOrDefaultAsync(d => d.Id == id);
        if (difficulty == null) return false;

        difficulty.IsActive = false;
        difficulty.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DifficultyExistsAsync(int id)
    {
        return await _context.Difficulties.AnyAsync(d => d.Id == id && d.IsActive);
    }
}