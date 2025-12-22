using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs;
using SportPlanner.Services;
using AutoMapper;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExercisesController : ControllerBase
{
    private readonly IExerciseService _exerciseService;
    private readonly IMapper _mapper;

    public ExercisesController(IExerciseService exerciseService, IMapper mapper)
    {
        _exerciseService = exerciseService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<ExerciseDto>>> GetAll([FromQuery] int? conceptId)
    {
        var exercises = await _exerciseService.GetAllAsync(conceptId);
        return Ok(_mapper.Map<List<ExerciseDto>>(exercises));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ExerciseDto>> GetById(int id)
    {
        var exercise = await _exerciseService.GetByIdAsync(id);
        if (exercise == null) return NotFound();
        return Ok(_mapper.Map<ExerciseDto>(exercise));
    }

    [HttpPost]
    public async Task<ActionResult<ExerciseDto>> Create(CreateExerciseDto dto)
    {
        var exercise = await _exerciseService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = exercise.Id }, _mapper.Map<ExerciseDto>(exercise));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ExerciseDto>> Update(int id, CreateExerciseDto dto)
    {
        try
        {
            var exercise = await _exerciseService.UpdateAsync(id, dto);
            return Ok(_mapper.Map<ExerciseDto>(exercise));
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _exerciseService.DeleteAsync(id);
        return NoContent();
    }
}
