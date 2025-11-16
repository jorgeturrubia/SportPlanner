using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConceptInterpretationsController : ControllerBase
{
    private readonly IConceptInterpretationService _service;
    private readonly IMapper _mapper;

    public ConceptInterpretationsController(IConceptInterpretationService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ConceptInterpretationCreateDto dto)
    {
        var ci = await _service.CreateAsync(dto);
        var result = _mapper.Map<ConceptInterpretationDto>(ci);
        return CreatedAtAction(nameof(Resolve), new { sportConceptId = result.SportConceptId, teamId = result.TeamId }, result);
    }

    [HttpGet("resolve/{sportConceptId}/for-team/{teamId}")]
    public async Task<IActionResult> Resolve(int sportConceptId, int teamId)
    {
        var ci = await _service.ResolveForTeamAsync(sportConceptId, teamId);
        if (ci == null) return NotFound();
        var dto = _mapper.Map<ConceptInterpretationDto>(ci);
        return Ok(dto);
    }
}
