using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SportConceptsController : ControllerBase
{
    private readonly ISportConceptService _service;
    private readonly IMapper _mapper;

    public SportConceptsController(ISportConceptService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSportConceptDto dto)
    {
        var concept = await _service.CreateAsync(dto);
        var result = _mapper.Map<SportConceptDto>(concept);
        return CreatedAtAction(nameof(GetBySport), new { sportId = result.SportId }, result);
    }

    [HttpGet("by-sport/{sportId}")]
    public async Task<IActionResult> GetBySport(int sportId)
    {
        var concepts = await _service.GetBySportAsync(sportId);
        var result = _mapper.Map<List<SportConceptDto>>(concepts);
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
