using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models;
using SportPlanner.Services;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SportPlanner.Controllers;

[Route("api/planningtemplates")]
[ApiController]
[Authorize]
public class PlanningTemplatesController : ControllerBase
{
    private readonly IPlanningTemplateService _planningTemplateService;

    public PlanningTemplatesController(IPlanningTemplateService planningTemplateService)
    {
        _planningTemplateService = planningTemplateService;
    }

    protected string UserId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                            ?? User.FindFirst("sub")?.Value 
                            ?? throw new UnauthorizedAccessException();

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PlanningTemplate>>> GetMyTemplates([FromQuery] int? sportId)
    {
        var results = await _planningTemplateService.GetUserTemplatesAsync(UserId, sportId);
        return Ok(results);
    }

    [HttpPost]
    public async Task<ActionResult<PlanningTemplate>> Create([FromBody] PlanningTemplate template)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _planningTemplateService.CreateTemplateAsync(template, UserId);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PlanningTemplate>> GetById(int id)
    {
        var result = await _planningTemplateService.GetTemplateByIdAsync(id, UserId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _planningTemplateService.DeleteTemplateAsync(id, UserId);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PlanningTemplate template)
    {
        if (id != template.Id) return BadRequest();
        
        var success = await _planningTemplateService.UpdateTemplateAsync(template, UserId);
        if (!success) return NotFound("Template not found or not owned by user.");
        
        return NoContent();
    }

    [HttpPut("{id}/concepts")]
    public async Task<IActionResult> UpdateConcepts(int id, [FromBody] List<PlanningTemplateConcept> concepts)
    {
        var success = await _planningTemplateService.UpdateTemplateConceptsAsync(id, concepts, UserId);
        if (!success) return NotFound("Template not found or not owned by user.");
        
        return NoContent();
    }
}
