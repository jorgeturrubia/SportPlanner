using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SportsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public SportsController(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    // GET /api/sports
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var sports = await _db.Sports
            .OrderBy(s => s.Name)
            .ToListAsync();
        var dtos = _mapper.Map<List<SportDto>>(sports);
        return Ok(dtos);
    }

    // GET /api/sports/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var sport = await _db.Sports.FindAsync(id);
        if (sport == null)
            return NotFound();
        var dto = _mapper.Map<SportDto>(sport);
        return Ok(dto);
    }

    // GET /api/sports/{id}/itineraries
    [HttpGet("{id}/itineraries")]
    public async Task<IActionResult> GetItineraries(int id)
    {
        var itineraries = await _db.MethodologicalItineraries
            .Include(mi => mi.TeamCategory)
            .Where(mi => mi.TeamCategoryId == null || mi.TeamCategory!.SportId == id)
            .OrderBy(mi => mi.Level)
            .Select(mi => new MethodologicalItinerarySimpleDto
            {
                Id = mi.Id,
                Name = mi.Name,
                Code = mi.Code,
                Level = mi.Level
            })
            .ToListAsync();

        return Ok(itineraries);
    }

    // POST /api/sports
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSportDto dto)
    {
        // Check if sport with same name already exists
        var exists = await _db.Sports.AnyAsync(s => s.Name.ToLower() == dto.Name.ToLower());
        if (exists)
            return Conflict("A sport with this name already exists.");

        var sport = _mapper.Map<Sport>(dto);
        sport.Slug = GenerateSlug(dto.Name);
        sport.CreatedAt = DateTime.UtcNow;
        sport.UpdatedAt = DateTime.UtcNow;

        _db.Sports.Add(sport);
        await _db.SaveChangesAsync();

        var result = _mapper.Map<SportDto>(sport);
        return CreatedAtAction(nameof(Get), new { id = sport.Id }, result);
    }

    // PUT /api/sports/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSportDto dto)
    {
        var sport = await _db.Sports.FindAsync(id);
        if (sport == null)
            return NotFound();

        // Check if another sport with same name exists
        var exists = await _db.Sports.AnyAsync(s => s.Name.ToLower() == dto.Name.ToLower() && s.Id != id);
        if (exists)
            return Conflict("Another sport with this name already exists.");

        sport.Name = dto.Name;
        sport.Description = dto.Description;
        sport.IsActive = dto.IsActive;
        sport.Slug = GenerateSlug(dto.Name);
        sport.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var result = _mapper.Map<SportDto>(sport);
        return Ok(result);
    }

    // DELETE /api/sports/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sport = await _db.Sports.FindAsync(id);
        if (sport == null)
            return NotFound();

        // Check if sport is used in any subscriptions
        var hasSubscriptions = await _db.Subscriptions.AnyAsync(s => s.SportId == id);
        if (hasSubscriptions)
            return BadRequest("Cannot delete sport that is used in subscriptions. Consider deactivating it instead.");

        _db.Sports.Remove(sport);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private string GenerateSlug(string name)
    {
        return name.ToLower()
            .Replace(" ", "-")
            .Replace("á", "a")
            .Replace("é", "e")
            .Replace("í", "i")
            .Replace("ó", "o")
            .Replace("ú", "u")
            .Replace("ñ", "n");
    }
}
