using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SportConceptsController : ControllerBase
{
    private readonly ISportConceptService _service;
    private readonly IMapper _mapper;
    private readonly SportPlanner.Data.AppDbContext _db;

    public SportConceptsController(ISportConceptService service, IMapper mapper, SportPlanner.Data.AppDbContext db)
    {
        _service = service;
        _mapper = mapper;
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSportConceptDto dto)
    {
        // Auto-assign SportId based on User's active subscription
        var userId = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (!string.IsNullOrEmpty(userId))
        {
            var activeSportId = await _db.Subscriptions
                    .Where(s => s.UserSupabaseId == userId && s.IsActive)
                    .Select(s => (int?)s.SportId)
                    .FirstOrDefaultAsync();

            if (activeSportId.HasValue)
            {
                dto.SportId = activeSportId.Value;
            }
        }
        
        if (!dto.SportId.HasValue)
        {
            return BadRequest("Cannot create a concept without a valid SportId. Please verify your subscription or provide a SportId.");
        }
        
        var concept = await _service.CreateAsync(dto);
        var result = _mapper.Map<SportConceptDto>(concept);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet("by-sport/{sportId}")]
    public async Task<IActionResult> GetBySport(int sportId)
    {
        var concepts = await _service.GetBySportAsync(sportId);
        var result = _mapper.Map<List<SportConceptDto>>(concepts);
        return Ok(result);
    }

    [HttpGet("suggestions/{teamId}")]
    public async Task<IActionResult> GetSuggestions(int teamId, [FromQuery] int seasonId)
    {
        var result = await _service.GetConceptsWithSuggestionsAsync(teamId, seasonId);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? sportId = null)
    {
        var concepts = await _service.GetAllAsync(sportId);
        var result = _mapper.Map<List<SportConceptDto>>(concepts);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var concept = await _service.GetByIdAsync(id);
        if (concept == null) return NotFound();
        var result = _mapper.Map<SportConceptDto>(concept);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateSportConceptDto dto)
    {
        try
        {
            var concept = await _service.UpdateAsync(id, dto);
            var result = _mapper.Map<SportConceptDto>(concept);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
