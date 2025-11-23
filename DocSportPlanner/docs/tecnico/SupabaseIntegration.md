# Supabase Integration (Frontend + Backend)

This document describes how the frontend (Angular) and the backend (ASP.NET Core) integrate with Supabase for authentication.

Overview
--------
- Frontend manages authentication with Supabase (sign-in, sign-up) using the official `@supabase/supabase-js` client.
- Frontend sends the Supabase JWT in the `Authorization: Bearer <token>` header to the backend for protected API calls.
- Backend validates the JWT (JWKS) and maps claims to a local application `User` record using `IUserService`.

Configuration
-------------
1. Frontend env vars (edit `front/src/environments/environment.ts` and `environment.prod.ts`):
   - `supabaseUrl`: e.g. `https://<project>.supabase.co`
   - `supabaseKey`: the anon/public key (never use the service role key in the frontend)
   - `apiUrl`: e.g. `https://localhost:7146/api` (backend dev HTTPS)
  - `supabaseUrl`: e.g. `https://<project>.supabase.co` (set to your project URL)
  - `supabaseKey`: the anon/public key (never use the service role key in the frontend)

Example `front/src/environments/environment.ts`

```ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7146/api',
  supabaseUrl: 'https://uyvcgsjrqgzpsbptmqxp.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dmNnc2pycWd6cHNicHRtcXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTY3MTcsImV4cCI6MjA2NDgzMjcxN30.kTqCBlrvOrfeWu9e57DDLiToSPr_ZABUsKrlo5p-Nv8'
};
```

⚠️ DO NOT COMMIT `supabaseKey` or `service_role` keys in public repos. Use environment variables or CI secrets in production.
2. Backend appsettings (in `back/SportPlanner/appsettings.json` or environment variables):
  - `Supabase:Url` — Supabase project URL (ex: `https://yourproject.supabase.co`)
  - `Supabase:Key` — optional server key (anon key if used only for client-side requests or a `service_role` key for server admin operations). Do NOT commit production keys.
  - `Supabase:JwtSecret` — optional symmetric key used for local/integration testing (dev only); if not provided, the backend will perform JWKS discovery using `Supabase:Url`.
  - `ConnectionStrings:DefaultConnection` — PostgreSQL connection string the application uses to connect the database. E.g.: `User Id=postgres;Password=...; Server=...; Database=postgres;Port=5432`.

Authentication Flow (high-level)
-------------------------------
1. User signs in on the frontend (`supabase.auth.signInWithPassword`) and receives a session with `access_token` (JWT).
2. Frontend stores session (the Supabase client stores it) and the `AuthInterceptor` automatically sends the token to backend api calls targeting `<environment.apiUrl>`.
3. Backend's JwtBearer handler validates the token. If validation succeeds, the request's `User` will be populated with claims.
4. A middleware `AuthenticatedUserMiddleware` (run between `UseAuthentication()` and `UseAuthorization()`) resolves the application user using `IUserService.GetOrCreateUserFromClaimsAsync(User)` and attaches the result as `HttpContext.Items["AppUser"]`.
5. Controllers can access `HttpContext.Items["AppUser"]` to get the `UserDto` without additional DB lookups.

Testing (local)
---------------
1. Start backend (`dotnet run`), ensuring that `Properties/launchSettings.json` has the `https` binding on `https://localhost:7146`.
Environment variables for local dev (PowerShell):

```powershell
# Use environment variables if you prefer not to save secrets into `appsettings.Development.json`
$env:Supabase__Url = 'https://uyvcgsjrqgzpsbptmqxp.supabase.co'
$env:Supabase__Key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dmNnc2pycWd6cHNicHRtcXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTY3MTcsImV4cCI6MjA2NDgzMjcxN30.kTqCBlrvOrfeWu9e57DDLiToSPr_ZABUsKrlo5p-Nv8'
# If you have a JWT secret for local validation, set it like this:
$env:Supabase__JwtSecret = '<your-local-dev-jwt-secret>'
Recommended: keep secrets out of repo - use `dotnet user-secrets` for local dev or env vars in CI/CD. Example using `dotnet user-secrets`:

```powershell
cd back/SportPlanner
dotnet user-secrets init
dotnet user-secrets set "Supabase:JwtSecret" "<your-local-dev-jwt-secret>"
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "User Id=postgres;Password=<pw>;Server=..."
```

In CI/CD (e.g., GitHub Actions) set secrets via the repo Settings > Secrets, and pass them to the container/app using environment variables or the platform secret manager.

<#
PowerShell: set the DB connection string and allowed hosts via env vars
$env:ConnectionStrings__DefaultConnection = 'User Id=postgres.uyvcgsjrqgzpsbptmqxp;Password=Mercedes@2604.52;Server=aws-0-eu-west-3.pooler.supabase.com;Port=5432;Database=postgres;Timeout=60;Command Timeout=60'
$env:AllowedHosts = '*'
#>
```

⚠️ Security note: The `supabaseKey` you provided is typically the anon key meant for frontend usage. For server-side/privileged operations use the `service_role` key and store it securely (not in a committed file). Never commit `service_role` or other production secrets into source control.
2. Configure `front/src/environments/environment.ts` with `apiUrl: 'https://localhost:7146/api'`.
3. Start frontend `npm start` and use the Angular dev server.
4. Login with Supabase from the frontend. After login, try a protected endpoint (e.g. GET `api/auth/me`). The frontend logs will display the backend response if successful.

EF Core migrations (local)
-------------------------
If you want to create the DB schema locally and use EF Migrations, run the following (from the `back/SportPlanner` folder). This example uses the local dotnet-ef tool approach:

PowerShell commands:
```powershell
cd back/SportPlanner
dotnet new tool-manifest --force
dotnet tool install --local dotnet-ef --version 10.*
dotnet tool run dotnet-ef migrations add InitialCreate
dotnet tool run dotnet-ef database update
```

These commands will scaffold the table for `ApplicationUser` and apply it using the connection string in `appsettings.Development.json` (or env var overrides).

Security note: Do not commit migration artifacts with secrets. Use environment variables or a migration pipeline step in CI that reads secrets from the CI secret manager.

Security notes
--------------
- Do not commit production secrets to the repository. Use environment variables or a secure secrets manager.
- Use the Supabase anon key (not the service role key) on the frontend.
- JWTs are validated using JWKS from Supabase; a dev symmetric `Supabase:JwtSecret` may be used for integration tests.

Files added/modified for the integration
---------------------------------------
- Frontend:
  - `src/app/services/supabase.service.ts` — wrapper over Supabase client
  - `src/app/services/auth.service.ts` — exposes `isAuthenticated` and convenience methods
  - `src/app/interceptors/auth.interceptor.ts` — attach the `Authorization` header for backend API requests
  - `src/app/services/user.service.ts` — backend API client for `api/auth/me`
  - `src/environments/environment*.ts` — add Supabase and API configuration

- Backend:
  - `Program.cs`: Authentication config (JwtBearer), CORS and middleware registration
  - `Middleware/ApiExceptionMiddleware.cs`: global error normalization
  - `Middleware/AuthenticatedUserMiddleware.cs`: attach `UserDto` to `HttpContext.Items` after auth
    - Note: Middleware such as `AuthenticatedUserMiddleware` should not be registered in DI using `AddScoped`. Use `app.UseMiddleware<AuthenticatedUserMiddleware>()` so the framework injects the `RequestDelegate` correctly. If the middleware needs services, add them to the DI container and the middleware will receive them.
      - Note: Middleware constructors are invoked during pipeline build (startup) and therefore they **must not** accept scoped services. If you need a scoped service (like `IUserService`), either:
        1. Resolve it from `HttpContext.RequestServices` inside `InvokeAsync`, or
        2. Inject `IServiceProvider` and create a scope per request.

      Example: in the `AuthenticatedUserMiddleware`, resolve `IUserService` like:
      ```csharp
      var userService = context.RequestServices.GetRequiredService<IUserService>();
      ```
  - `Controllers/AuthController.cs` updated to prefer middleware-attached `UserDto`

Questions & Next Steps
---------------------
- If you want, I can add a small example login/register component in the Angular app to demonstrate the full flow visually.
 - If you want, I can add a small example login/register component in the Angular app to demonstrate the full flow visually.
 - I added a new middleware and a minimal `UserService` that maps JWT claims to a `UserDto` (stored in `HttpContext.Items["AppUser"]`). Replace this with EF repository if you want persisted users.
- Also recommended: add e2e tests which automate login via Supabase (or a test auth route) and verify the `api/auth/me` result.

---
_This document was added automatically during a Supabase integration implementation._
