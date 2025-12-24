using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs;
using SportPlanner.Services;
using AutoMapper;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrainingSessionsController : ControllerBase
{
    private readonly ITrainingSessionService _sessionService;
    private readonly IMapper _mapper;

    public TrainingSessionsController(ITrainingSessionService sessionService, IMapper mapper)
    {
        _sessionService = sessionService;
        _mapper = mapper;
    }

    [HttpGet("team/{teamId}")]
    public async Task<ActionResult<List<TrainingSessionDto>>> GetByTeam(int teamId)
    {
        var sessions = await _sessionService.GetByTeamAsync(teamId);
        return Ok(_mapper.Map<List<TrainingSessionDto>>(sessions));
    }

    [HttpGet("schedule")]
    public async Task<ActionResult<List<TrainingSessionDto>>> GetSchedule(int teamId, DateTime start, DateTime end)
    {
        var sessions = await _sessionService.GetByDateRangeAsync(teamId, start, end);
        return Ok(_mapper.Map<List<TrainingSessionDto>>(sessions));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TrainingSessionDto>> GetById(int id)
    {
        var session = await _sessionService.GetByIdAsync(id);
        if (session == null) return NotFound();
        return Ok(_mapper.Map<TrainingSessionDto>(session));
    }

    [HttpPost]
    public async Task<ActionResult<TrainingSessionDto>> Create(CreateTrainingSessionDto dto)
    {
        var session = await _sessionService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = session.Id }, _mapper.Map<TrainingSessionDto>(session));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TrainingSessionDto>> Update(int id, CreateTrainingSessionDto dto)
    {
        try
        {
            var session = await _sessionService.UpdateAsync(id, dto);
            return Ok(_mapper.Map<TrainingSessionDto>(session));
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _sessionService.DeleteAsync(id);
        return NoContent();
    }
}
