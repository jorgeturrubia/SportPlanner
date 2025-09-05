using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;
using System.Security.Claims;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomExercisesController : ControllerBase
{
    private readonly ICustomExerciseService _customExerciseService;
    private readonly ILogger<CustomExercisesController> _logger;

    public CustomExercisesController(ICustomExerciseService customExerciseService, ILogger<CustomExercisesController> logger)
    {
        _customExerciseService = customExerciseService;
        _logger = logger;
    }

    // GET: api/customexercises
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomExerciseDto>>> GetCustomExercises()
    {
        try
        {
            var userId = GetCurrentUserId();
            var exercises = await _customExerciseService.GetUserCustomExercisesAsync(userId);
            return Ok(exercises);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting custom exercises for user");
            return StatusCode(500, "An error occurred while retrieving custom exercises");
        }
    }

    // GET: api/customexercises/filtered
    [HttpGet("filtered")]
    public async Task<ActionResult<IEnumerable<CustomExerciseDto>>> GetFilteredCustomExercises([FromQuery] CustomExerciseFilterDto filter)
    {
        try
        {
            var userId = GetCurrentUserId();
            var exercises = await _customExerciseService.GetFilteredCustomExercisesAsync(userId, filter);
            return Ok(exercises);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting filtered custom exercises for user");
            return StatusCode(500, "An error occurred while retrieving filtered custom exercises");
        }
    }

    // GET: api/customexercises/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CustomExerciseDto>> GetCustomExercise(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var exercise = await _customExerciseService.GetCustomExerciseAsync(id, userId);

            if (exercise == null)
            {
                return NotFound($"Custom exercise with ID {id} not found or access denied");
            }

            return Ok(exercise);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting custom exercise {ExerciseId}", id);
            return StatusCode(500, "An error occurred while retrieving the custom exercise");
        }
    }

    // POST: api/customexercises
    [HttpPost]
    public async Task<ActionResult<CustomExerciseDto>> CreateCustomExercise(CreateCustomExerciseRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var exercise = await _customExerciseService.CreateCustomExerciseAsync(request, userId);

            return CreatedAtAction(nameof(GetCustomExercise), new { id = exercise.Id }, exercise);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating custom exercise");
            return StatusCode(500, "An error occurred while creating the custom exercise");
        }
    }

    // PUT: api/customexercises/5
    [HttpPut("{id}")]
    public async Task<ActionResult<CustomExerciseDto>> UpdateCustomExercise(int id, UpdateCustomExerciseRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var exercise = await _customExerciseService.UpdateCustomExerciseAsync(id, request, userId);

            return Ok(exercise);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Custom exercise with ID {id} not found");
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid("You do not have permission to update this custom exercise");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating custom exercise {ExerciseId}", id);
            return StatusCode(500, "An error occurred while updating the custom exercise");
        }
    }

    // DELETE: api/customexercises/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomExercise(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _customExerciseService.DeleteCustomExerciseAsync(id, userId);

            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Custom exercise with ID {id} not found");
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid("You do not have permission to delete this custom exercise");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting custom exercise {ExerciseId}", id);
            return StatusCode(500, "An error occurred while deleting the custom exercise");
        }
    }

    // POST: api/customexercises/5/increment-usage
    [HttpPost("{id}/increment-usage")]
    public async Task<IActionResult> IncrementUsageCount(int id)
    {
        try
        {
            await _customExerciseService.IncrementUsageCountAsync(id);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error incrementing usage count for custom exercise {ExerciseId}", id);
            return StatusCode(500, "An error occurred while updating the usage count");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        return userId;
    }
}