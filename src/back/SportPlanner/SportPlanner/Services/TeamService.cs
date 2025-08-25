using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public class TeamService : ITeamService
{
    private readonly SportPlannerDbContext _context;
    private readonly ILogger<TeamService> _logger;

    public TeamService(SportPlannerDbContext context, ILogger<TeamService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<TeamDto>> GetUserTeamsAsync(Guid userId)
    {
        try
        {
            var teams = await _context.Teams
                .Include(t => t.Organization)
                .Include(t => t.CreatedBy)
                .Include(t => t.UserTeams)
                .Where(t => t.IsActive && t.IsVisible && 
                           (t.CreatedByUserId == userId || 
                            t.UserTeams.Any(ut => ut.UserId == userId && ut.IsActive)))
                .ToListAsync();

            return teams.Select(MapToTeamDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting teams for user {UserId}", userId);
            throw;
        }
    }

    public async Task<TeamDto?> GetTeamAsync(Guid teamId, Guid userId)
    {
        try
        {
            var team = await _context.Teams
                .Include(t => t.Organization)
                .Include(t => t.CreatedBy)
                .Include(t => t.UserTeams)
                .FirstOrDefaultAsync(t => t.Id == teamId && t.IsActive &&
                                        (t.CreatedByUserId == userId || 
                                         t.UserTeams.Any(ut => ut.UserId == userId && ut.IsActive)));

            return team != null ? MapToTeamDto(team) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting team {TeamId} for user {UserId}", teamId, userId);
            throw;
        }
    }

    public async Task<TeamDto> CreateTeamAsync(CreateTeamRequest request, Guid userId)
    {
        try
        {
            var team = new Team
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Sport = request.Sport,
                Category = request.Category,
                Gender = request.Gender,
                Level = request.Level,
                Description = request.Description,
                OrganizationId = request.OrganizationId,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true,
                IsVisible = true
            };

            _context.Teams.Add(team);
            await _context.SaveChangesAsync();

            // Reload the team with includes for proper DTO mapping
            var createdTeam = await _context.Teams
                .Include(t => t.Organization)
                .Include(t => t.CreatedBy)
                .Include(t => t.UserTeams)
                .FirstAsync(t => t.Id == team.Id);

            _logger.LogInformation("Team {TeamName} created successfully by user {UserId}", request.Name, userId);
            return MapToTeamDto(createdTeam);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating team for user {UserId}", userId);
            throw;
        }
    }

    public async Task<TeamDto> UpdateTeamAsync(Guid teamId, UpdateTeamRequest request, Guid userId)
    {
        try
        {
            var team = await _context.Teams
                .Include(t => t.Organization)
                .Include(t => t.CreatedBy)
                .Include(t => t.UserTeams)
                .FirstOrDefaultAsync(t => t.Id == teamId && t.IsActive);

            if (team == null)
            {
                throw new KeyNotFoundException($"Team with ID {teamId} not found");
            }

            // Check if user has permission to update this team
            if (!await UserCanAccessTeamAsync(teamId, userId))
            {
                throw new UnauthorizedAccessException("User does not have permission to update this team");
            }

            // Update team properties
            team.Name = request.Name;
            team.Sport = request.Sport;
            team.Category = request.Category;
            team.Gender = request.Gender;
            team.Level = request.Level;
            team.Description = request.Description;
            team.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Team {TeamId} updated successfully by user {UserId}", teamId, userId);
            return MapToTeamDto(team);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating team {TeamId} for user {UserId}", teamId, userId);
            throw;
        }
    }

    public async Task DeleteTeamAsync(Guid teamId, Guid userId)
    {
        try
        {
            var team = await _context.Teams
                .FirstOrDefaultAsync(t => t.Id == teamId && t.IsActive);

            if (team == null)
            {
                throw new KeyNotFoundException($"Team with ID {teamId} not found");
            }

            // Check if user has permission to delete this team
            if (!await UserCanAccessTeamAsync(teamId, userId))
            {
                throw new UnauthorizedAccessException("User does not have permission to delete this team");
            }

            // Soft delete
            team.IsActive = false;
            team.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Team {TeamId} deleted successfully by user {UserId}", teamId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting team {TeamId} for user {UserId}", teamId, userId);
            throw;
        }
    }

    public async Task<bool> UserCanAccessTeamAsync(Guid teamId, Guid userId)
    {
        try
        {
            return await _context.Teams
                .AnyAsync(t => t.Id == teamId && t.IsActive &&
                              (t.CreatedByUserId == userId || 
                               t.UserTeams.Any(ut => ut.UserId == userId && ut.IsActive)));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking team access for team {TeamId} and user {UserId}", teamId, userId);
            return false;
        }
    }

    private static TeamDto MapToTeamDto(Team team)
    {
        return new TeamDto
        {
            Id = team.Id,
            Name = team.Name,
            Sport = team.Sport,
            Category = team.Category,
            Gender = team.Gender,
            Level = team.Level,
            Description = team.Description,
            OrganizationId = team.OrganizationId,
            CreatedBy = $"{team.CreatedBy?.FirstName} {team.CreatedBy?.LastName}".Trim(),
            CreatedAt = team.CreatedAt,
            UpdatedAt = team.UpdatedAt,
            MemberCount = team.UserTeams?.Count(ut => ut.IsActive) ?? 0,
            IsActive = team.IsActive,
            IsVisible = team.IsVisible
        };
    }
}