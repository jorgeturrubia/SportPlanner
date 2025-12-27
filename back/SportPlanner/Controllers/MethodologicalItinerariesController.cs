using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models;
using SportPlanner.Services;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SportPlanner.Controllers;

[Route("api/methodological-itineraries")]
[ApiController]
[Authorize]
public class MethodologicalItinerariesController : ControllerBase
{
    private readonly IPlanningTemplateService _planningTemplateService;

    public MethodologicalItinerariesController(IPlanningTemplateService planningTemplateService)
    {
        _planningTemplateService = planningTemplateService;
    }

    protected string UserId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                            ?? User.FindFirst("sub")?.Value 
                            ?? throw new UnauthorizedAccessException();

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MethodologicalItinerary>>> GetMyItineraries()
    {
        var results = await _planningTemplateService.GetUserItinerariesAsync(UserId);
        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MethodologicalItinerary>> GetById(int id)
    {
        var result = await _planningTemplateService.GetItineraryByIdAsync(id, UserId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<MethodologicalItinerary>> Create([FromBody] MethodologicalItinerary itinerary)
    {
        var result = await _planningTemplateService.CreateItineraryAsync(itinerary, UserId);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] MethodologicalItinerary itinerary)
    {
        if (id != itinerary.Id) return BadRequest();
        
        var success = await _planningTemplateService.UpdateItineraryAsync(itinerary, UserId);
        if (!success) return NotFound();
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _planningTemplateService.DeleteItineraryAsync(id, UserId);
        if (!success) return NotFound();
        
        return NoContent();
    }
}
