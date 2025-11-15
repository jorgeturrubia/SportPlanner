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

2. Backend appsettings (in `back/SportPlanner/appsettings.json` or environment variables):
   - `Supabase:Url` — Supabase project URL
   - `Supabase:Key` — optional frontend key
   - `Supabase:JwtSecret` — optional symmetric key for local dev/test; if not provided, JWKS from Supabase will be used

Authentication Flow (high-level)
-------------------------------
1. User signs in on the frontend (`supabase.auth.signInWithPassword`) and receives a session with `access_token` (JWT).
2. Frontend stores session (the Supabase client stores it) and the `AuthInterceptor` automatically sends the token to backend api calls targeting `<environment.apiUrl>`.
3. Backend's JwtBearer handler validates the token. If validation succeeds, the request's `User` will be populated with claims.
4. `AuthenticatedUserMiddleware` (run between `UseAuthentication()` and `UseAuthorization()`) resolves the application user using `IUserService.GetOrCreateUserFromClaimsAsync(User)` and attaches the result as `HttpContext.Items["AppUser"]`.
5. Controllers can access `HttpContext.Items["AppUser"]` to get the `UserDto` without additional DB lookups.

Testing (local)
---------------
1. Start backend (`dotnet run`), ensuring that `Properties/launchSettings.json` has the `https` binding on `https://localhost:7146`.
2. Configure `front/src/environments/environment.ts` with `apiUrl: 'https://localhost:7146/api'`.
3. Start frontend `npm start` and use the Angular dev server.
4. Login with Supabase from the frontend. After login, try a protected endpoint (e.g. GET `api/auth/me`). The frontend logs will display the backend response if successful.

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
  - `Program.cs`: Authentication config, CORS and middleware registration
  - `Middleware/ApiExceptionMiddleware.cs`: global error normalization
  - `Middleware/AuthenticatedUserMiddleware.cs`: attach `UserDto` to `HttpContext.Items` after auth
  - `Controllers/AuthController.cs` updated to prefer middleware-attached `UserDto`

Questions & Next Steps
---------------------
- If you want, I can add a small example login/register component in the Angular app to demonstrate the full flow visually.
- Also recommended: add e2e tests which automate login via Supabase (or a test auth route) and verify the `api/auth/me` result.

---
_This document was added automatically during a Supabase integration implementation._
