using Microsoft.EntityFrameworkCore;
using SportPlanner.Api.Data;
using SportPlanner.Api.Dtos;
using SportPlanner.Api.Exceptions;
using SportPlanner.Api.Models;

namespace SportPlanner.Api.Services;

/// <summary>
/// Service for managing teams
/// </summary>
public class TeamsService : ITeamsService
{
    private readonly SportPlannerDbContext _context;

    public TeamsService(SportPlannerDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<TeamResponseDto> Teams, int TotalCount)> GetTeamsAsync(
        Guid userId, 
        int page = 1, 
        int pageSize = 10,
        string? searchTerm = null,
        Guid? sportId = null,
        TeamStatus? status = null)
    {
        var query = _context.Teams
            .Include(t => t.Sport)
            .Include(t => t.TeamMembers)
            .Where(t => t.CreatedByUserId == userId);

        // Apply filters
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(t => t.Name.Contains(searchTerm));
        }

        if (sportId.HasValue)
        {
            query = query.Where(t => t.SportId == sportId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        var totalCount = await query.CountAsync();

        var teams = await query
            .OrderBy(t => t.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TeamResponseDto
            {
                Id = t.Id,
                Name = t.Name,
                Sport = new SportResponseDto
                {
                    Id = t.Sport.Id,
                    Name = t.Sport.Name,
                    Category = t.Sport.Category,
                    DefaultMaxPlayers = t.Sport.DefaultMaxPlayers
                },
                Category = t.Category,
                Gender = t.Gender,
                Level = t.Level,
                Description = t.Description,
                MaxPlayers = t.MaxPlayers,
                Status = t.Status,
                PlayersCount = t.TeamMembers.Count(tm => tm.Role == TeamMemberRole.Player && tm.Status == TeamMemberStatus.Active),
                CoachesCount = t.TeamMembers.Count(tm => (tm.Role == TeamMemberRole.Coach || tm.Role == TeamMemberRole.AssistantCoach) && tm.Status == TeamMemberStatus.Active),
                TotalMembersCount = t.TeamMembers.Count(tm => tm.Status == TeamMemberStatus.Active),
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                Members = t.TeamMembers
                    .Where(tm => tm.Status == TeamMemberStatus.Active)
                    .Select(tm => new TeamMemberResponseDto
                    {
                        Id = tm.Id,
                        UserId = tm.UserId,
                        UserName = tm.UserName,
                        UserEmail = tm.UserEmail,
                        Role = tm.Role,
                        JerseyNumber = tm.JerseyNumber,
                        Position = tm.Position,
                        Status = tm.Status,
                        JoinedAt = tm.JoinedAt,
                        Notes = tm.Notes
                    })
                    .ToList()
            })
            .ToListAsync();

        return (teams, totalCount);
    }

    public async Task<TeamResponseDto?> GetTeamAsync(Guid teamId, Guid userId)
    {
        var team = await _context.Teams
            .Include(t => t.Sport)
            .Include(t => t.TeamMembers.Where(tm => tm.Status == TeamMemberStatus.Active))
            .FirstOrDefaultAsync(t => t.Id == teamId && t.CreatedByUserId == userId);

        if (team == null)
            return null;

        return new TeamResponseDto
        {
            Id = team.Id,
            Name = team.Name,
            Sport = new SportResponseDto
            {
                Id = team.Sport.Id,
                Name = team.Sport.Name,
                Category = team.Sport.Category,
                DefaultMaxPlayers = team.Sport.DefaultMaxPlayers
            },
            Category = team.Category,
            Gender = team.Gender,
            Level = team.Level,
            Description = team.Description,
            MaxPlayers = team.MaxPlayers,
            Status = team.Status,
            PlayersCount = team.TeamMembers.Count(tm => tm.Role == TeamMemberRole.Player),
            CoachesCount = team.TeamMembers.Count(tm => tm.Role == TeamMemberRole.Coach || tm.Role == TeamMemberRole.AssistantCoach),
            TotalMembersCount = team.TeamMembers.Count,
            CreatedAt = team.CreatedAt,
            UpdatedAt = team.UpdatedAt,
            Members = team.TeamMembers.Select(tm => new TeamMemberResponseDto
            {
                Id = tm.Id,
                UserId = tm.UserId,
                UserName = tm.UserName,
                UserEmail = tm.UserEmail,
                Role = tm.Role,
                JerseyNumber = tm.JerseyNumber,
                Position = tm.Position,
                Status = tm.Status,
                JoinedAt = tm.JoinedAt,
                Notes = tm.Notes
            }).ToList()
        };
    }

    public async Task<TeamResponseDto> CreateTeamAsync(CreateTeamDto createTeamDto, Guid userId)
    {
        // Check subscription limits
        if (!await CanCreateTeamAsync(userId))
        {
            throw new BusinessException("Has alcanzado el límite de equipos para tu suscripción");
        }

        // Verify sport exists
        var sport = await _context.Sports.FindAsync(createTeamDto.SportId);
        if (sport == null)
        {
            throw new ValidationException("El deporte seleccionado no existe");
        }

        // Check if team name already exists for this user
        var existingTeam = await _context.Teams
            .FirstOrDefaultAsync(t => t.Name == createTeamDto.Name && t.CreatedByUserId == userId);
        
        if (existingTeam != null)
        {
            throw new ValidationException("Ya tienes un equipo con ese nombre");
        }

        var team = new Team
        {
            Name = createTeamDto.Name,
            SportId = createTeamDto.SportId,
            Category = createTeamDto.Category,
            Gender = createTeamDto.Gender,
            Level = createTeamDto.Level,
            Description = createTeamDto.Description,
            MaxPlayers = createTeamDto.MaxPlayers,
            CreatedByUserId = userId,
            Sport = sport
        };

        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        return new TeamResponseDto
        {
            Id = team.Id,
            Name = team.Name,
            Sport = new SportResponseDto
            {
                Id = sport.Id,
                Name = sport.Name,
                Category = sport.Category,
                DefaultMaxPlayers = sport.DefaultMaxPlayers
            },
            Category = team.Category,
            Gender = team.Gender,
            Level = team.Level,
            Description = team.Description,
            MaxPlayers = team.MaxPlayers,
            Status = team.Status,
            PlayersCount = 0,
            CoachesCount = 0,
            TotalMembersCount = 0,
            CreatedAt = team.CreatedAt,
            UpdatedAt = team.UpdatedAt,
            Members = new List<TeamMemberResponseDto>()
        };
    }

    public async Task<TeamResponseDto?> UpdateTeamAsync(Guid teamId, UpdateTeamDto updateTeamDto, Guid userId)
    {
        var team = await _context.Teams
            .Include(t => t.Sport)
            .Include(t => t.TeamMembers.Where(tm => tm.Status == TeamMemberStatus.Active))
            .FirstOrDefaultAsync(t => t.Id == teamId && t.CreatedByUserId == userId);

        if (team == null)
            return null;

        // Check if new name conflicts with existing team
        if (!string.IsNullOrWhiteSpace(updateTeamDto.Name) && updateTeamDto.Name != team.Name)
        {
            var existingTeam = await _context.Teams
                .FirstOrDefaultAsync(t => t.Name == updateTeamDto.Name && t.CreatedByUserId == userId);
            
            if (existingTeam != null)
            {
                throw new ValidationException("Ya tienes un equipo con ese nombre");
            }
            
            team.Name = updateTeamDto.Name;
        }

        // Update other properties
        if (!string.IsNullOrWhiteSpace(updateTeamDto.Category))
            team.Category = updateTeamDto.Category;
        
        if (!string.IsNullOrWhiteSpace(updateTeamDto.Gender))
            team.Gender = updateTeamDto.Gender;
        
        if (!string.IsNullOrWhiteSpace(updateTeamDto.Level))
            team.Level = updateTeamDto.Level;
        
        if (updateTeamDto.Description != null)
            team.Description = updateTeamDto.Description;
        
        if (updateTeamDto.MaxPlayers.HasValue)
            team.MaxPlayers = updateTeamDto.MaxPlayers.Value;
        
        if (updateTeamDto.Status.HasValue)
            team.Status = updateTeamDto.Status.Value;

        team.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new TeamResponseDto
        {
            Id = team.Id,
            Name = team.Name,
            Sport = new SportResponseDto
            {
                Id = team.Sport.Id,
                Name = team.Sport.Name,
                Category = team.Sport.Category,
                DefaultMaxPlayers = team.Sport.DefaultMaxPlayers
            },
            Category = team.Category,
            Gender = team.Gender,
            Level = team.Level,
            Description = team.Description,
            MaxPlayers = team.MaxPlayers,
            Status = team.Status,
            PlayersCount = team.TeamMembers.Count(tm => tm.Role == TeamMemberRole.Player),
            CoachesCount = team.TeamMembers.Count(tm => tm.Role == TeamMemberRole.Coach || tm.Role == TeamMemberRole.AssistantCoach),
            TotalMembersCount = team.TeamMembers.Count,
            CreatedAt = team.CreatedAt,
            UpdatedAt = team.UpdatedAt,
            Members = team.TeamMembers.Select(tm => new TeamMemberResponseDto
            {
                Id = tm.Id,
                UserId = tm.UserId,
                UserName = tm.UserName,
                UserEmail = tm.UserEmail,
                Role = tm.Role,
                JerseyNumber = tm.JerseyNumber,
                Position = tm.Position,
                Status = tm.Status,
                JoinedAt = tm.JoinedAt,
                Notes = tm.Notes
            }).ToList()
        };
    }

    public async Task<bool> DeleteTeamAsync(Guid teamId, Guid userId)
    {
        var team = await _context.Teams
            .FirstOrDefaultAsync(t => t.Id == teamId && t.CreatedByUserId == userId);

        if (team == null)
            return false;

        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CanCreateTeamAsync(Guid userId)
    {
        // TODO: Implement subscription-based limits
        // For now, implement basic free tier limit (1 team)
        var userTeamCount = await _context.Teams.CountAsync(t => t.CreatedByUserId == userId);
        
        // Free tier: 1 team limit
        // TODO: Check user subscription and apply appropriate limits
        return userTeamCount < 1;
    }

    public async Task<IEnumerable<SportResponseDto>> GetSportsAsync()
    {
        return await _context.Sports
            .Where(s => s.IsActive)
            .OrderBy(s => s.Name)
            .Select(s => new SportResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Category = s.Category,
                DefaultMaxPlayers = s.DefaultMaxPlayers
            })
            .ToListAsync();
    }

    public async Task<TeamMemberResponseDto> AddTeamMemberAsync(Guid teamId, AddTeamMemberDto addMemberDto, Guid requestingUserId)
    {
        var team = await _context.Teams
            .Include(t => t.TeamMembers)
            .FirstOrDefaultAsync(t => t.Id == teamId && t.CreatedByUserId == requestingUserId);

        if (team == null)
        {
            throw new NotFoundException("Equipo no encontrado");
        }

        // Check if user is already a member
        var existingMember = team.TeamMembers.FirstOrDefault(tm => tm.UserId == addMemberDto.UserId);
        if (existingMember != null)
        {
            throw new ValidationException("El usuario ya es miembro del equipo");
        }

        // Check if jersey number is already taken
        if (!string.IsNullOrWhiteSpace(addMemberDto.JerseyNumber))
        {
            var existingJersey = team.TeamMembers.FirstOrDefault(tm => 
                tm.JerseyNumber == addMemberDto.JerseyNumber && tm.Status == TeamMemberStatus.Active);
            
            if (existingJersey != null)
            {
                throw new ValidationException("El número de camiseta ya está en uso");
            }
        }

        // Check team capacity
        var activePlayers = team.TeamMembers.Count(tm => 
            tm.Role == TeamMemberRole.Player && tm.Status == TeamMemberStatus.Active);
        
        if (addMemberDto.Role == TeamMemberRole.Player && activePlayers >= team.MaxPlayers)
        {
            throw new ValidationException("El equipo ya ha alcanzado el número máximo de jugadores");
        }

        var teamMember = new TeamMember
        {
            TeamId = teamId,
            UserId = addMemberDto.UserId,
            UserName = addMemberDto.UserName,
            UserEmail = addMemberDto.UserEmail,
            Role = addMemberDto.Role,
            JerseyNumber = addMemberDto.JerseyNumber,
            Position = addMemberDto.Position,
            Notes = addMemberDto.Notes
        };

        _context.TeamMembers.Add(teamMember);
        await _context.SaveChangesAsync();

        return new TeamMemberResponseDto
        {
            Id = teamMember.Id,
            UserId = teamMember.UserId,
            UserName = teamMember.UserName,
            UserEmail = teamMember.UserEmail,
            Role = teamMember.Role,
            JerseyNumber = teamMember.JerseyNumber,
            Position = teamMember.Position,
            Status = teamMember.Status,
            JoinedAt = teamMember.JoinedAt,
            Notes = teamMember.Notes
        };
    }

    public async Task<TeamMemberResponseDto?> UpdateTeamMemberAsync(Guid teamId, Guid memberId, UpdateTeamMemberDto updateMemberDto, Guid requestingUserId)
    {
        var team = await _context.Teams
            .Include(t => t.TeamMembers)
            .FirstOrDefaultAsync(t => t.Id == teamId && t.CreatedByUserId == requestingUserId);

        if (team == null)
        {
            throw new NotFoundException("Equipo no encontrado");
        }

        var member = team.TeamMembers.FirstOrDefault(tm => tm.Id == memberId);
        if (member == null)
        {
            return null;
        }

        // Check if new jersey number conflicts
        if (!string.IsNullOrWhiteSpace(updateMemberDto.JerseyNumber) && updateMemberDto.JerseyNumber != member.JerseyNumber)
        {
            var existingJersey = team.TeamMembers.FirstOrDefault(tm => 
                tm.JerseyNumber == updateMemberDto.JerseyNumber && 
                tm.Status == TeamMemberStatus.Active && 
                tm.Id != memberId);
            
            if (existingJersey != null)
            {
                throw new ValidationException("El número de camiseta ya está en uso");
            }
        }

        // Update properties
        if (updateMemberDto.Role.HasValue)
            member.Role = updateMemberDto.Role.Value;
        
        if (updateMemberDto.JerseyNumber != null)
            member.JerseyNumber = updateMemberDto.JerseyNumber;
        
        if (updateMemberDto.Position != null)
            member.Position = updateMemberDto.Position;
        
        if (updateMemberDto.Status.HasValue)
            member.Status = updateMemberDto.Status.Value;
        
        if (updateMemberDto.Notes != null)
            member.Notes = updateMemberDto.Notes;

        member.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new TeamMemberResponseDto
        {
            Id = member.Id,
            UserId = member.UserId,
            UserName = member.UserName,
            UserEmail = member.UserEmail,
            Role = member.Role,
            JerseyNumber = member.JerseyNumber,
            Position = member.Position,
            Status = member.Status,
            JoinedAt = member.JoinedAt,
            Notes = member.Notes
        };
    }

    public async Task<bool> RemoveTeamMemberAsync(Guid teamId, Guid memberId, Guid requestingUserId)
    {
        var team = await _context.Teams
            .Include(t => t.TeamMembers)
            .FirstOrDefaultAsync(t => t.Id == teamId && t.CreatedByUserId == requestingUserId);

        if (team == null)
        {
            return false;
        }

        var member = team.TeamMembers.FirstOrDefault(tm => tm.Id == memberId);
        if (member == null)
        {
            return false;
        }

        _context.TeamMembers.Remove(member);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<TeamMemberResponseDto>> GetTeamMembersAsync(Guid teamId, Guid requestingUserId)
    {
        var team = await _context.Teams
            .Include(t => t.TeamMembers)
            .FirstOrDefaultAsync(t => t.Id == teamId && t.CreatedByUserId == requestingUserId);

        if (team == null)
        {
            throw new NotFoundException("Equipo no encontrado");
        }

        return team.TeamMembers
            .Where(tm => tm.Status == TeamMemberStatus.Active)
            .OrderBy(tm => tm.Role)
            .ThenBy(tm => tm.UserName)
            .Select(tm => new TeamMemberResponseDto
            {
                Id = tm.Id,
                UserId = tm.UserId,
                UserName = tm.UserName,
                UserEmail = tm.UserEmail,
                Role = tm.Role,
                JerseyNumber = tm.JerseyNumber,
                Position = tm.Position,
                Status = tm.Status,
                JoinedAt = tm.JoinedAt,
                Notes = tm.Notes
            })
            .ToList();
    }
}