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
    private readonly ICurrentUserService _currentUser;

    public ConceptCategoriesController(IConceptCategoryService service, IMapper mapper, ICurrentUserService currentUser)
    {
        _service = service;
        _mapper = mapper;
        _currentUser = currentUser;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
    {
        var categories = await _service.GetAllAsync(includeInactive, _currentUser.UserId);
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
        dto.OwnerId = _currentUser.UserId;
        dto.IsSystem = _currentUser.IsInRole(Models.UserRoles.AdminOwner);

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
