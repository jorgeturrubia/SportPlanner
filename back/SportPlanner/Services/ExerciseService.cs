using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

public class ExerciseService : IExerciseService
{
    private readonly AppDbContext _db;

    public ExerciseService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Exercise>> GetAllAsync(int? conceptId = null, string? userId = null)
    {
        var query = _db.Exercises
            .Include(e => e.Concepts)
            .Where(e => e.IsActive);

        if (conceptId.HasValue)
        {
            query = query.Where(e => e.Concepts.Any(c => c.Id == conceptId));
        }

        // Filter by ownership: user's exercises OR system exercises
        if (!string.IsNullOrEmpty(userId))
        {
            query = query.Where(e => e.OwnerId == userId);
        }
        else
        {
            query = query.Where(e => e.IsSystem);
        }

        return await query.OrderBy(e => e.Name).ToListAsync();
    }

    public async Task<Exercise?> GetByIdAsync(int id)
    {
        return await _db.Exercises
            .Include(e => e.Concepts)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Exercise> CreateAsync(CreateExerciseDto dto)
    {
        var exercise = new Exercise
        {
            Name = dto.Name,
            Description = dto.Description,
            MediaUrl = dto.MediaUrl,
            OwnerId = dto.OwnerId,
            IsSystem = dto.IsSystem
        };

        if (dto.ConceptIds != null && dto.ConceptIds.Any())
        {
            var concepts = await _db.SportConcepts
                .Where(c => dto.ConceptIds.Contains(c.Id))
                .ToListAsync();
            exercise.Concepts = concepts;
        }

        _db.Exercises.Add(exercise);
        await _db.SaveChangesAsync();
        return exercise;
    }

    public async Task<Exercise> UpdateAsync(int id, CreateExerciseDto dto)
    {
        var exercise = await _db.Exercises
            .Include(e => e.Concepts)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exercise == null)
            throw new ArgumentException("Exercise not found");

        exercise.Name = dto.Name;
        exercise.Description = dto.Description;
        exercise.MediaUrl = dto.MediaUrl;

        if (dto.ConceptIds != null)
        {
            exercise.Concepts.Clear();
            var concepts = await _db.SportConcepts
                .Where(c => dto.ConceptIds.Contains(c.Id))
                .ToListAsync();
            exercise.Concepts = concepts;
        }

        await _db.SaveChangesAsync();
        return exercise;
    }

    public async Task DeleteAsync(int id)
    {
        var exercise = await _db.Exercises.FindAsync(id);
        if (exercise != null)
        {
            exercise.IsActive = false;
            await _db.SaveChangesAsync();
        }
    }
}
