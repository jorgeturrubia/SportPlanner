using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Services;

public interface ITacticalBoardService
{
    Task<List<TacticalBoard>> GetAllAsync(int? exerciseId = null, string? userId = null);
    Task<TacticalBoard?> GetByIdAsync(int id);
    Task<TacticalBoard> CreateAsync(CreateTacticalBoardDto dto);
    Task<TacticalBoard> UpdateAsync(int id, UpdateTacticalBoardDto dto);
    Task DeleteAsync(int id);
}
