using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ObjectiveCategoriesController : ControllerBase
{
    private readonly ILogger<ObjectiveCategoriesController> _logger;

    public ObjectiveCategoriesController(ILogger<ObjectiveCategoriesController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Get all objective categories
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ObjectiveCategoryDto>>> GetObjectiveCategories()
    {
        try
        {
            // For now, return hardcoded categories
            // TODO: Implement proper service when database is ready
            var categories = new List<ObjectiveCategoryDto>
            {
                new() { Id = 1, Name = "Técnica", Description = "Objetivos relacionados con la técnica deportiva" },
                new() { Id = 2, Name = "Física", Description = "Objetivos relacionados con el acondicionamiento físico" },
                new() { Id = 3, Name = "Táctica", Description = "Objetivos relacionados con la táctica de juego" },
                new() { Id = 4, Name = "Mental", Description = "Objetivos relacionados con el aspecto psicológico" },
                new() { Id = 5, Name = "Equipo", Description = "Objetivos relacionados con el trabajo en equipo" }
            };

            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting objective categories");
            return StatusCode(500, "An error occurred while retrieving objective categories");
        }
    }

    /// <summary>
    /// Get objective category by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ObjectiveCategoryDto>> GetObjectiveCategory(int id)
    {
        try
        {
            // For now, return hardcoded category
            // TODO: Implement proper service when database is ready
            var categories = new List<ObjectiveCategoryDto>
            {
                new() { Id = 1, Name = "Técnica", Description = "Objetivos relacionados con la técnica deportiva" },
                new() { Id = 2, Name = "Física", Description = "Objetivos relacionados con el acondicionamiento físico" },
                new() { Id = 3, Name = "Táctica", Description = "Objetivos relacionados con la táctica de juego" },
                new() { Id = 4, Name = "Mental", Description = "Objetivos relacionados con el aspecto psicológico" },
                new() { Id = 5, Name = "Equipo", Description = "Objetivos relacionados con el trabajo en equipo" }
            };

            var category = categories.FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return NotFound($"Objective category with ID {id} not found");
            }

            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting objective category {CategoryId}", id);
            return StatusCode(500, "An error occurred while retrieving the objective category");
        }
    }
}