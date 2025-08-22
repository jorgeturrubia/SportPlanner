using Microsoft.AspNetCore.Mvc;
using SportPlanner.Api.Dtos;
using SportPlanner.Api.Models;
using SportPlanner.Api.Services;
using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Api.Controllers;

/// <summary>
/// Controller for managing training objectives
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ObjectivesController : ControllerBase
{
    private readonly IObjectivesService _objectivesService;
    private readonly ILogger<ObjectivesController> _logger;

    public ObjectivesController(IObjectivesService objectivesService, ILogger<ObjectivesController> logger)
    {
        _objectivesService = objectivesService;
        _logger = logger;
    }

    /// <summary>
    /// Get all objectives with optional filtering
    /// </summary>
    /// <param name="filters">Filter parameters</param>
    /// <returns>Paginated list of objectives</returns>
    [HttpGet]
    public async Task<ActionResult<ObjectivesListResponseDto>> GetObjectives([FromQuery] ObjectiveFilterDto filters)
    {
        try
        {
            var response = await _objectivesService.GetObjectivesAsync(filters);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving objectives");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get objective by ID
    /// </summary>
    /// <param name="id">Objective ID</param>
    /// <returns>Objective details</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ObjectiveResponseDto>> GetObjective(Guid id)
    {
        try
        {
            var objective = await _objectivesService.GetObjectiveByIdAsync(id);
            
            if (objective == null)
                return NotFound($"Objective with ID {id} not found");

            return Ok(objective);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving objective {ObjectiveId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new objective
    /// </summary>
    /// <param name="createDto">Objective creation data</param>
    /// <returns>Created objective</returns>
    [HttpPost]
    public async Task<ActionResult<ObjectiveResponseDto>> CreateObjective([FromBody] CreateObjectiveDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // TODO: Get user ID from authentication context
            var userId = Guid.NewGuid(); // Placeholder
            
            var createdObjective = await _objectivesService.CreateObjectiveAsync(createDto, userId);
            
            return CreatedAtAction(
                nameof(GetObjective),
                new { id = createdObjective.Id },
                createdObjective);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating objective");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing objective
    /// </summary>
    /// <param name="id">Objective ID</param>
    /// <param name="updateDto">Objective update data</param>
    /// <returns>Updated objective</returns>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ObjectiveResponseDto>> UpdateObjective(Guid id, [FromBody] UpdateObjectiveDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // TODO: Implement with service layer
            // var updatedObjective = await _objectiveService.UpdateAsync(id, updateDto);
            
            // if (updatedObjective == null)
            //     return NotFound($"Objective with ID {id} not found");

            // return Ok(updatedObjective);
            
            return NotFound($"Objective with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating objective {ObjectiveId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete an objective
    /// </summary>
    /// <param name="id">Objective ID</param>
    /// <returns>No content if successful</returns>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteObjective(Guid id)
    {
        try
        {
            // TODO: Implement with service layer
            // var deleted = await _objectiveService.DeleteAsync(id);
            
            // if (!deleted)
            //     return NotFound($"Objective with ID {id} not found");

            // return NoContent();
            
            return NotFound($"Objective with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting objective {ObjectiveId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get objectives by category
    /// </summary>
    /// <param name="category">Objective category</param>
    /// <returns>List of objectives in the specified category</returns>
    [HttpGet("category/{category}")]
    public async Task<ActionResult<List<ObjectiveResponseDto>>> GetObjectivesByCategory(ObjectiveCategory category)
    {
        try
        {
            // TODO: Implement with service layer
            var objectives = new List<ObjectiveResponseDto>();
            return Ok(objectives);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving objectives by category {Category}", category);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get objectives by sport
    /// </summary>
    /// <param name="sport">Sport name</param>
    /// <returns>List of objectives for the specified sport</returns>
    [HttpGet("sport/{sport}")]
    public async Task<ActionResult<List<ObjectiveResponseDto>>> GetObjectivesBySport(string sport)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(sport))
                return BadRequest("Sport parameter is required");

            // TODO: Implement with service layer
            var objectives = new List<ObjectiveResponseDto>();
            return Ok(objectives);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving objectives by sport {Sport}", sport);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Search objectives by title or description
    /// </summary>
    /// <param name="query">Search query</param>
    /// <returns>List of matching objectives</returns>
    [HttpGet("search")]
    public async Task<ActionResult<List<ObjectiveResponseDto>>> SearchObjectives([FromQuery] string query)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Search query is required");

            // TODO: Implement with service layer
            var objectives = new List<ObjectiveResponseDto>();
            return Ok(objectives);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching objectives with query {Query}", query);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get popular objectives (most used)
    /// </summary>
    /// <param name="limit">Number of objectives to return</param>
    /// <returns>List of popular objectives</returns>
    [HttpGet("popular")]
    public async Task<ActionResult<List<ObjectiveResponseDto>>> GetPopularObjectives([FromQuery] int limit = 10)
    {
        try
        {
            if (limit <= 0 || limit > 100)
                return BadRequest("Limit must be between 1 and 100");

            // TODO: Implement with service layer
            var objectives = new List<ObjectiveResponseDto>();
            return Ok(objectives);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving popular objectives");
            return StatusCode(500, "Internal server error");
        }
    }
}