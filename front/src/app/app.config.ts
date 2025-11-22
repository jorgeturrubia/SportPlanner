import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';

import { authGuard } from './guards/auth.guard';
import { subscriptionGuard } from './guards/subscription.guard';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { notificationInterceptor } from './interceptors/notification.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([notificationInterceptor])
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // Provide configuration for TranslateHttpLoader
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json'
      }
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader
        }
      })
    ),
    provideRouter([
      { path: '', redirectTo: '/landing', pathMatch: 'full' },
      { path: 'landing', loadComponent: () => import('./features/landing/landing').then(m => m.LandingComponent) },
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
      { path: 'subscription', loadComponent: () => import('./features/subscription/subscription.component').then(m => m.SubscriptionComponent), canActivate: [authGuard] },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard, subscriptionGuard],
        children: [
          { path: '', loadComponent: () => import('./features/dashboard/pages/home/home.component').then(m => m.HomeComponent) },
          { path: 'teams', loadComponent: () => import('./features/dashboard/pages/teams/teams.component').then(m => m.TeamsComponent) },
          { path: 'plannings', loadComponent: () => import('./features/dashboard/pages/plannings/plannings.component').then(m => m.PlanningsComponent) },
          { path: 'plannings/view/:id', loadComponent: () => import('./features/dashboard/pages/planning-details/planning-details.component').then(m => m.PlanningDetailsComponent) },
          { path: 'teams/planning/:teamId', loadComponent: () => import('./features/dashboard/pages/team-planning/team-planning.component').then(m => m.TeamPlanningComponent) },
          { path: 'teams/planning/:teamId/edit/:scheduleId', loadComponent: () => import('./features/dashboard/pages/team-planning/team-planning.component').then(m => m.TeamPlanningComponent) },
          { path: 'master-user/sport-concepts', loadComponent: () => import('./features/dashboard/pages/master-user/sport-concepts/sport-concepts.component').then(m => m.SportConceptsComponent) },
          { path: 'master-user/concept-categories', loadComponent: () => import('./features/dashboard/pages/master-user/concept-categories/concept-categories.component').then(m => m.ConceptCategoriesComponent) },
          { path: 'core-masters/subscription-sports', loadComponent: () => import('./features/dashboard/pages/core-masters/subscription-sports/subscription-sports.component').then(m => m.SubscriptionSportsComponent) }
        ]
      }
    ])
  ]
};
