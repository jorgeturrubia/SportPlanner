using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SeasonsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public SeasonsController(AppDbContext context, IMapper mapper, ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SeasonDto>>> GetSeasons([FromQuery] int? organizationId)
    {
        var userId = _currentUserService.UserId;
        var query = _context.Seasons.AsQueryable();

        // Filter by OwnerId (Current User) OR System Seasons (if applicable, currently assuming user specific)
        // Adjusting logic to show User's seasons. If no seasons found, maybe show system ones? 
        // For now: strictly user's seasons as per request.
         query = query.Where(s => s.OwnerId == userId);

        if (organizationId.HasValue)
        {
            query = query.Where(s => s.OrganizationId == organizationId);
        }

        // Order by StartDate descending (newest first)
        query = query.OrderByDescending(s => s.StartDate);

        var seasons = await query.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<SeasonDto>>(seasons));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SeasonDto>> GetSeason(int id)
    {
        var userId = _currentUserService.UserId;
        var season = await _context.Seasons.FindAsync(id);

        if (season == null)
        {
            return NotFound();
        }

        // Check ownership
        if (season.OwnerId != userId && !season.IsSystem)
        {
             return Forbid();
        }

        return Ok(_mapper.Map<SeasonDto>(season));
    }

    [HttpPost]
    public async Task<ActionResult<SeasonDto>> CreateSeason(CreateSeasonDto createSeasonDto)
    {
        var userId = _currentUserService.UserId;
        var season = _mapper.Map<Season>(createSeasonDto);
        season.IsActive = true;
        season.OwnerId = userId;
        season.IsSystem = false; 

        _context.Seasons.Add(season);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetSeason", new { id = season.Id }, _mapper.Map<SeasonDto>(season));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSeason(int id, UpdateSeasonDto updateSeasonDto)
    {
        var userId = _currentUserService.UserId;
        var season = await _context.Seasons.FindAsync(id);
        if (season == null)
        {
            return NotFound();
        }

        if (season.OwnerId != userId)
        {
            return Forbid();
        }

        _mapper.Map(updateSeasonDto, season);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!SeasonExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSeason(int id)
    {
        var userId = _currentUserService.UserId;
        var season = await _context.Seasons.FindAsync(id);
        if (season == null)
        {
            return NotFound();
        }

        if (season.OwnerId != userId)
        {
            return Forbid();
        }

        _context.Seasons.Remove(season);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool SeasonExists(int id)
    {
        return _context.Seasons.Any(e => e.Id == id);
    }
}
