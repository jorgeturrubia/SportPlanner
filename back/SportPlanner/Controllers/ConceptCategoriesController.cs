using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConceptCategoriesController : ControllerBase
{
    private readonly IConceptCategoryService _service;
    private readonly IMapper _mapper;

    public ConceptCategoriesController(IConceptCategoryService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _service.GetAllAsync();
        var result = _mapper.Map<List<ConceptCategoryDto>>(categories);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _service.GetByIdAsync(id);
        if (category == null) return NotFound();
        var result = _mapper.Map<ConceptCategoryDto>(category);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateConceptCategoryDto dto)
    {
        var category = await _service.CreateAsync(dto);
        var result = _mapper.Map<ConceptCategoryDto>(category);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateConceptCategoryDto dto)
    {
        try
        {
            var category = await _service.UpdateAsync(id, dto);
            var result = _mapper.Map<ConceptCategoryDto>(category);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
