using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.DTOs;
using SportPlanner.Interfaces;
using SportPlanner.Services;
using System.Security.Claims;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class [CONTROLLER_NAME]Controller : ControllerBase
{
    private readonly I[SERVICE_NAME]Service _[SERVICE_NAME_LOWER]Service;
    private readonly IUserContextService _userContextService;
    private readonly ILogger<[CONTROLLER_NAME]Controller> _logger;

    public [CONTROLLER_NAME]Controller(
        I[SERVICE_NAME]Service [SERVICE_NAME_LOWER]Service,
        IUserContextService userContextService,
        ILogger<[CONTROLLER_NAME]Controller> logger)
    {
        _[SERVICE_NAME_LOWER]Service = [SERVICE_NAME_LOWER]Service;
        _userContextService = userContextService;
        _logger = logger;
    }

    /// <summary>
    /// Get all [ENTITY_PLURAL] for the current user
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<[ENTITY]Dto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<[ENTITY]Dto>>> GetAll()
    {
        try
        {
            var userId = _userContextService.UserId;
            var [ENTITY_PLURAL_LOWER] = await _[SERVICE_NAME_LOWER]Service.GetAllAsync(userId);
            
            return Ok([ENTITY_PLURAL_LOWER]);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving [ENTITY_PLURAL] for user {UserId}", _userContextService.UserId);
            return StatusCode(500, new { message = "An error occurred while retrieving [ENTITY_PLURAL]" });
        }
    }

    /// <summary>
    /// Get a specific [ENTITY] by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof([ENTITY]Dto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<[ENTITY]Dto>> GetById(Guid id)
    {
        try
        {
            var userId = _userContextService.UserId;
            var [ENTITY_LOWER] = await _[SERVICE_NAME_LOWER]Service.GetByIdAsync(id, userId);
            
            if ([ENTITY_LOWER] == null)
            {
                return NotFound(new { message = "[ENTITY] not found" });
            }
            
            return Ok([ENTITY_LOWER]);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving [ENTITY] {Id} for user {UserId}", id, _userContextService.UserId);
            return StatusCode(500, new { message = "An error occurred while retrieving the [ENTITY]" });
        }
    }

    /// <summary>
    /// Create a new [ENTITY]
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof([ENTITY]Dto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<[ENTITY]Dto>> Create([FromBody] [ENTITY]CreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var userId = _userContextService.UserId;
            var created[ENTITY] = await _[SERVICE_NAME_LOWER]Service.CreateAsync(dto, userId);
            
            return CreatedAtAction(
                nameof(GetById),
                new { id = created[ENTITY].Id },
                created[ENTITY]
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating [ENTITY] for user {UserId}", _userContextService.UserId);
            return StatusCode(500, new { message = "An error occurred while creating the [ENTITY]" });
        }
    }

    /// <summary>
    /// Update an existing [ENTITY]
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof([ENTITY]Dto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<[ENTITY]Dto>> Update(Guid id, [FromBody] [ENTITY]UpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var userId = _userContextService.UserId;
            var updated[ENTITY] = await _[SERVICE_NAME_LOWER]Service.UpdateAsync(id, dto, userId);
            
            return Ok(updated[ENTITY]);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating [ENTITY] {Id} for user {UserId}", id, _userContextService.UserId);
            return StatusCode(500, new { message = "An error occurred while updating the [ENTITY]" });
        }
    }

    /// <summary>
    /// Delete a [ENTITY]
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var userId = _userContextService.UserId;
            var deleted = await _[SERVICE_NAME_LOWER]Service.DeleteAsync(id, userId);
            
            if (!deleted)
            {
                return NotFound(new { message = "[ENTITY] not found" });
            }
            
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting [ENTITY] {Id} for user {UserId}", id, _userContextService.UserId);
            return StatusCode(500, new { message = "An error occurred while deleting the [ENTITY]" });
        }
    }
}

/* 
USAGE INSTRUCTIONS:
1. Replace [CONTROLLER_NAME] with controller name (e.g., 'Teams')
2. Replace [SERVICE_NAME] with service name (e.g., 'Team')
3. Replace [SERVICE_NAME_LOWER] with camelCase service name (e.g., 'teamService')
4. Replace [ENTITY] with entity name (e.g., 'Team')
5. Replace [ENTITY_LOWER] with camelCase entity name (e.g., 'team')
6. Replace [ENTITY_PLURAL] with plural form (e.g., 'Teams')
7. Replace [ENTITY_PLURAL_LOWER] with camelCase plural (e.g., 'teams')
8. Ensure corresponding DTOs exist ([ENTITY]Dto, [ENTITY]CreateDto, [ENTITY]UpdateDto)
9. Add specific authorization policies if needed
10. Implement additional endpoints as required (search, pagination, etc.)

.NET 8 PATTERNS INCLUDED:
- RESTful API design with proper HTTP verbs
- Dependency injection with proper service registration
- Authorization with JWT tokens
- Comprehensive error handling and logging
- OpenAPI documentation with ProducesResponseType
- Model validation with ModelState
- Structured logging with contextual information
- User context integration for multi-tenant scenarios
- Proper HTTP status codes
- Async/await throughout
*/