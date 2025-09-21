using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LevelsController : ControllerBase
{
    private readonly ILevelService _levelService;
    private readonly ISportService _sportService;

    public LevelsController(ILevelService levelService, ISportService sportService)
    {
        _levelService = levelService;
        _sportService = sportService;
    }

    /// <summary>
    /// Get all levels
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LevelDto>>> GetLevels()
    {
        var levels = await _levelService.GetAllLevelsAsync();
        return Ok(levels);
    }

    /// <summary>
    /// Get levels by sport ID
    /// </summary>
    [HttpGet("sport/{sportId}")]
    public async Task<ActionResult<IEnumerable<LevelDto>>> GetLevelsBySport(int sportId)
    {
        var sportExists = await _sportService.SportExistsAsync(sportId);
        if (!sportExists)
        {
            return NotFound($"Sport with ID {sportId} not found.");
        }

        var levels = await _levelService.GetLevelsBySportAsync(sportId);
        return Ok(levels);
    }

    /// <summary>
    /// Get levels summary
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<IEnumerable<LevelSummaryDto>>> GetLevelsSummary()
    {
        var levels = await _levelService.GetLevelsSummaryAsync();
        return Ok(levels);
    }

    /// <summary>
    /// Get level by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<LevelDto>> GetLevel(int id)
    {
        var level = await _levelService.GetLevelByIdAsync(id);
        if (level == null)
        {
            return NotFound($"Level with ID {id} not found.");
        }

        return Ok(level);
    }

    /// <summary>
    /// Create a new level
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<LevelDto>> CreateLevel([FromBody] CreateLevelDto createLevelDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var sportExists = await _sportService.SportExistsAsync(createLevelDto.SportId);
        if (!sportExists)
        {
            return BadRequest($"Sport with ID {createLevelDto.SportId} not found.");
        }

        try
        {
            var level = await _levelService.CreateLevelAsync(createLevelDto);
            return CreatedAtAction(nameof(GetLevel), new { id = level.Id }, level);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error creating level: {ex.Message}");
        }
    }

    /// <summary>
    /// Update an existing level
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<LevelDto>> UpdateLevel(int id, [FromBody] UpdateLevelDto updateLevelDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var sportExists = await _sportService.SportExistsAsync(updateLevelDto.SportId);
        if (!sportExists)
        {
            return BadRequest($"Sport with ID {updateLevelDto.SportId} not found.");
        }

        try
        {
            var level = await _levelService.UpdateLevelAsync(id, updateLevelDto);
            if (level == null)
            {
                return NotFound($"Level with ID {id} not found.");
            }

            return Ok(level);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error updating level: {ex.Message}");
        }
    }

    /// <summary>
    /// Delete a level (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteLevel(int id)
    {
        try
        {
            var result = await _levelService.DeleteLevelAsync(id);
            if (!result)
            {
                return NotFound($"Level with ID {id} not found.");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest($"Error deleting level: {ex.Message}");
        }
    }

    /// <summary>
    /// Check if level exists
    /// </summary>
    [HttpGet("{id}/exists")]
    public async Task<ActionResult<bool>> LevelExists(int id)
    {
        var exists = await _levelService.LevelExistsAsync(id);
        return Ok(exists);
    }
}