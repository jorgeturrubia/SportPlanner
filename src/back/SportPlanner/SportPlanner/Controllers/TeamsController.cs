using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly SportPlannerDbContext _context;

    public TeamsController(SportPlannerDbContext context)
    {
        _context = context;
    }

    // GET: api/teams
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Team>>> GetTeams()
    {
        return await _context.Teams
            .Include(t => t.Organization)
            .Include(t => t.CreatedBy)
            .Where(t => t.IsActive && t.IsVisible)
            .ToListAsync();
    }

    // GET: api/teams/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Team>> GetTeam(Guid id)
    {
        var team = await _context.Teams
            .Include(t => t.Organization)
            .Include(t => t.CreatedBy)
            .Include(t => t.UserTeams)
            .ThenInclude(ut => ut.User)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (team == null)
        {
            return NotFound();
        }

        return team;
    }

    // POST: api/teams
    [HttpPost]
    public async Task<ActionResult<Team>> CreateTeam(CreateTeamRequest request)
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
            CreatedByUserId = request.CreatedByUserId, // En producción esto vendría del token JWT
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTeam), new { id = team.Id }, team);
    }

    // PUT: api/teams/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeam(Guid id, UpdateTeamRequest request)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null)
        {
            return NotFound();
        }

        team.Name = request.Name;
        team.Sport = request.Sport;
        team.Category = request.Category;
        team.Gender = request.Gender;
        team.Level = request.Level;
        team.Description = request.Description;
        team.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TeamExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/teams/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(Guid id)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null)
        {
            return NotFound();
        }

        team.IsActive = false;
        team.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TeamExists(Guid id)
    {
        return _context.Teams.Any(e => e.Id == id);
    }
}

// DTOs para las requests
public class CreateTeamRequest
{
    public string Name { get; set; } = string.Empty;
    public string Sport { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public TeamLevel Level { get; set; }
    public string Description { get; set; } = string.Empty;
    public Guid? OrganizationId { get; set; }
    public Guid CreatedByUserId { get; set; }
}

public class UpdateTeamRequest
{
    public string Name { get; set; } = string.Empty;
    public string Sport { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public TeamLevel Level { get; set; }
    public string Description { get; set; } = string.Empty;
}