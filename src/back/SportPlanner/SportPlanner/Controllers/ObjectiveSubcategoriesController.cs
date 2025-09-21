using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ObjectiveSubcategoriesController : ControllerBase
{
    private readonly ILogger<ObjectiveSubcategoriesController> _logger;

    public ObjectiveSubcategoriesController(ILogger<ObjectiveSubcategoriesController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Get all objective subcategories
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ObjectiveSubcategoryDto>>> GetObjectiveSubcategories()
    {
        try
        {
            // For now, return hardcoded subcategories
            // TODO: Implement proper service when database is ready
            var subcategories = new List<ObjectiveSubcategoryDto>
            {
                // Técnica
                new() { Id = 1, Name = "Control del balón", ObjectiveCategoryId = 1 },
                new() { Id = 2, Name = "Pases", ObjectiveCategoryId = 1 },
                new() { Id = 3, Name = "Tiros", ObjectiveCategoryId = 1 },
                new() { Id = 4, Name = "Defensa", ObjectiveCategoryId = 1 },

                // Física
                new() { Id = 5, Name = "Resistencia", ObjectiveCategoryId = 2 },
                new() { Id = 6, Name = "Fuerza", ObjectiveCategoryId = 2 },
                new() { Id = 7, Name = "Velocidad", ObjectiveCategoryId = 2 },
                new() { Id = 8, Name = "Agilidad", ObjectiveCategoryId = 2 },

                // Táctica
                new() { Id = 9, Name = "Estrategia ofensiva", ObjectiveCategoryId = 3 },
                new() { Id = 10, Name = "Estrategia defensiva", ObjectiveCategoryId = 3 },
                new() { Id = 11, Name = "Posicionamiento", ObjectiveCategoryId = 3 },

                // Mental
                new() { Id = 12, Name = "Concentración", ObjectiveCategoryId = 4 },
                new() { Id = 13, Name = "Motivación", ObjectiveCategoryId = 4 },
                new() { Id = 14, Name = "Confianza", ObjectiveCategoryId = 4 },

                // Equipo
                new() { Id = 15, Name = "Comunicación", ObjectiveCategoryId = 5 },
                new() { Id = 16, Name = "Trabajo en equipo", ObjectiveCategoryId = 5 },
                new() { Id = 17, Name = "Liderazgo", ObjectiveCategoryId = 5 }
            };

            return Ok(subcategories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting objective subcategories");
            return StatusCode(500, "An error occurred while retrieving objective subcategories");
        }
    }

    /// <summary>
    /// Get objective subcategories by category ID
    /// </summary>
    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<IEnumerable<ObjectiveSubcategoryDto>>> GetObjectiveSubcategoriesByCategory(int categoryId)
    {
        try
        {
            // For now, return hardcoded subcategories filtered by category
            // TODO: Implement proper service when database is ready
            var allSubcategories = new List<ObjectiveSubcategoryDto>
            {
                // Técnica
                new() { Id = 1, Name = "Control del balón", ObjectiveCategoryId = 1 },
                new() { Id = 2, Name = "Pases", ObjectiveCategoryId = 1 },
                new() { Id = 3, Name = "Tiros", ObjectiveCategoryId = 1 },
                new() { Id = 4, Name = "Defensa", ObjectiveCategoryId = 1 },

                // Física
                new() { Id = 5, Name = "Resistencia", ObjectiveCategoryId = 2 },
                new() { Id = 6, Name = "Fuerza", ObjectiveCategoryId = 2 },
                new() { Id = 7, Name = "Velocidad", ObjectiveCategoryId = 2 },
                new() { Id = 8, Name = "Agilidad", ObjectiveCategoryId = 2 },

                // Táctica
                new() { Id = 9, Name = "Estrategia ofensiva", ObjectiveCategoryId = 3 },
                new() { Id = 10, Name = "Estrategia defensiva", ObjectiveCategoryId = 3 },
                new() { Id = 11, Name = "Posicionamiento", ObjectiveCategoryId = 3 },

                // Mental
                new() { Id = 12, Name = "Concentración", ObjectiveCategoryId = 4 },
                new() { Id = 13, Name = "Motivación", ObjectiveCategoryId = 4 },
                new() { Id = 14, Name = "Confianza", ObjectiveCategoryId = 4 },

                // Equipo
                new() { Id = 15, Name = "Comunicación", ObjectiveCategoryId = 5 },
                new() { Id = 16, Name = "Trabajo en equipo", ObjectiveCategoryId = 5 },
                new() { Id = 17, Name = "Liderazgo", ObjectiveCategoryId = 5 }
            };

            var subcategories = allSubcategories.Where(s => s.ObjectiveCategoryId == categoryId).ToList();
            return Ok(subcategories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting objective subcategories for category {CategoryId}", categoryId);
            return StatusCode(500, "An error occurred while retrieving objective subcategories");
        }
    }

    /// <summary>
    /// Get objective subcategory by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ObjectiveSubcategoryDto>> GetObjectiveSubcategory(int id)
    {
        try
        {
            // For now, return hardcoded subcategory
            // TODO: Implement proper service when database is ready
            var allSubcategories = new List<ObjectiveSubcategoryDto>
            {
                // Técnica
                new() { Id = 1, Name = "Control del balón", ObjectiveCategoryId = 1 },
                new() { Id = 2, Name = "Pases", ObjectiveCategoryId = 1 },
                new() { Id = 3, Name = "Tiros", ObjectiveCategoryId = 1 },
                new() { Id = 4, Name = "Defensa", ObjectiveCategoryId = 1 },

                // Física
                new() { Id = 5, Name = "Resistencia", ObjectiveCategoryId = 2 },
                new() { Id = 6, Name = "Fuerza", ObjectiveCategoryId = 2 },
                new() { Id = 7, Name = "Velocidad", ObjectiveCategoryId = 2 },
                new() { Id = 8, Name = "Agilidad", ObjectiveCategoryId = 2 },

                // Táctica
                new() { Id = 9, Name = "Estrategia ofensiva", ObjectiveCategoryId = 3 },
                new() { Id = 10, Name = "Estrategia defensiva", ObjectiveCategoryId = 3 },
                new() { Id = 11, Name = "Posicionamiento", ObjectiveCategoryId = 3 },

                // Mental
                new() { Id = 12, Name = "Concentración", ObjectiveCategoryId = 4 },
                new() { Id = 13, Name = "Motivación", ObjectiveCategoryId = 4 },
                new() { Id = 14, Name = "Confianza", ObjectiveCategoryId = 4 },

                // Equipo
                new() { Id = 15, Name = "Comunicación", ObjectiveCategoryId = 5 },
                new() { Id = 16, Name = "Trabajo en equipo", ObjectiveCategoryId = 5 },
                new() { Id = 17, Name = "Liderazgo", ObjectiveCategoryId = 5 }
            };

            var subcategory = allSubcategories.FirstOrDefault(s => s.Id == id);
            if (subcategory == null)
            {
                return NotFound($"Objective subcategory with ID {id} not found");
            }

            return Ok(subcategory);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting objective subcategory {SubcategoryId}", id);
            return StatusCode(500, "An error occurred while retrieving the objective subcategory");
        }
    }
}