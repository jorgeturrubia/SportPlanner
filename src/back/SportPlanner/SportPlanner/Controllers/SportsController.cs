using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SportsController : ControllerBase
{
    private readonly ISportService _sportService;

    public SportsController(ISportService sportService)
    {
        _sportService = sportService;
    }

    /// <summary>
    /// Get all sports
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SportDto>>> GetSports()
    {
        var sports = await _sportService.GetAllSportsAsync();
        return Ok(sports);
    }

    /// <summary>
    /// Get sports summary with counts
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<IEnumerable<SportSummaryDto>>> GetSportsSummary()
    {
        var sports = await _sportService.GetSportsSummaryAsync();
        return Ok(sports);
    }

    /// <summary>
    /// Get sport by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SportDto>> GetSport(int id)
    {
        var sport = await _sportService.GetSportByIdAsync(id);
        if (sport == null)
        {
            return NotFound($"Sport with ID {id} not found.");
        }

        return Ok(sport);
    }

    /// <summary>
    /// Create a new sport
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<SportDto>> CreateSport([FromBody] CreateSportDto createSportDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var sport = await _sportService.CreateSportAsync(createSportDto);
            return CreatedAtAction(nameof(GetSport), new { id = sport.Id }, sport);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error creating sport: {ex.Message}");
        }
    }

    /// <summary>
    /// Update an existing sport
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<SportDto>> UpdateSport(int id, [FromBody] UpdateSportDto updateSportDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var sport = await _sportService.UpdateSportAsync(id, updateSportDto);
            if (sport == null)
            {
                return NotFound($"Sport with ID {id} not found.");
            }

            return Ok(sport);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error updating sport: {ex.Message}");
        }
    }

    /// <summary>
    /// Delete a sport (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteSport(int id)
    {
        try
        {
            var result = await _sportService.DeleteSportAsync(id);
            if (!result)
            {
                return NotFound($"Sport with ID {id} not found.");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest($"Error deleting sport: {ex.Message}");
        }
    }

    /// <summary>
    /// Check if sport exists
    /// </summary>
    [HttpGet("{id}/exists")]
    public async Task<ActionResult<bool>> SportExists(int id)
    {
        var exists = await _sportService.SportExistsAsync(id);
        return Ok(exists);
    }
}