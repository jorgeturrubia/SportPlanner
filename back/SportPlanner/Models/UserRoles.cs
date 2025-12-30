namespace SportPlanner.Models;

/// <summary>
/// Constantes para los roles del sistema RBAC.
/// Estos roles se almacenan en Supabase app_metadata y se validan a través de JWT claims.
/// </summary>
public static class UserRoles
{
    /// <summary>
    /// Propietario/SuperAdmin de la plataforma. Acceso completo a todo el sistema,
    /// incluyendo la creación y gestión de contenido del sistema (IsSystem = true).
    /// </summary>
    public const string AdminOwner = "AdminOwner";

    /// <summary>
    /// Usuario estándar con suscripción activa (Entrenador).
    /// Puede gestionar su propio contenido privado y visualizar contenido del sistema.
    /// </summary>
    public const string Coach = "Coach";

    /// <summary>
    /// Usuario registrado sin suscripción activa.
    /// Acceso limitado hasta que adquiera una suscripción.
    /// </summary>
    public const string NoRole = "NoRole";
}
