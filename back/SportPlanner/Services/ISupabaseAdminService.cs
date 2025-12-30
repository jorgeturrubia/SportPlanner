namespace SportPlanner.Services;

/// <summary>
/// Servicio para administrar usuarios de Supabase usando la API de Admin.
/// Requiere SERVICE_ROLE_KEY para realizar operaciones privilegiadas.
/// </summary>
public interface ISupabaseAdminService
{
    /// <summary>
    /// Actualiza el rol del usuario en Supabase app_metadata.
    /// </summary>
    /// <param name="userId">ID del usuario de Supabase (UUID).</param>
    /// <param name="role">Nueva rol a asignar (usar constantes de UserRoles).</param>
    /// <returns>True si la actualización fue exitosa.</returns>
    Task<bool> UpdateUserRoleAsync(string userId, string role);
}
