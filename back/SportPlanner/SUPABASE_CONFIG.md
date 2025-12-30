# Configuración de Supabase para RBAC

Para que el sistema RBAC funcione correctamente, es necesario agregar la siguiente configuración a tu archivo `appsettings.Development.json` (o `appsettings.json`):

```json
{
  "Supabase": {
    "Url": "https://your-project-ref.supabase.co",
    "JwtSecret": "your-jwt-secret-from-supabase-dashboard",
    "ServiceRoleKey": "your-service-role-key-from-supabase-dashboard"
  }
}
```

## Dónde obtener las claves:

1. **ServiceRoleKey**: 
   - Ve a tu proyecto en Supabase Dashboard
   - Settings → API
   - Copia la clave "service_role" (⚠️ NUNCA expongas esta clave públicamente)

2. **JwtSecret**:
   - Settings → API
   - JWT Settings → JWT Secret

## Seguridad:

⚠️ **IMPORTANTE**: La `ServiceRoleKey` es una clave con permisos de administrador completo.
- **NUNCA** la incluyas en el código fuente
- **NUNCA** la expongas en el frontend
- En producción, usa Azure Key Vault o variables de entorno seguras
- El archivo `appsettings.Development.json` ya está en `.gitignore`
