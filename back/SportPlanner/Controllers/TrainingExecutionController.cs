using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrainingExecutionController : ControllerBase
{
    private readonly ITrainingExecutionService _executionService;
    private readonly IMapper _mapper;

    public TrainingExecutionController(ITrainingExecutionService executionService, IMapper mapper)
    {
        _executionService = executionService;
        _mapper = mapper;
    }

    [HttpPost("start/{sessionId}")]
    public async Task<ActionResult<TrainingSessionDto>> StartSession(int sessionId)
    {
        try
        {
            var session = await _executionService.StartSessionAsync(sessionId);
            return Ok(_mapper.Map<TrainingSessionDto>(session));
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost("finish/{sessionId}")]
    public async Task<ActionResult<TrainingSessionDto>> FinishSession(int sessionId, [FromBody] FinishSessionRequest request)
    {
        try
        {
            var session = await _executionService.FinishSessionAsync(sessionId, request.Rating, request.Notes, request.Comments);
            return Ok(_mapper.Map<TrainingSessionDto>(session));
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost("exercise/{sessionExerciseId}/complete")]
    public async Task<ActionResult<TrainingSessionExerciseDto>> CompleteExercise(int sessionExerciseId, [FromBody] CompleteExerciseRequest request)
    {
        try
        {
            var exercise = await _executionService.CompleteExerciseAsync(sessionExerciseId, request.DurationMinutes, request.Notes);
            return Ok(_mapper.Map<TrainingSessionExerciseDto>(exercise));
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }
}

public class FinishSessionRequest
{
    public int? Rating { get; set; }
    public string? Notes { get; set; }
    public List<string>? Comments { get; set; }
}

public class CompleteExerciseRequest
{
    public int DurationMinutes { get; set; } // Actual duration
    public string? Notes { get; set; }
}
