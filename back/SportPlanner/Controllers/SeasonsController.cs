using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SeasonsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public SeasonsController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SeasonDto>>> GetSeasons([FromQuery] int? organizationId)
    {
        var query = _context.Seasons.AsQueryable();

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
        var season = await _context.Seasons.FindAsync(id);

        if (season == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<SeasonDto>(season));
    }

    [HttpPost]
    public async Task<ActionResult<SeasonDto>> CreateSeason(CreateSeasonDto createSeasonDto)
    {
        var season = _mapper.Map<Season>(createSeasonDto);
        season.IsActive = true;

        _context.Seasons.Add(season);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetSeason", new { id = season.Id }, _mapper.Map<SeasonDto>(season));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSeason(int id, UpdateSeasonDto updateSeasonDto)
    {
        var season = await _context.Seasons.FindAsync(id);
        if (season == null)
        {
            return NotFound();
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
        var season = await _context.Seasons.FindAsync(id);
        if (season == null)
        {
            return NotFound();
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
