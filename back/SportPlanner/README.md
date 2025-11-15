# SportPlanner Backend

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

## Minimal testing

- Start backend: `dotnet run --project back/SportPlanner`
- Start frontend and login with Supabase.
- Call `GET https://localhost:7146/api/auth/me` with the `Authorization` header.

The endpoint returns the mapped user DTO or a fallback claims JSON if mapping is not configured.

**NOTE:** For production, prefer using JWKS with `supabaseUrl` discovery rather than using the symmetric `JwtSecret`. Keep secrets in environment variables or a secure vault.
