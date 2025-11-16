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
}
