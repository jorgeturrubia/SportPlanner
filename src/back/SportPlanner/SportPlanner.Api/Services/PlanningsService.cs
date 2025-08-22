using Microsoft.EntityFrameworkCore;
using SportPlanner.Api.Data;
using SportPlanner.Api.Dtos;
using SportPlanner.Api.Models;
using SportPlanner.Api.Exceptions;
using System.Text.Json;

namespace SportPlanner.Api.Services;

/// <summary>
/// Service for managing training plannings
/// </summary>
public class PlanningsService : IPlanningsService
{
    private readonly SportPlannerDbContext _context;
    private readonly ILogger<PlanningsService> _logger;

    public PlanningsService(SportPlannerDbContext context, ILogger<PlanningsService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PlanningsListResponseDto> GetPlanningsAsync(PlanningFilterDto filters)
    {
        try
        {
            var query = _context.Plannings
                .Include(p => p.Team)
                .Include(p => p.Sessions)
                .AsQueryable();

            // Apply filters
            if (filters.Type.HasValue)
                query = query.Where(p => p.Type == filters.Type.Value);

            if (filters.Status.HasValue)
                query = query.Where(p => p.Status == filters.Status.Value);

            if (!string.IsNullOrEmpty(filters.Sport))
                query = query.Where(p => p.Sport.ToLower().Contains(filters.Sport.ToLower()));

            if (filters.IsTemplate.HasValue)
                query = query.Where(p => p.IsTemplate == filters.IsTemplate.Value);

            if (filters.TeamId.HasValue)
                query = query.Where(p => p.TeamId == filters.TeamId.Value);

            if (filters.StartDate.HasValue)
                query = query.Where(p => p.StartDate >= filters.StartDate.Value);

            if (filters.EndDate.HasValue)
                query = query.Where(p => p.EndDate <= filters.EndDate.Value);

            if (!string.IsNullOrEmpty(filters.Search))
            {
                var searchLower = filters.Search.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(searchLower) || 
                                       p.Description.ToLower().Contains(searchLower));
            }

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination
            var page = filters.Page ?? 1;
            var limit = Math.Min(filters.Limit ?? 10, 100);
            var skip = (page - 1) * limit;

            var plannings = await query
                .OrderByDescending(p => p.UpdatedAt)
                .Skip(skip)
                .Take(limit)
                .ToListAsync();

            var planningDtos = plannings.Select(MapToResponseDto).ToList();

            return new PlanningsListResponseDto
            {
                Plannings = planningDtos,
                TotalCount = totalCount,
                Page = page,
                Limit = limit
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving plannings with filters");
            throw new BusinessException("Error retrieving plannings");
        }
    }

    public async Task<PlanningResponseDto?> GetPlanningByIdAsync(Guid id)
    {
        try
        {
            var planning = await _context.Plannings
                .Include(p => p.Team)
                .Include(p => p.Sessions)
                .FirstOrDefaultAsync(p => p.Id == id);

            return planning != null ? MapToResponseDto(planning) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving planning {PlanningId}", id);
            throw new BusinessException($"Error retrieving planning {id}");
        }
    }

    public async Task<PlanningResponseDto> CreatePlanningAsync(CreatePlanningDto createDto, Guid userId)
    {
        try
        {
            // Verify team exists and user has access
            var team = await _context.Teams
                .FirstOrDefaultAsync(t => t.Id == createDto.TeamId);

            if (team == null)
                throw new NotFoundException($"Team with ID {createDto.TeamId} not found");

            // Check if user has permission to create planning for this team
            var teamMember = await _context.TeamMembers
                .FirstOrDefaultAsync(tm => tm.TeamId == createDto.TeamId && tm.UserId == userId);

            if (teamMember == null)
                throw new BusinessException("You don't have permission to create plannings for this team");

            var planning = new Planning
            {
                Name = createDto.Name,
                Description = createDto.Description,
                Type = createDto.Type,
                TeamId = createDto.TeamId,
                Sport = createDto.Sport,
                StartDate = createDto.StartDate,
                EndDate = createDto.EndDate,
                Objectives = JsonSerializer.Serialize(createDto.Objectives),
                Tags = JsonSerializer.Serialize(createDto.Tags),
                IsTemplate = createDto.IsTemplate,
                TemplateName = createDto.TemplateName,
                CreatedByUserId = userId,
                Status = PlanningStatus.Draft,
                TotalObjectives = createDto.Objectives.Count
            };

            _context.Plannings.Add(planning);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created new planning {PlanningId} by user {UserId}", planning.Id, userId);

            // Reload with includes
            planning = await _context.Plannings
                .Include(p => p.Team)
                .Include(p => p.Sessions)
                .FirstAsync(p => p.Id == planning.Id);

            return MapToResponseDto(planning);
        }
        catch (NotFoundException)
        {
            throw;
        }
        catch (BusinessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating planning for user {UserId}", userId);
            throw new BusinessException("Error creating planning");
        }
    }

    public async Task<PlanningResponseDto?> UpdatePlanningAsync(Guid id, UpdatePlanningDto updateDto, Guid userId)
    {
        try
        {
            var planning = await _context.Plannings
                .Include(p => p.Team)
                .Include(p => p.Sessions)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (planning == null)
                return null;

            // Check if user has permission to update
            var teamMember = await _context.TeamMembers
                .FirstOrDefaultAsync(tm => tm.TeamId == planning.TeamId && tm.UserId == userId);

            if (teamMember == null)
                throw new BusinessException("You don't have permission to update this planning");

            // Update properties if provided
            if (!string.IsNullOrEmpty(updateDto.Name))
                planning.Name = updateDto.Name;

            if (!string.IsNullOrEmpty(updateDto.Description))
                planning.Description = updateDto.Description;

            if (updateDto.Type.HasValue)
                planning.Type = updateDto.Type.Value;

            if (updateDto.Status.HasValue)
                planning.Status = updateDto.Status.Value;

            if (!string.IsNullOrEmpty(updateDto.Sport))
                planning.Sport = updateDto.Sport;

            if (updateDto.StartDate.HasValue)
                planning.StartDate = updateDto.StartDate.Value;

            if (updateDto.EndDate.HasValue)
                planning.EndDate = updateDto.EndDate.Value;

            if (updateDto.Objectives != null)
            {
                planning.Objectives = JsonSerializer.Serialize(updateDto.Objectives);
                planning.TotalObjectives = updateDto.Objectives.Count;
            }

            if (updateDto.Tags != null)
                planning.Tags = JsonSerializer.Serialize(updateDto.Tags);

            if (updateDto.IsTemplate.HasValue)
                planning.IsTemplate = updateDto.IsTemplate.Value;

            if (!string.IsNullOrEmpty(updateDto.TemplateName))
                planning.TemplateName = updateDto.TemplateName;

            planning.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            await UpdatePlanningProgressAsync(id);

            _logger.LogInformation("Updated planning {PlanningId} by user {UserId}", id, userId);

            return MapToResponseDto(planning);
        }
        catch (BusinessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating planning {PlanningId} for user {UserId}", id, userId);
            throw new BusinessException("Error updating planning");
        }
    }

    public async Task<bool> DeletePlanningAsync(Guid id, Guid userId)
    {
        try
        {
            var planning = await _context.Plannings
                .FirstOrDefaultAsync(p => p.Id == id);

            if (planning == null)
                return false;

            // Check if user has permission to delete
            var teamMember = await _context.TeamMembers
                .FirstOrDefaultAsync(tm => tm.TeamId == planning.TeamId && tm.UserId == userId);

            if (teamMember == null)
                throw new BusinessException("You don't have permission to delete this planning");

            _context.Plannings.Remove(planning);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted planning {PlanningId} by user {UserId}", id, userId);

            return true;
        }
        catch (BusinessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting planning {PlanningId} for user {UserId}", id, userId);
            throw new BusinessException("Error deleting planning");
        }
    }

    public async Task<List<PlanningResponseDto>> GetPlanningsByTeamAsync(Guid teamId)
    {
        try
        {
            var plannings = await _context.Plannings
                .Include(p => p.Team)
                .Include(p => p.Sessions)
                .Where(p => p.TeamId == teamId)
                .OrderByDescending(p => p.UpdatedAt)
                .ToListAsync();

            return plannings.Select(MapToResponseDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving plannings by team {TeamId}", teamId);
            throw new BusinessException($"Error retrieving plannings by team {teamId}");
        }
    }

    public async Task<List<PlanningResponseDto>> GetActivePlanningsByTeamAsync(Guid teamId)
    {
        try
        {
            var plannings = await _context.Plannings
                .Include(p => p.Team)
                .Include(p => p.Sessions)
                .Where(p => p.TeamId == teamId && p.Status == PlanningStatus.Active)
                .OrderByDescending(p => p.StartDate)
                .ToListAsync();

            return plannings.Select(MapToResponseDto).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active plannings by team {TeamId}", teamId);
            throw new BusinessException($"Error retrieving active plannings by team {teamId}");
        }
    }

    public async Task<PlanningResponseDto?> CreatePlanningFromTemplateAsync(Guid templateId, Guid teamId, DateTime startDate, Guid userId)
    {
        try
        {
            var template = await _context.PlanningTemplates
                .FirstOrDefaultAsync(t => t.Id == templateId);

            if (template == null)
                return null;

            // Verify team exists and user has access
            var team = await _context.Teams
                .FirstOrDefaultAsync(t => t.Id == teamId);

            if (team == null)
                throw new NotFoundException($"Team with ID {teamId} not found");

            var teamMember = await _context.TeamMembers
                .FirstOrDefaultAsync(tm => tm.TeamId == teamId && tm.UserId == userId);

            if (teamMember == null)
                throw new BusinessException("You don't have permission to create plannings for this team");

            var endDate = startDate.AddDays(template.Duration * 7); // Duration is in weeks

            var planning = new Planning
            {
                Name = template.Name,
                Description = template.Description,
                Type = template.Type,
                TeamId = teamId,
                Sport = template.Sport,
                StartDate = startDate,
                EndDate = endDate,
                Objectives = template.Objectives,
                Tags = "[]",
                IsTemplate = false,
                TemplateName = template.Name,
                CreatedByUserId = userId,
                Status = PlanningStatus.Draft,
                TotalObjectives = JsonSerializer.Deserialize<List<string>>(template.Objectives)?.Count ?? 0
            };

            _context.Plannings.Add(planning);

            // Increment template usage count
            template.UsageCount++;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Created planning {PlanningId} from template {TemplateId} by user {UserId}", planning.Id, templateId, userId);

            // Reload with includes
            planning = await _context.Plannings
                .Include(p => p.Team)
                .Include(p => p.Sessions)
                .FirstAsync(p => p.Id == planning.Id);

            return MapToResponseDto(planning);
        }
        catch (NotFoundException)
        {
            throw;
        }
        catch (BusinessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating planning from template {TemplateId} for user {UserId}", templateId, userId);
            throw new BusinessException("Error creating planning from template");
        }
    }

    public async Task<object?> GetPlanningStatsAsync(Guid id)
    {
        try
        {
            var planning = await _context.Plannings
                .Include(p => p.Sessions)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (planning == null)
                return null;

            var totalSessions = planning.Sessions.Count;
            var completedSessions = planning.Sessions.Count(s => s.IsCompleted);
            var upcomingSessions = planning.Sessions.Count(s => !s.IsCompleted && s.Date >= DateTime.UtcNow);

            // Calculate average attendance from sessions
            var sessionsWithAttendance = planning.Sessions
                .Where(s => !string.IsNullOrEmpty(s.Attendance) && s.Attendance != "[]")
                .ToList();

            decimal averageAttendance = 0;
            if (sessionsWithAttendance.Count > 0)
            {
                var totalAttendanceRecords = 0;
                var totalPresent = 0;

                foreach (var session in sessionsWithAttendance)
                {
                    try
                    {
                        var attendanceRecords = JsonSerializer.Deserialize<List<AttendanceRecordDto>>(session.Attendance);
                        if (attendanceRecords != null)
                        {
                            totalAttendanceRecords += attendanceRecords.Count;
                            totalPresent += attendanceRecords.Count(a => a.IsPresent);
                        }
                    }
                    catch
                    {
                        // Skip invalid attendance data
                    }
                }

                if (totalAttendanceRecords > 0)
                {
                    averageAttendance = (decimal)totalPresent / totalAttendanceRecords * 100;
                }
            }

            var stats = new
            {
                TotalSessions = totalSessions,
                CompletedSessions = completedSessions,
                UpcomingSessions = upcomingSessions,
                AverageAttendance = Math.Round(averageAttendance, 2),
                CompletedObjectives = planning.CompletedObjectives,
                TotalObjectives = planning.TotalObjectives,
                ProgressPercentage = Math.Round(planning.ProgressPercentage, 2)
            };

            return stats;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving planning stats {PlanningId}", id);
            throw new BusinessException($"Error retrieving planning stats {id}");
        }
    }

    public async Task<bool> UpdatePlanningProgressAsync(Guid id)
    {
        try
        {
            var planning = await _context.Plannings
                .Include(p => p.Sessions)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (planning == null)
                return false;

            // Update session counts
            planning.TotalSessions = planning.Sessions.Count;
            planning.CompletedSessions = planning.Sessions.Count(s => s.IsCompleted);

            // Calculate progress percentage
            if (planning.TotalSessions > 0)
            {
                planning.ProgressPercentage = (decimal)planning.CompletedSessions / planning.TotalSessions * 100;
            }

            // Update last session date
            var lastCompletedSession = planning.Sessions
                .Where(s => s.IsCompleted)
                .OrderByDescending(s => s.Date)
                .FirstOrDefault();

            planning.LastSessionDate = lastCompletedSession?.Date;

            // Calculate average attendance
            var sessionsWithAttendance = planning.Sessions
                .Where(s => s.IsCompleted && !string.IsNullOrEmpty(s.Attendance) && s.Attendance != "[]")
                .ToList();

            if (sessionsWithAttendance.Count > 0)
            {
                var totalAttendanceRecords = 0;
                var totalPresent = 0;

                foreach (var session in sessionsWithAttendance)
                {
                    try
                    {
                        var attendanceRecords = JsonSerializer.Deserialize<List<AttendanceRecordDto>>(session.Attendance);
                        if (attendanceRecords != null)
                        {
                            totalAttendanceRecords += attendanceRecords.Count;
                            totalPresent += attendanceRecords.Count(a => a.IsPresent);
                        }
                    }
                    catch
                    {
                        // Skip invalid attendance data
                    }
                }

                if (totalAttendanceRecords > 0)
                {
                    planning.AverageAttendance = (decimal)totalPresent / totalAttendanceRecords * 100;
                }
            }

            planning.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating planning progress {PlanningId}", id);
            return false;
        }
    }

    private static PlanningResponseDto MapToResponseDto(Planning planning)
    {
        return new PlanningResponseDto
        {
            Id = planning.Id,
            Name = planning.Name,
            Description = planning.Description,
            Type = planning.Type,
            Status = planning.Status,
            TeamId = planning.TeamId,
            TeamName = planning.Team?.Name ?? "Unknown Team",
            Sport = planning.Sport,
            StartDate = planning.StartDate,
            EndDate = planning.EndDate,
            TotalSessions = planning.TotalSessions,
            CompletedSessions = planning.CompletedSessions,
            Objectives = JsonSerializer.Deserialize<List<string>>(planning.Objectives) ?? new List<string>(),
            Tags = JsonSerializer.Deserialize<List<string>>(planning.Tags) ?? new List<string>(),
            IsTemplate = planning.IsTemplate,
            TemplateName = planning.TemplateName,
            CreatedByUserId = planning.CreatedByUserId,
            CreatedAt = planning.CreatedAt,
            UpdatedAt = planning.UpdatedAt,
            ProgressPercentage = planning.ProgressPercentage,
            CompletedObjectives = planning.CompletedObjectives,
            TotalObjectives = planning.TotalObjectives,
            AverageAttendance = planning.AverageAttendance,
            LastSessionDate = planning.LastSessionDate,
            Sessions = planning.Sessions?.Select(s => new TrainingSessionDto
            {
                Id = s.Id,
                PlanningId = s.PlanningId,
                Name = s.Name,
                Type = s.Type,
                Date = s.Date,
                StartTime = s.StartTime,
                Duration = s.Duration,
                Location = s.Location,
                Objectives = JsonSerializer.Deserialize<List<string>>(s.Objectives) ?? new List<string>(),
                Exercises = JsonSerializer.Deserialize<List<SessionExerciseDto>>(s.Exercises) ?? new List<SessionExerciseDto>(),
                Notes = s.Notes,
                Attendance = JsonSerializer.Deserialize<List<AttendanceRecordDto>>(s.Attendance) ?? new List<AttendanceRecordDto>(),
                IsCompleted = s.IsCompleted,
                CompletionNotes = s.CompletionNotes,
                Weather = s.Weather,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            }).ToList() ?? new List<TrainingSessionDto>()
        };
    }
}