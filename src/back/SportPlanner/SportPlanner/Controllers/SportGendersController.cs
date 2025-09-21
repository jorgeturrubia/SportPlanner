using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SportGendersController : ControllerBase
{
    private readonly ISportGenderService _sportGenderService;
    private readonly ISportService _sportService;

    public SportGendersController(ISportGenderService sportGenderService, ISportService sportService)
    {
        _sportGenderService = sportGenderService;
        _sportService = sportService;
    }

    /// <summary>
    /// Get all sport genders
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SportGenderDto>>> GetSportGenders()
    {
        var sportGenders = await _sportGenderService.GetAllSportGendersAsync();
        return Ok(sportGenders);
    }

    /// <summary>
    /// Get sport genders by sport ID
    /// </summary>
    [HttpGet("sport/{sportId}")]
    public async Task<ActionResult<IEnumerable<SportGenderDto>>> GetSportGendersBySport(int sportId)
    {
        var sportExists = await _sportService.SportExistsAsync(sportId);
        if (!sportExists)
        {
            return NotFound($"Sport with ID {sportId} not found.");
        }

        var sportGenders = await _sportGenderService.GetSportGendersBySportAsync(sportId);
        return Ok(sportGenders);
    }

    /// <summary>
    /// Get sport genders summary
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<IEnumerable<SportGenderSummaryDto>>> GetSportGendersSummary()
    {
        var sportGenders = await _sportGenderService.GetSportGendersSummaryAsync();
        return Ok(sportGenders);
    }

    /// <summary>
    /// Get sport gender by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SportGenderDto>> GetSportGender(int id)
    {
        var sportGender = await _sportGenderService.GetSportGenderByIdAsync(id);
        if (sportGender == null)
        {
            return NotFound($"Sport gender with ID {id} not found.");
        }

        return Ok(sportGender);
    }

    /// <summary>
    /// Create a new sport gender
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<SportGenderDto>> CreateSportGender([FromBody] CreateSportGenderDto createSportGenderDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var sportExists = await _sportService.SportExistsAsync(createSportGenderDto.SportId);
        if (!sportExists)
        {
            return BadRequest($"Sport with ID {createSportGenderDto.SportId} not found.");
        }

        try
        {
            var sportGender = await _sportGenderService.CreateSportGenderAsync(createSportGenderDto);
            return CreatedAtAction(nameof(GetSportGender), new { id = sportGender.Id }, sportGender);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error creating sport gender: {ex.Message}");
        }
    }

    /// <summary>
    /// Update an existing sport gender
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<SportGenderDto>> UpdateSportGender(int id, [FromBody] UpdateSportGenderDto updateSportGenderDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var sportExists = await _sportService.SportExistsAsync(updateSportGenderDto.SportId);
        if (!sportExists)
        {
            return BadRequest($"Sport with ID {updateSportGenderDto.SportId} not found.");
        }

        try
        {
            var sportGender = await _sportGenderService.UpdateSportGenderAsync(id, updateSportGenderDto);
            if (sportGender == null)
            {
                return NotFound($"Sport gender with ID {id} not found.");
            }

            return Ok(sportGender);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error updating sport gender: {ex.Message}");
        }
    }

    /// <summary>
    /// Delete a sport gender (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteSportGender(int id)
    {
        try
        {
            var result = await _sportGenderService.DeleteSportGenderAsync(id);
            if (!result)
            {
                return NotFound($"Sport gender with ID {id} not found.");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest($"Error deleting sport gender: {ex.Message}");
        }
    }

    /// <summary>
    /// Check if sport gender exists
    /// </summary>
    [HttpGet("{id}/exists")]
    public async Task<ActionResult<bool>> SportGenderExists(int id)
    {
        var exists = await _sportGenderService.SportGenderExistsAsync(id);
        return Ok(exists);
    }
}