using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExerciseCategoriesController : ControllerBase
{
    private readonly IExerciseCategoryService _exerciseCategoryService;

    public ExerciseCategoriesController(IExerciseCategoryService exerciseCategoryService)
    {
        _exerciseCategoryService = exerciseCategoryService;
    }

    /// <summary>
    /// Get all exercise categories
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExerciseCategoryDto>>> GetExerciseCategories()
    {
        var exerciseCategories = await _exerciseCategoryService.GetAllExerciseCategoriesAsync();
        return Ok(exerciseCategories);
    }

    /// <summary>
    /// Get exercise categories summary
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<IEnumerable<ExerciseCategorySummaryDto>>> GetExerciseCategoriesSummary()
    {
        var exerciseCategories = await _exerciseCategoryService.GetExerciseCategoriesSummaryAsync();
        return Ok(exerciseCategories);
    }

    /// <summary>
    /// Get exercise category by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ExerciseCategoryDto>> GetExerciseCategory(int id)
    {
        var exerciseCategory = await _exerciseCategoryService.GetExerciseCategoryByIdAsync(id);
        if (exerciseCategory == null)
        {
            return NotFound($"Exercise category with ID {id} not found.");
        }

        return Ok(exerciseCategory);
    }

    /// <summary>
    /// Create a new exercise category
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ExerciseCategoryDto>> CreateExerciseCategory([FromBody] CreateExerciseCategoryDto createExerciseCategoryDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var exerciseCategory = await _exerciseCategoryService.CreateExerciseCategoryAsync(createExerciseCategoryDto);
            return CreatedAtAction(nameof(GetExerciseCategory), new { id = exerciseCategory.Id }, exerciseCategory);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error creating exercise category: {ex.Message}");
        }
    }

    /// <summary>
    /// Update an existing exercise category
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ExerciseCategoryDto>> UpdateExerciseCategory(int id, [FromBody] UpdateExerciseCategoryDto updateExerciseCategoryDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var exerciseCategory = await _exerciseCategoryService.UpdateExerciseCategoryAsync(id, updateExerciseCategoryDto);
            if (exerciseCategory == null)
            {
                return NotFound($"Exercise category with ID {id} not found.");
            }

            return Ok(exerciseCategory);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error updating exercise category: {ex.Message}");
        }
    }

    /// <summary>
    /// Delete an exercise category (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteExerciseCategory(int id)
    {
        try
        {
            var result = await _exerciseCategoryService.DeleteExerciseCategoryAsync(id);
            if (!result)
            {
                return NotFound($"Exercise category with ID {id} not found.");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest($"Error deleting exercise category: {ex.Message}");
        }
    }

    /// <summary>
    /// Check if exercise category exists
    /// </summary>
    [HttpGet("{id}/exists")]
    public async Task<ActionResult<bool>> ExerciseCategoryExists(int id)
    {
        var exists = await _exerciseCategoryService.ExerciseCategoryExistsAsync(id);
        return Ok(exists);
    }
}