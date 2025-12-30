namespace SportPlanner.Services;

/// <summary>
/// Servicio para acceder a la información del usuario autenticado actual.
/// Proporciona acceso centralizado a UserId, Role y estado de suscripción.
/// </summary>
public interface ICurrentUserService
{
    /// <summary>
    /// ID del usuario autenticado (Supabase UID extraído del claim 'sub').
    /// </summary>
    string? UserId { get; }

    /// <summary>
    /// Rol del usuario autenticado (extraído del claim 'role').
    /// </summary>
    string? Role { get; }

    /// <summary>
    /// Verifica si el usuario actual tiene el rol especificado.
    /// </summary>
    /// <param name="role">Nombre del rol a verificar (usar constantes de UserRoles).</param>
    /// <returns>True si el usuario tiene el rol especificado.</returns>
    bool IsInRole(string role);

    /// <summary>
    /// Indica si el usuario tiene una suscripción activa.
    /// </summary>
    bool HasActiveSubscription { get; }
}
