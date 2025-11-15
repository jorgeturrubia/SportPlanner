# SportPlanner (Backend)

Proyecto ASP.NET Core Web API (no-minimal API) en .NET 8.

Cómo ejecutar localmente:

1. Instalar .NET SDK 8.0
2. Ejecutar desde la carpeta del backend:

```powershell
cd DocSportPlanner\src\back\SportPlanner
dotnet build
dotnet run
```

Endpoint de ejemplo:
- GET /api/WeatherForecast (devuelve un array con 5 muestras)

- Estructura inicial:
- Controllers/
- Models/
- Services/
- Repositories/
- Data/

Este proyecto fue creado por un asistente para garantizar que la API use controllers y no minimal APIs.

Migrations y EF Core (PostgreSQL)
-------------------------------

Este backend usa EF Core con el proveedor Npgsql para PostgreSQL. Se han añadido los paquetes necesarios y el CLI de EF Core (local tool) para .NET 8.

Instalación y uso rápido:

1. (si no está creado) crear el manifiesto de herramientas locales e instalar dotnet-ef en la carpeta del backend:

```powershell
cd c:\Proyectos\SportPlanner\back\SportPlanner
dotnet new tool-manifest --force
dotnet tool install --local dotnet-ef --version 8.*
```

2. Crear una migración inicial (ejecutar desde la carpeta del proyecto donde está el .csproj):

```powershell
dotnet tool run dotnet-ef migrations add InitialCreate
```

3. Aplicar la migración y crear la base de datos (usando la cadena de conexión en `appsettings.json` o estableciendo la variable de entorno `ConnectionStrings__DefaultConnection`):

```powershell
dotnet tool run dotnet-ef database update
```

4. Registro de DbContext en `Program.cs` ya se configura para usar `ConnectionStrings:DefaultConnection`.

Importante:
- No se utiliza una cadena de conexión 'hard-coded' en el código. Si `ConnectionStrings:DefaultConnection` no está presente, el arranque de la aplicación lanzará una excepción para evitar usar credenciales en código fuente.
- Usa `appsettings.Development.json` o variables de entorno para sobrescribir la cadena de conexión en local (ejemplo Windows PowerShell):

```powershell
$env:ConnectionStrings__DefaultConnection = "Host=localhost;Database=sportplanner;Username=postgres;Password=postgres"
```

Notas:
- Protege tus credenciales: preferimos usar `appsettings.Development.json` o variables de entorno para las credenciales de DB.
- Si tienes problemas con versiones, asegúrate de usar la versión 8.x de los paquetes EF Core y del `dotnet-ef` para que sea compatible con `net8.0`.

Authentication and Supabase integration
-------------------------------------

This backend supports authentication using Supabase (JWT validation) and automatically creates or loads a local application user based on the claims included in the JWT.

Config values (set these values in `appsettings.Development.json` or as environment variables):

- `Supabase:Url` — your Supabase project URL, e.g. `https://xyz.supabase.co`.
- `Supabase:Key` — the public/anon key used by the frontend (if needed).
- `Supabase:JwtSecret` — optional symmetric key used for JWT validation in local development or tests (if you don't use JWKS).

The project reads the configuration keys from `Supabase:Url` and `Supabase:JwtSecret`. If an OpenID Connect JWKS URI is available (from Supabase), the API will validate tokens using the JWKS endpoint.

CORS and frontend development
----------------------------
The solution includes a `LocalDevCorsPolicy` that allows common local dev origins such as `http://localhost:4200` (Angular dev server). You may extend the allowed origins in `Program.cs` if you use a different dev host or port.

Dev HTTPS endpoint
-------------------
The API is configured for a local HTTPS binding at `https://localhost:7146` in `Properties/launchSettings.json`. This is a handy endpoint to test SSL/HTTPS calls from the frontend. Use the `https` profile when debugging or in CI if required.

Testing auth endpoints
---------------------
Use the `api/auth/me` endpoint to verify that authentication and user creation works correctly. The endpoint requires a valid Supabase JWT in an `Authorization: Bearer <token>` header. The backend will attempt to create an application user if the user does not already exist (based on the `sub` claim).

Example (replace `<token>`):

```powershell
curl -H "Authorization: Bearer <token>" "https://localhost:7146/api/auth/me"
```

If the token is invalid or missing, `401 Unauthorized` is returned.

Middleware
----------
Two middlewares are included to enhance request handling and auth integration:

- `ApiExceptionMiddleware` — global error handler that returns JSON errors and logs unexpected exceptions.
- `AuthenticatedUserMiddleware` — after authentication, the middleware resolves the application-level `UserDto` from claims and attaches it to `HttpContext.Items["AppUser"]`. Controllers can use this pre-resolved value to avoid unnecessary DB lookups.


