using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public interface IObjectiveService
{
    Task<IEnumerable<ObjectiveDto>> GetUserObjectivesAsync(Guid userId);
    Task<IEnumerable<ObjectiveDto>> GetFilteredObjectivesAsync(Guid userId, ObjectiveFilterDto filter);
    Task<ObjectiveDto?> GetObjectiveAsync(int objectiveId, Guid userId);
    Task<ObjectiveDto> CreateObjectiveAsync(CreateObjectiveRequest request, Guid userId);
    Task<ObjectiveDto> UpdateObjectiveAsync(int objectiveId, UpdateObjectiveRequest request, Guid userId);
    Task DeleteObjectiveAsync(int objectiveId, Guid userId);
    Task<bool> UserCanAccessObjectiveAsync(int objectiveId, Guid userId);
}