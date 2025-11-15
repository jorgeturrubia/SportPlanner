# SportPlanner Backend

This backend targets **.NET 10** (net10.0). Ensure you have the .NET 10 SDK installed to build and run this project.

## Supabase authentication setup

To make backend endpoints accept and validate Supabase JWTs (sent from the frontend in the Authorization header):

1. Configure your development environment: `appsettings.Development.json` or environment variables.
   - `Supabase:Url`: `https://<your-project>.supabase.co`
   - `Supabase:JwtSecret` (optional): symmetric JWT secret for local integration tests (DO NOT commit real secrets)

2. Add the Authorization header from the frontend when calling the API:
   - `Authorization: Bearer <access_token>`

3. Check that `Program.cs` registers JwtBearer authentication and a middleware called `AuthenticatedUserMiddleware`.
   - The middleware will call a service that maps the JWT claims into an application user and attaches it as `HttpContext.Items["AppUser"]`.

4. Use `[Authorize]` on controllers and access `HttpContext.Items["AppUser"]` or `User` to inspect claims.

## Database (EF Core)

This backend uses EF Core with Npgsql to persist application users. By default, the context uses `ConnectionStrings:DefaultConnection` in `appsettings.Development.json` or its environment variable.

Local dev: create and apply migrations
```powershell
cd back/SportPlanner
dotnet new tool-manifest --force
dotnet tool install --local dotnet-ef --version 10.*
dotnet tool run dotnet-ef migrations add InitialCreate
dotnet tool run dotnet-ef database update
```

The project includes a minimal `ApplicationUser` entity and a service that maps JWT `sub` and user claims into a local user persisted in the DB. Replace or extend the model as needed.

## Minimal testing

- Start backend: `dotnet run --project back/SportPlanner`
- Start frontend and login with Supabase.
- Call `GET https://localhost:7146/api/auth/me` with the `Authorization` header.

## CORS (development)

If you're calling the backend from the frontend running on `http://localhost:4200`, make sure the backend allows the frontend's origin for CORS. The project includes a development CORS policy named `AllowLocalhostFrontend` in `Program.cs` configured to allow:

- http://localhost:4200
- http://127.0.0.1:4200
- https://localhost:4200

Make sure you restart the backend after modifying `Program.cs` so the new policy takes effect. To verify CORS manually:

```powershell
# Start backend
cd back/SportPlanner
dotnet run --launch-profile https

# Send a preflight (OPTIONS) request from the terminal
curl -i -X OPTIONS "https://localhost:7152/api/auth/me" -H "Origin: http://localhost:4200" -H "Access-Control-Request-Method: GET" -k

# The response should include Access-Control-Allow-Origin: http://localhost:4200
``` 

The endpoint returns the mapped user DTO or a fallback claims JSON if mapping is not configured.

**NOTE:** For production, prefer using JWKS with `supabaseUrl` discovery rather than using the symmetric `JwtSecret`. Keep secrets in environment variables or a secure vault.
