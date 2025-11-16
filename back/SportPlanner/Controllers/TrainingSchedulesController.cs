using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrainingSchedulesController : ControllerBase
{
    private readonly ITrainingScheduleService _service;
    private readonly IMapper _mapper;

    public TrainingSchedulesController(ITrainingScheduleService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpPost("teams/{teamId}")]
    public async Task<IActionResult> Create(int teamId, [FromBody] TrainingScheduleCreateDto dto)
    {
        var schedule = await _service.CreateAsync(dto, teamId);
        var result = _mapper.Map<TrainingScheduleDto>(schedule);
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        // lightweight: not fully implemented (service missing GetById)
        return Ok();
    }

    [HttpGet("{id}/occurrences")]
    public async Task<IActionResult> GetOccurrences(int id, [FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        var result = await _service.GenerateOccurrencesAsync(id, from, to);
        return Ok(result);
    }
}
