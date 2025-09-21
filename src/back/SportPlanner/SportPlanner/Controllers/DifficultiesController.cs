using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DifficultiesController : ControllerBase
{
    private readonly IDifficultyService _difficultyService;

    public DifficultiesController(IDifficultyService difficultyService)
    {
        _difficultyService = difficultyService;
    }

    /// <summary>
    /// Get all difficulties
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DifficultyDto>>> GetDifficulties()
    {
        var difficulties = await _difficultyService.GetAllDifficultiesAsync();
        return Ok(difficulties);
    }

    /// <summary>
    /// Get difficulties summary
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<IEnumerable<DifficultySummaryDto>>> GetDifficultiesSummary()
    {
        var difficulties = await _difficultyService.GetDifficultiesSummaryAsync();
        return Ok(difficulties);
    }

    /// <summary>
    /// Get difficulty by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<DifficultyDto>> GetDifficulty(int id)
    {
        var difficulty = await _difficultyService.GetDifficultyByIdAsync(id);
        if (difficulty == null)
        {
            return NotFound($"Difficulty with ID {id} not found.");
        }

        return Ok(difficulty);
    }

    /// <summary>
    /// Create a new difficulty
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<DifficultyDto>> CreateDifficulty([FromBody] CreateDifficultyDto createDifficultyDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var difficulty = await _difficultyService.CreateDifficultyAsync(createDifficultyDto);
            return CreatedAtAction(nameof(GetDifficulty), new { id = difficulty.Id }, difficulty);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error creating difficulty: {ex.Message}");
        }
    }

    /// <summary>
    /// Update an existing difficulty
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<DifficultyDto>> UpdateDifficulty(int id, [FromBody] UpdateDifficultyDto updateDifficultyDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var difficulty = await _difficultyService.UpdateDifficultyAsync(id, updateDifficultyDto);
            if (difficulty == null)
            {
                return NotFound($"Difficulty with ID {id} not found.");
            }

            return Ok(difficulty);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error updating difficulty: {ex.Message}");
        }
    }

    /// <summary>
    /// Delete a difficulty (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteDifficulty(int id)
    {
        try
        {
            var result = await _difficultyService.DeleteDifficultyAsync(id);
            if (!result)
            {
                return NotFound($"Difficulty with ID {id} not found.");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest($"Error deleting difficulty: {ex.Message}");
        }
    }

    /// <summary>
    /// Check if difficulty exists
    /// </summary>
    [HttpGet("{id}/exists")]
    public async Task<ActionResult<bool>> DifficultyExists(int id)
    {
        var exists = await _difficultyService.DifficultyExistsAsync(id);
        return Ok(exists);
    }
}