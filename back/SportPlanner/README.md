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

Notas:
- Protege tus credenciales: preferimos usar `appsettings.Development.json` o variables de entorno para las credenciales de DB.
- Si tienes problemas con versiones, asegúrate de usar la versión 8.x de los paquetes EF Core y del `dotnet-ef` para que sea compatible con `net8.0`.

