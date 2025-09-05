using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public interface IObjectiveService
{
    Task<IEnumerable<ObjectiveDto>> GetUserObjectivesAsync(Guid userId);
    Task<IEnumerable<ObjectiveDto>> GetFilteredObjectivesAsync(Guid userId, ObjectiveFilterDto filter);
    Task<ObjectiveDto?> GetObjectiveAsync(string objectiveId, Guid userId);
    Task<ObjectiveDto> CreateObjectiveAsync(CreateObjectiveRequest request, Guid userId);
    Task<ObjectiveDto> UpdateObjectiveAsync(string objectiveId, UpdateObjectiveRequest request, Guid userId);
    Task DeleteObjectiveAsync(string objectiveId, Guid userId);
    Task<bool> UserCanAccessObjectiveAsync(string objectiveId, Guid userId);
}