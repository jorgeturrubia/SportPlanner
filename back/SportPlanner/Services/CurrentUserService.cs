using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

/// <summary>
/// Implementación del servicio de acceso al usuario actual autenticado.
/// Lee información del HttpContext.User (claims del JWT).
/// </summary>
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly AppDbContext _db;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor, AppDbContext db)
    {
        _httpContextAccessor = httpContextAccessor;
        _db = db;
    }

    /// <summary>
    /// Obtiene el ID del usuario del claim 'sub' o NameIdentifier.
    /// </summary>
    public string? UserId
    {
        get
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user?.Identity?.IsAuthenticated != true)
                return null;

            return user.FindFirst("sub")?.Value 
                ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }

    /// <summary>
    /// Obtiene el rol del usuario del claim 'role' (ClaimTypes.Role).
    /// </summary>
    public string? Role
    {
        get
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user?.Identity?.IsAuthenticated != true)
                return null;

            return user.FindFirst(ClaimTypes.Role)?.Value;
        }
    }

    /// <summary>
    /// Verifica si el usuario actual tiene el rol especificado.
    /// </summary>
    public bool IsInRole(string role)
    {
        if (string.IsNullOrEmpty(role) || string.IsNullOrEmpty(Role))
            return false;

        return Role.Equals(role, StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Verifica si el usuario tiene una suscripción activa consultando la BD.
    /// Utiliza una caché temporal en el contexto de la solicitud para evitar múltiples queries.
    /// </summary>
    public bool HasActiveSubscription
    {
        get
        {
            if (string.IsNullOrEmpty(UserId))
                return false;

            var context = _httpContextAccessor.HttpContext;
            if (context == null)
                return false;

            // Usar cache en HttpContext.Items para evitar múltiples queries en la misma request
            const string cacheKey = "CurrentUser_HasActiveSubscription";
            
            if (context.Items.TryGetValue(cacheKey, out var cachedValue) && cachedValue is bool cached)
            {
                return cached;
            }

            // Consultar BD
            var hasSubscription = _db.Subscriptions
                .Any(s => s.UserSupabaseId == UserId && s.IsActive);

            context.Items[cacheKey] = hasSubscription;
            return hasSubscription;
        }
    }
}
