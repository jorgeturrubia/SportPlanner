using SportPlanner.Api.Dtos;
using SportPlanner.Api.Models;

namespace SportPlanner.Api.Services;

/// <summary>
/// Interface for Teams service
/// </summary>
public interface ITeamsService
{
    /// <summary>
    /// Get all teams for a user with pagination
    /// </summary>
    Task<(IEnumerable<TeamResponseDto> Teams, int TotalCount)> GetTeamsAsync(
        Guid userId, 
        int page = 1, 
        int pageSize = 10,
        string? searchTerm = null,
        Guid? sportId = null,
        TeamStatus? status = null);

    /// <summary>
    /// Get a specific team by ID for a user
    /// </summary>
    Task<TeamResponseDto?> GetTeamAsync(Guid teamId, Guid userId);

    /// <summary>
    /// Create a new team
    /// </summary>
    Task<TeamResponseDto> CreateTeamAsync(CreateTeamDto createTeamDto, Guid userId);

    /// <summary>
    /// Update an existing team
    /// </summary>
    Task<TeamResponseDto?> UpdateTeamAsync(Guid teamId, UpdateTeamDto updateTeamDto, Guid userId);

    /// <summary>
    /// Delete a team
    /// </summary>
    Task<bool> DeleteTeamAsync(Guid teamId, Guid userId);

    /// <summary>
    /// Check if user can create more teams based on subscription
    /// </summary>
    Task<bool> CanCreateTeamAsync(Guid userId);

    /// <summary>
    /// Get all available sports
    /// </summary>
    Task<IEnumerable<SportResponseDto>> GetSportsAsync();

    /// <summary>
    /// Add a member to a team
    /// </summary>
    Task<TeamMemberResponseDto> AddTeamMemberAsync(Guid teamId, AddTeamMemberDto addMemberDto, Guid requestingUserId);

    /// <summary>
    /// Update a team member
    /// </summary>
    Task<TeamMemberResponseDto?> UpdateTeamMemberAsync(Guid teamId, Guid memberId, UpdateTeamMemberDto updateMemberDto, Guid requestingUserId);

    /// <summary>
    /// Remove a member from a team
    /// </summary>
    Task<bool> RemoveTeamMemberAsync(Guid teamId, Guid memberId, Guid requestingUserId);

    /// <summary>
    /// Get team members
    /// </summary>
    Task<IEnumerable<TeamMemberResponseDto>> GetTeamMembersAsync(Guid teamId, Guid requestingUserId);
}