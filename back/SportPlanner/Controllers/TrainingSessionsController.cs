using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrainingSessionsController : ControllerBase
{
    private readonly ITrainingSessionService _service;
    private readonly IMapper _mapper;

    public TrainingSessionsController(ITrainingSessionService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TrainingSessionCreateDto dto)
    {
        var session = await _service.CreateAsync(dto);
        var result = _mapper.Map<TrainingSessionDto>(session);
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpPost("from-plan/{scheduleId}")]
    public async Task<IActionResult> CreateFromPlan(int scheduleId, [FromBody] TrainingSessionCreateDto dto)
    {
        var session = await _service.CreateFromPlanAsync(scheduleId, dto);
        var result = _mapper.Map<TrainingSessionDto>(session);
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var session = await _service.GetByIdAsync(id);
        if (session == null) return NotFound();
        var dto = _mapper.Map<TrainingSessionDto>(session);
        return Ok(dto);
    }
}
