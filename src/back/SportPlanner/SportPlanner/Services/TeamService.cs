using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Models.DTOs;
using static SportPlanner.Models.Subscription;

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
            _logger.LogInformation("Getting teams for user {UserId}", userId);

            var teams = await _context.Teams
                .Include(t => t.Sport)
                .Include(t => t.Category)
                .Include(t => t.SportGender)
                .Include(t => t.Level)
                .Include(t => t.CreatedBy)
                .Include(t => t.UserTeams)
                .Where(t => t.IsActive && t.IsVisible && t.CreatedByUserId == userId)
                .ToListAsync();

            _logger.LogInformation("Found {TeamCount} teams for user {UserId}", teams.Count, userId);

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
                .Include(t => t.Sport)
                .Include(t => t.Category)
                .Include(t => t.SportGender)
                .Include(t => t.Level)
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
            _logger.LogInformation("CreateTeamAsync: Starting team creation for user {UserId}. Request OrganizationId: {OrganizationId}, TeamName: {TeamName}", 
                userId, request.OrganizationId, request.Name);

            // Verificar si el usuario existe y tiene OrganizationId
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                _logger.LogError("CreateTeamAsync: User {UserId} not found in database", userId);
                throw new InvalidOperationException("No se pudo determinar la organización del usuario");
            }

            _logger.LogInformation("CreateTeamAsync: User found - UserId: {UserId}, UserOrganizationId: {UserOrganizationId}, Email: {Email}",
                user.Id, user.OrganizationId, user.Email);

            if (!user.OrganizationId.HasValue)
            {
                _logger.LogError("CreateTeamAsync: User {UserId} does not have an OrganizationId assigned", userId);
                throw new InvalidOperationException("No se pudo determinar la organización del usuario");
            }

            // Validate master entity IDs exist
            await ValidateMasterEntitiesAsync(request.SportId, request.CategoryId, request.SportGenderId, request.LevelId);

            // Usar el OrganizationId del usuario en lugar del request
            var team = new Team
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                SportId = request.SportId,
                CategoryId = request.CategoryId,
                SportGenderId = request.SportGenderId,
                LevelId = request.LevelId,
                Description = request.Description,
                OrganizationId = user.OrganizationId.Value, // Usar el OrganizationId del usuario
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true,
                IsVisible = true
            };

            _logger.LogInformation("CreateTeamAsync: Creating team with OrganizationId: {OrganizationId}", team.OrganizationId);

            _context.Teams.Add(team);
            await _context.SaveChangesAsync();

            _logger.LogInformation("CreateTeamAsync: Team saved to database with ID: {TeamId}", team.Id);

            // Reload the team with includes for proper DTO mapping
            var createdTeam = await _context.Teams
                .Include(t => t.Sport)
                .Include(t => t.Category)
                .Include(t => t.SportGender)
                .Include(t => t.Level)
                .Include(t => t.Organization)
                .Include(t => t.CreatedBy)
                .Include(t => t.UserTeams)
                .FirstAsync(t => t.Id == team.Id);

            _logger.LogInformation("CreateTeamAsync: Team {TeamName} created successfully by user {UserId} with OrganizationId {OrganizationId}", 
                request.Name, userId, createdTeam.OrganizationId);
            return MapToTeamDto(createdTeam);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "CreateTeamAsync: Error creating team '{TeamName}' for user {UserId}. Error: {ErrorMessage}", 
                request?.Name ?? "Unknown", userId, ex.Message);
            throw;
        }
    }

    public async Task<TeamDto> UpdateTeamAsync(Guid teamId, UpdateTeamRequest request, Guid userId)
    {
        try
        {
            var team = await _context.Teams
                .Include(t => t.Sport)
                .Include(t => t.Category)
                .Include(t => t.SportGender)
                .Include(t => t.Level)
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

            // Validate that the sport matches the user's active subscription
            await ValidateUserSubscriptionSportAsync(userId, request.SportId);

            // Validate master entity IDs exist
            await ValidateMasterEntitiesAsync(request.SportId, request.CategoryId, request.SportGenderId, request.LevelId);

            // Update team properties
            team.Name = request.Name;
            team.SportId = request.SportId;
            team.CategoryId = request.CategoryId;
            team.SportGenderId = request.SportGenderId;
            team.LevelId = request.LevelId;
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
            SportId = team.SportId,
            CategoryId = team.CategoryId,
            SportGenderId = team.SportGenderId,
            LevelId = team.LevelId,
            SportName = team.Sport?.Name ?? string.Empty,
            CategoryName = team.Category?.Name ?? string.Empty,
            SportGenderName = team.SportGender?.Name ?? string.Empty,
            LevelName = team.Level?.Name ?? string.Empty,
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

    private async Task ValidateUserSubscriptionSportAsync(Guid userId, int sportId)
    {
        try
        {
            // Get user's active subscription
            var activeSubscription = await _context.UserSubscriptions
                .FirstOrDefaultAsync(us => us.UserId == userId && us.IsActive &&
                                          us.EndDate == null || us.EndDate > DateTime.UtcNow);

            if (activeSubscription == null)
            {
                _logger.LogError("ValidateUserSubscriptionSportAsync: User {UserId} has no active subscription", userId);
                throw new InvalidOperationException("El usuario no tiene una suscripción activa");
            }

            // Map SportType enum to master sport ID
            // This mapping should match the frontend mapping
            var sportMapping = new Dictionary<SportType, int>
            {
                [SportType.Football] = 1,    // Fútbol
                [SportType.Basketball] = 2,  // Baloncesto
                [SportType.Tennis] = 10,     // Pádel (closest match)
                [SportType.Volleyball] = 3,  // Voleibol
                [SportType.Rugby] = 9,       // Rugby
                [SportType.Handball] = 4,    // Balonmano
                [SportType.Hockey] = 8,      // Hockey
                [SportType.Baseball] = 1,    // Fútbol (fallback)
                [SportType.Swimming] = 6,    // Natación
                [SportType.Athletics] = 7,   // Atletismo
                [SportType.Other] = 1        // Fútbol (fallback)
            };

            if (!sportMapping.TryGetValue(activeSubscription.Sport, out var expectedSportId))
            {
                _logger.LogError("ValidateUserSubscriptionSportAsync: Unknown sport type {SportType} for user {UserId}",
                    activeSubscription.Sport, userId);
                throw new InvalidOperationException("Tipo de deporte de suscripción no válido");
            }

            if (expectedSportId != sportId)
            {
                _logger.LogWarning("ValidateUserSubscriptionSportAsync: Sport mismatch for user {UserId}. " +
                    "Subscription sport: {SubscriptionSport} (ID: {ExpectedSportId}), " +
                    "Requested sport ID: {RequestedSportId}",
                    userId, activeSubscription.Sport, expectedSportId, sportId);
                throw new InvalidOperationException("El deporte seleccionado no coincide con tu suscripción activa");
            }

            _logger.LogInformation("ValidateUserSubscriptionSportAsync: Sport validation passed for user {UserId}, sport ID {SportId}",
                userId, sportId);
        }
        catch (Exception ex) when (ex is not InvalidOperationException)
        {
            _logger.LogError(ex, "ValidateUserSubscriptionSportAsync: Error validating subscription sport for user {UserId}", userId);
            throw new InvalidOperationException("Error al validar la suscripción del usuario");
        }
    }

    private async Task ValidateMasterEntitiesAsync(int sportId, int categoryId, int sportGenderId, int levelId)
    {
        var validationTasks = new[]
        {
            _context.Sports.AnyAsync(s => s.Id == sportId),
            _context.Categories.AnyAsync(c => c.Id == categoryId),
            _context.SportGenders.AnyAsync(sg => sg.Id == sportGenderId),
            _context.Levels.AnyAsync(l => l.Id == levelId)
        };

        var results = await Task.WhenAll(validationTasks);

        var errors = new List<string>();
        if (!results[0]) errors.Add($"Sport with ID {sportId} not found");
        if (!results[1]) errors.Add($"Category with ID {categoryId} not found");
        if (!results[2]) errors.Add($"SportGender with ID {sportGenderId} not found");
        if (!results[3]) errors.Add($"Level with ID {levelId} not found");

        if (errors.Any())
        {
            var errorMessage = string.Join("; ", errors);
            _logger.LogError("Master entity validation failed: {Errors}", errorMessage);
            throw new ArgumentException(errorMessage);
        }
    }
}