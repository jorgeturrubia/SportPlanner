using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using System.Text.Json;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlanningsController : ControllerBase
{
    private readonly SportPlannerDbContext _context;

    public PlanningsController(SportPlannerDbContext context)
    {
        _context = context;
    }

    // GET: api/plannings
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Planning>>> GetPlannings()
    {
        return await _context.Plannings
            .Include(p => p.Itinerary)
            .Include(p => p.CreatedBy)
            .Include(p => p.PlanningTeams)
            .ThenInclude(pt => pt.Team)
            .Where(p => p.IsActive && p.IsVisible)
            .ToListAsync();
    }

    // GET: api/plannings/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Planning>> GetPlanning(Guid id)
    {
        var planning = await _context.Plannings
            .Include(p => p.Itinerary)
            .Include(p => p.CreatedBy)
            .Include(p => p.PlanningTeams)
            .ThenInclude(pt => pt.Team)
            .Include(p => p.PlanningConcepts)
            .ThenInclude(pc => pc.Concept)
            .Include(p => p.TrainingSessions)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (planning == null)
        {
            return NotFound();
        }

        return planning;
    }

    // POST: api/plannings
    [HttpPost]
    public async Task<ActionResult<Planning>> CreatePlanning(CreatePlanningRequest request)
    {
        var planning = new Planning
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            TrainingDays = JsonSerializer.Serialize(request.TrainingDays),
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            IsFullCourt = request.IsFullCourt,
            ItineraryId = request.ItineraryId,
            CreatedByUserId = request.CreatedByUserId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Plannings.Add(planning);

        // Si se especificaron equipos, crear las relaciones
        if (request.TeamIds?.Any() == true)
        {
            foreach (var teamId in request.TeamIds)
            {
                _context.PlanningTeams.Add(new PlanningTeam
                {
                    PlanningId = planning.Id,
                    TeamId = teamId,
                    AssignedAt = DateTime.UtcNow
                });
            }
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPlanning), new { id = planning.Id }, planning);
    }

    // POST: api/plannings/5/generate-sessions
    [HttpPost("{id}/generate-sessions")]
    public async Task<ActionResult> GenerateTrainingSessions(Guid id)
    {
        var planning = await _context.Plannings
            .Include(p => p.TrainingSessions)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (planning == null)
        {
            return NotFound();
        }

        // Deserializar los días de entrenamiento
        var trainingDays = JsonSerializer.Deserialize<int[]>(planning.TrainingDays) ?? Array.Empty<int>();

        // Generar sesiones automáticamente
        var sessions = new List<TrainingSession>();
        var currentDate = planning.StartDate;

        while (currentDate <= planning.EndDate)
        {
            // Verificar si el día actual está en los días de entrenamiento
            var dayOfWeek = (int)currentDate.DayOfWeek;
            if (dayOfWeek == 0) dayOfWeek = 7; // Convertir domingo de 0 a 7

            if (trainingDays.Contains(dayOfWeek))
            {
                var session = new TrainingSession
                {
                    Id = Guid.NewGuid(),
                    Name = $"Entrenamiento {currentDate:dd/MM/yyyy}",
                    Description = $"Sesión de entrenamiento generada automáticamente",
                    ScheduledDate = currentDate,
                    StartTime = planning.StartTime,
                    EndTime = planning.EndTime,
                    Location = "",
                    Status = SessionStatus.Planned,
                    PlanningId = planning.Id,
                    CreatedByUserId = planning.CreatedByUserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                sessions.Add(session);
            }

            currentDate = currentDate.AddDays(1);
        }

        _context.TrainingSessions.AddRange(sessions);
        await _context.SaveChangesAsync();

        return Ok(new { Message = $"Se generaron {sessions.Count} sesiones de entrenamiento", SessionsCount = sessions.Count });
    }

    // GET: api/plannings/marketplace
    [HttpGet("marketplace")]
    public async Task<ActionResult<IEnumerable<Planning>>> GetMarketplacePlannings(
        [FromQuery] string? sport = null,
        [FromQuery] string? category = null,
        [FromQuery] TeamLevel? level = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Plannings
            .Include(p => p.CreatedBy)
            .Include(p => p.Itinerary)
            .Where(p => p.IsPublic && p.IsActive);

        if (!string.IsNullOrEmpty(sport))
        {
            // Filtrar por deporte a través de los equipos asociados
            query = query.Where(p => p.PlanningTeams.Any(pt => pt.Team.Sport == sport));
        }

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.PlanningTeams.Any(pt => pt.Team.Category == category));
        }

        if (level.HasValue)
        {
            query = query.Where(p => p.PlanningTeams.Any(pt => pt.Team.Level == level));
        }

        var plannings = await query
            .OrderByDescending(p => p.AverageRating)
            .ThenByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return plannings;
    }

    private bool PlanningExists(Guid id)
    {
        return _context.Plannings.Any(e => e.Id == id);
    }
}

// DTOs para las requests
public class CreatePlanningRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int[] TrainingDays { get; set; } = Array.Empty<int>(); // [1,3,5] para lunes, miércoles, viernes
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public bool IsFullCourt { get; set; } = true;
    public Guid? ItineraryId { get; set; }
    public Guid CreatedByUserId { get; set; }
    public Guid[]? TeamIds { get; set; }
}