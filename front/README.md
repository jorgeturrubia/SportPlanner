# SportplannerFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.10.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Supabase integration (auth)

This project includes a minimal Supabase integration to perform authentication and pass the JWT to the backend API.

1) Configure your Supabase project info in `src/environments/environment.ts`:

```ts
export const environment = {
	production: false,
	supabaseUrl: 'https://<your-project>.supabase.co',
	supabaseKey: '<your-anon-or-service-role-key>',
	apiUrl: 'http://localhost:5269/api'
};
```

2) The key files created are:
- `src/app/services/supabase.service.ts` — wraps `@supabase/supabase-js` calls (signUp, signIn, signOut, session state)
- `src/app/services/auth.service.ts` — thin wrapper exposing `isAuthenticated` signal and convenience methods
- `src/app/interceptors/auth.interceptor.ts` — HTTP interceptor that adds `Authorization: Bearer <token>` to API calls to backend
- `src/app/services/user.service.ts` — example service that calls backend endpoint `api/auth/me`

3) How to use (examples from the console or components):

- Sign up
```ts
// inject AuthService and call
await authService.signUp('email@example.com', 'password123');
```
- Sign in
```ts
await authService.signIn('email@example.com', 'password123');
// authService.isAuthenticated() will be updated
```
- Call backend API that requires authentication
```ts
userService.me().subscribe((u) => console.log(u));
// The HTTP interceptor attaches the Supabase token automatically
```

If you prefer a different integration approach (e.g., storing tokens explicitly in localStorage, refreshing tokens in a custom flow, or using server-side authentication), we can extend the service to support that.

