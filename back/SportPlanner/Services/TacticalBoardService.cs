using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

public class TacticalBoardService : ITacticalBoardService
{
    private readonly AppDbContext _db;

    public TacticalBoardService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<TacticalBoard>> GetAllAsync(int? exerciseId = null, string? userId = null)
    {
        var query = _db.TacticalBoards
            .Include(tb => tb.Exercise)
            .Where(tb => tb.IsActive);

        if (exerciseId.HasValue)
        {
            query = query.Where(tb => tb.ExerciseId == exerciseId);
        }

        // Filter by ownership
        if (!string.IsNullOrEmpty(userId))
        {
            query = query.Where(tb => tb.OwnerId == userId || tb.IsPublic);
        }

        return await query.OrderByDescending(tb => tb.UpdatedAt).ToListAsync();
    }

    public async Task<TacticalBoard?> GetByIdAsync(int id)
    {
        return await _db.TacticalBoards
            .Include(tb => tb.Exercise)
            .FirstOrDefaultAsync(tb => tb.Id == id);
    }

    public async Task<TacticalBoard> CreateAsync(CreateTacticalBoardDto dto)
    {
        var tacticalBoard = new TacticalBoard
        {
            Name = dto.Name,
            Description = dto.Description,
            ExerciseId = dto.ExerciseId,
            BoardData = dto.BoardData,
            Type = dto.Type,
            FrameCount = dto.FrameCount,
            FrameDuration = dto.FrameDuration,
            FieldType = dto.FieldType,
            OwnerId = dto.OwnerId,
            IsPublic = dto.IsPublic,
            Tags = dto.Tags ?? new List<string>(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.TacticalBoards.Add(tacticalBoard);
        await _db.SaveChangesAsync();
        return tacticalBoard;
    }

    public async Task<TacticalBoard> UpdateAsync(int id, UpdateTacticalBoardDto dto)
    {
        var tacticalBoard = await _db.TacticalBoards.FindAsync(id);

        if (tacticalBoard == null)
            throw new ArgumentException("Tactical board not found");

        if (dto.Name != null) tacticalBoard.Name = dto.Name;
        if (dto.Description != null) tacticalBoard.Description = dto.Description;
        if (dto.ExerciseId.HasValue) tacticalBoard.ExerciseId = dto.ExerciseId;
        if (dto.BoardData != null) tacticalBoard.BoardData = dto.BoardData;
        if (dto.Type.HasValue) tacticalBoard.Type = dto.Type.Value;
        if (dto.FrameCount.HasValue) tacticalBoard.FrameCount = dto.FrameCount;
        if (dto.FrameDuration.HasValue) tacticalBoard.FrameDuration = dto.FrameDuration;
        if (dto.ThumbnailUrl != null) tacticalBoard.ThumbnailUrl = dto.ThumbnailUrl;
        if (dto.ExportedImageUrl != null) tacticalBoard.ExportedImageUrl = dto.ExportedImageUrl;
        if (dto.ExportedGifUrl != null) tacticalBoard.ExportedGifUrl = dto.ExportedGifUrl;
        if (dto.FieldType.HasValue) tacticalBoard.FieldType = dto.FieldType.Value;
        if (dto.IsPublic.HasValue) tacticalBoard.IsPublic = dto.IsPublic.Value;
        if (dto.IsActive.HasValue) tacticalBoard.IsActive = dto.IsActive.Value;
        if (dto.Tags != null) tacticalBoard.Tags = dto.Tags;

        tacticalBoard.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return tacticalBoard;
    }

    public async Task DeleteAsync(int id)
    {
        var tacticalBoard = await _db.TacticalBoards.FindAsync(id);
        if (tacticalBoard != null)
        {
            tacticalBoard.IsActive = false;
            tacticalBoard.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }
}
