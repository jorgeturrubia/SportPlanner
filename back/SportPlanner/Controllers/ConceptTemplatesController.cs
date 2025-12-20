using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs.ConceptTemplate;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConceptTemplatesController : ControllerBase
{
    private readonly IConceptTemplateService _service;

    public ConceptTemplatesController(IConceptTemplateService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? sportId = null)
    {
        var templates = await _service.GetAllAsync(sportId);
        return Ok(templates);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var template = await _service.GetByIdAsync(id);
        if (template == null)
        {
            return NotFound();
        }
        return Ok(template);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ConceptTemplateCreateDto dto)
    {
        try
        {
            var template = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = template.Id }, template);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ConceptTemplateUpdateDto dto)
    {
        try
        {
            var template = await _service.UpdateAsync(id, dto);
            return Ok(template);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
