using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;
using System.Security.Claims;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PlanningsController : ControllerBase
{
    private readonly IPlanningService _planningService;
    private readonly ILogger<PlanningsController> _logger;

    public PlanningsController(IPlanningService planningService, ILogger<PlanningsController> logger)
    {
        _planningService = planningService;
        _logger = logger;
    }

    // GET: api/plannings
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PlanningDto>>> GetPlannings()
    {
        try
        {
            var userId = GetCurrentUserId();
            var plannings = await _planningService.GetUserPlanningsAsync(userId);
            return Ok(plannings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting plannings for user");
            return StatusCode(500, "An error occurred while retrieving plannings");
        }
    }

    // GET: api/plannings/filtered
    [HttpGet("filtered")]
    public async Task<ActionResult<IEnumerable<PlanningDto>>> GetFilteredPlannings([FromQuery] PlanningFilterDto filter)
    {
        try
        {
            var userId = GetCurrentUserId();
            var plannings = await _planningService.GetFilteredPlanningsAsync(userId, filter);
            return Ok(plannings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting filtered plannings for user");
            return StatusCode(500, "An error occurred while retrieving filtered plannings");
        }
    }

    // GET: api/plannings/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PlanningDto>> GetPlanning(string id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var planning = await _planningService.GetPlanningAsync(id, userId);

            if (planning == null)
            {
                return NotFound($"Planning with ID {id} not found or access denied");
            }

            return Ok(planning);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting planning {PlanningId}", id);
            return StatusCode(500, "An error occurred while retrieving the planning");
        }
    }

    // POST: api/plannings
    [HttpPost]
    public async Task<ActionResult<PlanningDto>> CreatePlanning(CreatePlanningRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate date range
            if (request.EndDate <= request.StartDate)
            {
                return BadRequest("End date must be after start date");
            }

            // Validate training days
            if (request.TrainingDays == null || !request.TrainingDays.Any())
            {
                return BadRequest("At least one training day must be specified");
            }

            var userId = GetCurrentUserId();
            var planning = await _planningService.CreatePlanningAsync(request, userId);

            return CreatedAtAction(nameof(GetPlanning), new { id = planning.Id }, planning);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating planning");
            return StatusCode(500, "An error occurred while creating the planning");
        }
    }

    // PUT: api/plannings/5
    [HttpPut("{id}")]
    public async Task<ActionResult<PlanningDto>> UpdatePlanning(string id, UpdatePlanningRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate date range
            if (request.EndDate <= request.StartDate)
            {
                return BadRequest("End date must be after start date");
            }

            // Validate training days
            if (request.TrainingDays == null || !request.TrainingDays.Any())
            {
                return BadRequest("At least one training day must be specified");
            }

            var userId = GetCurrentUserId();
            var planning = await _planningService.UpdatePlanningAsync(id, request, userId);

            return Ok(planning);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Planning with ID {id} not found");
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating planning {PlanningId}", id);
            return StatusCode(500, "An error occurred while updating the planning");
        }
    }

    // DELETE: api/plannings/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlanning(string id)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _planningService.DeletePlanningAsync(id, userId);

            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Planning with ID {id} not found");
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting planning {PlanningId}", id);
            return StatusCode(500, "An error occurred while deleting the planning");
        }
    }

    // PUT: api/plannings/5/status
    [HttpPut("{id}/status")]
    public async Task<ActionResult<PlanningDto>> UpdatePlanningStatus(string id, [FromBody] UpdatePlanningStatusRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var planning = await _planningService.UpdatePlanningStatusAsync(id, request.Status, userId);

            return Ok(planning);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Planning with ID {id} not found");
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating planning status {PlanningId}", id);
            return StatusCode(500, "An error occurred while updating the planning status");
        }
    }

    // POST: api/plannings/calculate-sessions
    [HttpPost("calculate-sessions")]
    public async Task<ActionResult<int>> CalculateTotalSessions([FromBody] CalculateSessionsRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate date range
            if (request.EndDate <= request.StartDate)
            {
                return BadRequest("End date must be after start date");
            }

            // Validate training days
            if (request.TrainingDays == null || !request.TrainingDays.Any())
            {
                return BadRequest("At least one training day must be specified");
            }

            var totalSessions = await _planningService.CalculateTotalSessionsAsync(
                request.StartDate, request.EndDate, request.TrainingDays);

            return Ok(totalSessions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating total sessions");
            return StatusCode(500, "An error occurred while calculating total sessions");
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

// Additional DTOs for specific endpoint requests
public class UpdatePlanningStatusRequest
{
    public PlanningStatus Status { get; set; }
}

public class CalculateSessionsRequest
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<Models.DayOfWeek> TrainingDays { get; set; } = new();
}