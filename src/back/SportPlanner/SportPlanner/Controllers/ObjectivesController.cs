using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;
using System.Security.Claims;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ObjectivesController : ControllerBase
{
    private readonly IObjectiveService _objectiveService;
    private readonly ILogger<ObjectivesController> _logger;

    public ObjectivesController(IObjectiveService objectiveService, ILogger<ObjectivesController> logger)
    {
        _objectiveService = objectiveService;
        _logger = logger;
    }

    // GET: api/objectives
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ObjectiveDto>>> GetObjectives()
    {
        try
        {
            var userId = GetCurrentUserId();
            var objectives = await _objectiveService.GetUserObjectivesAsync(userId);
            return Ok(objectives);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting objectives for user");
            return StatusCode(500, "An error occurred while retrieving objectives");
        }
    }

    // GET: api/objectives/filtered
    [HttpGet("filtered")]
    public async Task<ActionResult<IEnumerable<ObjectiveDto>>> GetFilteredObjectives([FromQuery] ObjectiveFilterDto filter)
    {
        try
        {
            var userId = GetCurrentUserId();
            var objectives = await _objectiveService.GetFilteredObjectivesAsync(userId, filter);
            return Ok(objectives);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting filtered objectives for user");
            return StatusCode(500, "An error occurred while retrieving filtered objectives");
        }
    }

    // GET: api/objectives/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ObjectiveDto>> GetObjective(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var objective = await _objectiveService.GetObjectiveAsync(id, userId);

            if (objective == null)
            {
                return NotFound($"Objective with ID {id} not found or access denied");
            }

            return Ok(objective);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting objective {ObjectiveId}", id);
            return StatusCode(500, "An error occurred while retrieving the objective");
        }
    }

    // POST: api/objectives
    [HttpPost]
    public async Task<ActionResult<ObjectiveDto>> CreateObjective(CreateObjectiveRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var objective = await _objectiveService.CreateObjectiveAsync(request, userId);

            return CreatedAtAction(nameof(GetObjective), new { id = objective.Id }, objective);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating objective");
            return StatusCode(500, "An error occurred while creating the objective");
        }
    }

    // PUT: api/objectives/5
    [HttpPut("{id}")]
    public async Task<ActionResult<ObjectiveDto>> UpdateObjective(int id, UpdateObjectiveRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var objective = await _objectiveService.UpdateObjectiveAsync(id, request, userId);

            return Ok(objective);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Objective with ID {id} not found");
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid("You do not have permission to update this objective");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating objective {ObjectiveId}", id);
            return StatusCode(500, "An error occurred while updating the objective");
        }
    }

    // DELETE: api/objectives/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteObjective(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _objectiveService.DeleteObjectiveAsync(id, userId);

            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Objective with ID {id} not found");
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid("You do not have permission to delete this objective");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting objective {ObjectiveId}", id);
            return StatusCode(500, "An error occurred while deleting the objective");
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