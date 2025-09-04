using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public interface ITeamService
{
    Task<IEnumerable<TeamDto>> GetUserTeamsAsync(Guid userId);
    Task<TeamDto?> GetTeamAsync(Guid teamId, Guid userId);
    Task<TeamDto> CreateTeamAsync(CreateTeamRequest request, Guid userId);
    Task<TeamDto> UpdateTeamAsync(Guid teamId, UpdateTeamRequest request, Guid userId);
    Task DeleteTeamAsync(Guid teamId, Guid userId);
    Task<bool> UserCanAccessTeamAsync(Guid teamId, Guid userId);
}