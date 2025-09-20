using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models.DTOs;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserContextService _userContextService;
    private readonly ILogger<UserController> _logger;

    public UserController(IUserContextService userContextService, ILogger<UserController> logger)
    {
        _userContextService = userContextService;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene la información completa del usuario actual desde la base de datos
    /// </summary>
    /// <returns>Información completa del usuario incluyendo OrganizationId</returns>
    [HttpGet("me")]
    public ActionResult<UserDto> GetCurrentUser()
    {
        try
        {
            var currentUser = _userContextService.GetCurrentUser();
            if (currentUser == null)
            {
                _logger.LogWarning("No se pudo obtener el usuario actual");
                return Unauthorized(new { message = "No se pudo determinar la información del usuario" });
            }

            _logger.LogInformation("Usuario actual obtenido: {UserId}, OrganizationId: {OrganizationId}", 
                currentUser.Id, currentUser.OrganizationId);
            
            return Ok(currentUser);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener la información del usuario actual");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
}