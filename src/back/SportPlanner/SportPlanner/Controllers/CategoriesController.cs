using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    private readonly ISportService _sportService;

    public CategoriesController(ICategoryService categoryService, ISportService sportService)
    {
        _categoryService = categoryService;
        _sportService = sportService;
    }

    /// <summary>
    /// Get all categories
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var categories = await _categoryService.GetAllCategoriesAsync();
        return Ok(categories);
    }

    /// <summary>
    /// Get categories by sport ID
    /// </summary>
    [HttpGet("sport/{sportId}")]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategoriesBySport(int sportId)
    {
        var sportExists = await _sportService.SportExistsAsync(sportId);
        if (!sportExists)
        {
            return NotFound($"Sport with ID {sportId} not found.");
        }

        var categories = await _categoryService.GetCategoriesBySportAsync(sportId);
        return Ok(categories);
    }

    /// <summary>
    /// Get categories summary
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<IEnumerable<CategorySummaryDto>>> GetCategoriesSummary()
    {
        var categories = await _categoryService.GetCategoriesSummaryAsync();
        return Ok(categories);
    }

    /// <summary>
    /// Get category by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);
        if (category == null)
        {
            return NotFound($"Category with ID {id} not found.");
        }

        return Ok(category);
    }

    /// <summary>
    /// Create a new category
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto createCategoryDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var sportExists = await _sportService.SportExistsAsync(createCategoryDto.SportId);
        if (!sportExists)
        {
            return BadRequest($"Sport with ID {createCategoryDto.SportId} not found.");
        }

        try
        {
            var category = await _categoryService.CreateCategoryAsync(createCategoryDto);
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error creating category: {ex.Message}");
        }
    }

    /// <summary>
    /// Update an existing category
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<CategoryDto>> UpdateCategory(int id, [FromBody] UpdateCategoryDto updateCategoryDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var sportExists = await _sportService.SportExistsAsync(updateCategoryDto.SportId);
        if (!sportExists)
        {
            return BadRequest($"Sport with ID {updateCategoryDto.SportId} not found.");
        }

        try
        {
            var category = await _categoryService.UpdateCategoryAsync(id, updateCategoryDto);
            if (category == null)
            {
                return NotFound($"Category with ID {id} not found.");
            }

            return Ok(category);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error updating category: {ex.Message}");
        }
    }

    /// <summary>
    /// Delete a category (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        try
        {
            var result = await _categoryService.DeleteCategoryAsync(id);
            if (!result)
            {
                return NotFound($"Category with ID {id} not found.");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest($"Error deleting category: {ex.Message}");
        }
    }

    /// <summary>
    /// Check if category exists
    /// </summary>
    [HttpGet("{id}/exists")]
    public async Task<ActionResult<bool>> CategoryExists(int id)
    {
        var exists = await _categoryService.CategoryExistsAsync(id);
        return Ok(exists);
    }
}