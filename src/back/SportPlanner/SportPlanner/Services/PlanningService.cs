using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public class PlanningService : IPlanningService
{
    private readonly SportPlannerDbContext _context;
    private readonly ILogger<PlanningService> _logger;

    public PlanningService(SportPlannerDbContext context, ILogger<PlanningService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<PlanningDto>> GetUserPlanningsAsync(Guid userId)
    {
        try
        {
            var plannings = await _context.Plannings
                .Include(p => p.CreatedBy)
                .Include(p => p.Team)
                .Where(p => p.IsActive && (p.CreatedByUserId == userId || p.IsPublic))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return plannings.Select(MapToPlanningDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting plannings for user {UserId}", userId);
            throw;
        }
    }

    public async Task<IEnumerable<PlanningDto>> GetFilteredPlanningsAsync(Guid userId, PlanningFilterDto filter)
    {
        try
        {
            var query = _context.Plannings
                .Include(p => p.CreatedBy)
                .Include(p => p.Team)
                .Where(p => p.IsActive && (p.CreatedByUserId == userId || p.IsPublic));

            // Apply filters
            if (filter.Type.HasValue)
                query = query.Where(p => p.Type == filter.Type.Value);

            if (filter.Status.HasValue)
                query = query.Where(p => p.Status == filter.Status.Value);

            if (filter.TeamId.HasValue)
                query = query.Where(p => p.TeamId == filter.TeamId.Value);

            if (filter.StartDateFrom.HasValue)
                query = query.Where(p => p.StartDate >= filter.StartDateFrom.Value);

            if (filter.StartDateTo.HasValue)
                query = query.Where(p => p.StartDate <= filter.StartDateTo.Value);

            if (filter.EndDateFrom.HasValue)
                query = query.Where(p => p.EndDate >= filter.EndDateFrom.Value);

            if (filter.EndDateTo.HasValue)
                query = query.Where(p => p.EndDate <= filter.EndDateTo.Value);

            if (filter.IsPublic.HasValue)
                query = query.Where(p => p.IsPublic == filter.IsPublic.Value);

            if (filter.IsActive.HasValue)
                query = query.Where(p => p.IsActive == filter.IsActive.Value);

            if (filter.MinDuration.HasValue)
                query = query.Where(p => p.DurationMinutes >= filter.MinDuration.Value);

            if (filter.MaxDuration.HasValue)
                query = query.Where(p => p.DurationMinutes <= filter.MaxDuration.Value);

            if (filter.MinSessionsPerWeek.HasValue)
                query = query.Where(p => p.SessionsPerWeek >= filter.MinSessionsPerWeek.Value);

            if (filter.MaxSessionsPerWeek.HasValue)
                query = query.Where(p => p.SessionsPerWeek <= filter.MaxSessionsPerWeek.Value);

            if (!string.IsNullOrEmpty(filter.Tag))
                query = query.Where(p => p.Tags.Contains(filter.Tag));

            if (filter.TrainingDays != null && filter.TrainingDays.Any())
                query = query.Where(p => p.TrainingDays.Any(d => filter.TrainingDays.Contains(d)));

            if (!string.IsNullOrEmpty(filter.Search))
                query = query.Where(p => p.Name.Contains(filter.Search) || 
                                       (p.Description != null && p.Description.Contains(filter.Search)));

            var plannings = await query
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return plannings.Select(MapToPlanningDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting filtered plannings for user {UserId}", userId);
            throw;
        }
    }

    public async Task<PlanningDto?> GetPlanningAsync(string planningId, Guid userId)
    {
        try
        {
            if (!int.TryParse(planningId, out int id))
            {
                _logger.LogWarning("Invalid planning ID format: {PlanningId}", planningId);
                return null;
            }

            var planning = await _context.Plannings
                .Include(p => p.CreatedBy)
                .Include(p => p.Team)
                .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

            if (planning == null)
            {
                _logger.LogWarning("Planning not found: {PlanningId}", planningId);
                return null;
            }

            // Check access permissions
            if (!await UserCanAccessPlanningAsync(planningId, userId))
            {
                _logger.LogWarning("User {UserId} does not have access to planning {PlanningId}", userId, planningId);
                return null;
            }

            return MapToPlanningDto(planning);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting planning {PlanningId} for user {UserId}", planningId, userId);
            throw;
        }
    }

    public async Task<PlanningDto> CreatePlanningAsync(CreatePlanningRequest request, Guid userId)
    {
        try
        {
            // Validate team access if teamId is provided
            if (request.TeamId.HasValue)
            {
                var teamExists = await _context.Teams
                    .AnyAsync(t => t.Id == request.TeamId.Value && 
                                  (t.CreatedByUserId == userId || 
                                   t.UserTeams.Any(ut => ut.UserId == userId)));

                if (!teamExists)
                {
                    throw new UnauthorizedAccessException("User does not have access to the specified team");
                }
            }

            // Calculate total sessions based on date range and training days
            var totalSessions = await CalculateTotalSessionsAsync(
                request.StartDate, request.EndDate, request.TrainingDays);

            var planning = new Planning
            {
                Name = request.Name,
                Description = request.Description,
                Type = request.Type,
                Status = request.Status,
                TeamId = request.TeamId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TrainingDays = request.TrainingDays,
                StartTime = request.StartTime,
                DurationMinutes = request.DurationMinutes,
                SessionsPerWeek = request.SessionsPerWeek,
                TotalSessions = totalSessions,
                CompletedSessions = 0,
                IsActive = true,
                IsPublic = request.IsPublic,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Tags = request.Tags
            };

            _context.Plannings.Add(planning);
            await _context.SaveChangesAsync();

            return await GetPlanningAsync(planning.Id.ToString(), userId) 
                ?? throw new InvalidOperationException("Failed to retrieve created planning");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating planning for user {UserId}", userId);
            throw;
        }
    }

    public async Task<PlanningDto> UpdatePlanningAsync(string planningId, UpdatePlanningRequest request, Guid userId)
    {
        try
        {
            if (!int.TryParse(planningId, out int id))
            {
                throw new ArgumentException("Invalid planning ID format", nameof(planningId));
            }

            var planning = await _context.Plannings
                .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

            if (planning == null)
            {
                throw new KeyNotFoundException($"Planning with ID {planningId} not found");
            }

            // Check if user can update this planning
            if (planning.CreatedByUserId != userId)
            {
                throw new UnauthorizedAccessException("You do not have permission to update this planning");
            }

            // Validate team access if teamId is changed
            if (request.TeamId.HasValue && request.TeamId != planning.TeamId)
            {
                var teamExists = await _context.Teams
                    .AnyAsync(t => t.Id == request.TeamId.Value && 
                                  (t.CreatedByUserId == userId || 
                                   t.UserTeams.Any(ut => ut.UserId == userId)));

                if (!teamExists)
                {
                    throw new UnauthorizedAccessException("User does not have access to the specified team");
                }
            }

            // Recalculate total sessions if dates or training days changed
            if (request.StartDate != planning.StartDate || 
                request.EndDate != planning.EndDate || 
                !request.TrainingDays.SequenceEqual(planning.TrainingDays))
            {
                planning.TotalSessions = await CalculateTotalSessionsAsync(
                    request.StartDate, request.EndDate, request.TrainingDays);
            }

            // Update properties
            planning.Name = request.Name;
            planning.Description = request.Description;
            planning.Type = request.Type;
            planning.Status = request.Status;
            planning.TeamId = request.TeamId;
            planning.StartDate = request.StartDate;
            planning.EndDate = request.EndDate;
            planning.TrainingDays = request.TrainingDays;
            planning.StartTime = request.StartTime;
            planning.DurationMinutes = request.DurationMinutes;
            planning.SessionsPerWeek = request.SessionsPerWeek;
            planning.IsPublic = request.IsPublic;
            planning.Tags = request.Tags;
            planning.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetPlanningAsync(planningId, userId) 
                ?? throw new InvalidOperationException("Failed to retrieve updated planning");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating planning {PlanningId} for user {UserId}", planningId, userId);
            throw;
        }
    }

    public async Task DeletePlanningAsync(string planningId, Guid userId)
    {
        try
        {
            if (!int.TryParse(planningId, out int id))
            {
                throw new ArgumentException("Invalid planning ID format", nameof(planningId));
            }

            var planning = await _context.Plannings
                .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

            if (planning == null)
            {
                throw new KeyNotFoundException($"Planning with ID {planningId} not found");
            }

            // Check if user can delete this planning
            if (planning.CreatedByUserId != userId)
            {
                throw new UnauthorizedAccessException("You do not have permission to delete this planning");
            }

            // Soft delete
            planning.IsActive = false;
            planning.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting planning {PlanningId} for user {UserId}", planningId, userId);
            throw;
        }
    }

    public async Task<bool> UserCanAccessPlanningAsync(string planningId, Guid userId)
    {
        try
        {
            if (!int.TryParse(planningId, out int id))
            {
                return false;
            }

            var planning = await _context.Plannings
                .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

            if (planning == null)
            {
                return false;
            }

            // User can access if they created it or if it's public
            return planning.CreatedByUserId == userId || planning.IsPublic;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking user access to planning {PlanningId} for user {UserId}", planningId, userId);
            return false;
        }
    }

    public Task<int> CalculateTotalSessionsAsync(DateTime startDate, DateTime endDate, List<Models.DayOfWeek> trainingDays)
    {
        if (!trainingDays.Any())
            return Task.FromResult(0);

        var totalSessions = 0;
        var currentDate = startDate.Date;
        var endDateOnly = endDate.Date;

        while (currentDate <= endDateOnly)
        {
            if (trainingDays.Contains((Models.DayOfWeek)currentDate.DayOfWeek))
            {
                totalSessions++;
            }
            currentDate = currentDate.AddDays(1);
        }

        return Task.FromResult(totalSessions);
    }

    public async Task<PlanningDto> UpdatePlanningStatusAsync(string planningId, PlanningStatus status, Guid userId)
    {
        try
        {
            if (!int.TryParse(planningId, out int id))
            {
                throw new ArgumentException("Invalid planning ID format", nameof(planningId));
            }

            var planning = await _context.Plannings
                .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

            if (planning == null)
            {
                throw new KeyNotFoundException($"Planning with ID {planningId} not found");
            }

            // Check if user can update this planning
            if (planning.CreatedByUserId != userId)
            {
                throw new UnauthorizedAccessException("You do not have permission to update this planning");
            }

            planning.Status = status;
            planning.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetPlanningAsync(planningId, userId) 
                ?? throw new InvalidOperationException("Failed to retrieve updated planning");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating planning status {PlanningId} for user {UserId}", planningId, userId);
            throw;
        }
    }

    private static PlanningDto MapToPlanningDto(Planning planning)
    {
        return new PlanningDto
        {
            Id = planning.Id.ToString(),
            Name = planning.Name,
            Description = planning.Description,
            Type = planning.Type,
            Status = planning.Status,
            TeamId = planning.TeamId?.ToString(),
            TeamName = planning.Team?.Name,
            StartDate = planning.StartDate,
            EndDate = planning.EndDate,
            TrainingDays = planning.TrainingDays,
            StartTime = planning.StartTime.ToString(@"hh\:mm"),
            DurationMinutes = planning.DurationMinutes,
            SessionsPerWeek = planning.SessionsPerWeek,
            TotalSessions = planning.TotalSessions,
            CompletedSessions = planning.CompletedSessions,
            IsActive = planning.IsActive,
            IsPublic = planning.IsPublic,
            CreatedBy = $"{planning.CreatedBy?.FirstName} {planning.CreatedBy?.LastName}".Trim(),
            CreatedAt = planning.CreatedAt,
            UpdatedAt = planning.UpdatedAt,
            Tags = planning.Tags
        };
    }
}