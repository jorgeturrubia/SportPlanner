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
          { path: 'teams/planning/:teamId/edit/:planningId', loadComponent: () => import('./features/dashboard/pages/team-planning/team-planning.component').then(m => m.TeamPlanningComponent) },
          {
            path: 'teams/management/:id',
            loadComponent: () => import('./features/dashboard/pages/team-management/team-management.component').then(m => m.TeamManagementComponent),
            children: [
              { path: '', redirectTo: 'plannings', pathMatch: 'full' },
              { path: 'plannings', loadComponent: () => import('./features/dashboard/pages/plannings/plannings.component').then(m => m.PlanningsComponent) },
              { path: 'sessions', loadComponent: () => import('./features/dashboard/pages/trainings/trainings.component').then(m => m.TrainingsComponent) },
              // Placeholders for now, can be replaced with real components later or point to "Coming Soon"
              { path: 'calendar', loadComponent: () => import('./features/dashboard/pages/calendar/calendar.component').then(m => m.CalendarComponent) },
              { path: 'players', loadComponent: () => import('./features/dashboard/pages/plannings/plannings.component').then(m => m.PlanningsComponent) }  // Using plannings as temporary placeholder
            ]
          },
          { path: 'master-user/sport-concepts', loadComponent: () => import('./features/dashboard/pages/master-user/sport-concepts/sport-concepts.component').then(m => m.SportConceptsComponent) },
          { path: 'master-user/concept-categories', loadComponent: () => import('./features/dashboard/pages/master-user/concept-categories/concept-categories.component').then(m => m.ConceptCategoriesComponent) },
          { path: 'master-user/seasons', loadComponent: () => import('./features/dashboard/pages/master-user/seasons/seasons.component').then(m => m.SeasonsComponent) },
          { path: 'core-masters/subscription-sports', loadComponent: () => import('./features/dashboard/pages/core-masters/subscription-sports/subscription-sports.component').then(m => m.SubscriptionSportsComponent) },
          { path: 'plannings/info', loadComponent: () => import('./features/dashboard/pages/plan-info/plan-info.component').then(m => m.PlanInfoComponent) },
          { path: 'plannings/info/:id', loadComponent: () => import('./features/dashboard/pages/plan-info/plan-info.component').then(m => m.PlanInfoComponent) },
          { path: 'marketplace', loadComponent: () => import('./features/marketplace/marketplace.component').then(m => m.MarketplaceComponent) },
          { path: 'itineraries', loadComponent: () => import('./features/dashboard/pages/itineraries/itinerary-list/itinerary-list.component').then(m => m.ItineraryListComponent) },
          { path: 'itineraries/create', loadComponent: () => import('./features/dashboard/pages/itineraries/itinerary-form/itinerary-form.component').then(m => m.ItineraryFormComponent) },
          { path: 'itineraries/:id/edit', loadComponent: () => import('./features/dashboard/pages/itineraries/itinerary-form/itinerary-form.component').then(m => m.ItineraryFormComponent) },
          { path: 'my-templates', loadComponent: () => import('./features/planning-templates/template-list/template-list.component').then(m => m.PlanningTemplateListComponent) },
          { path: 'my-templates/create', loadComponent: () => import('./features/planning-templates/template-form/template-form.component').then(m => m.TemplateFormComponent) },
          { path: 'my-templates/:id/edit', loadComponent: () => import('./features/planning-templates/template-form/template-form.component').then(m => m.TemplateFormComponent) },
          { path: 'my-templates/:id/concepts', loadComponent: () => import('./features/planning-templates/template-concepts/template-concepts.component').then(m => m.TemplateConceptsComponent) },
          { path: 'proposals', loadChildren: () => import('./features/proposals/proposals.routes').then(m => m.PROPOSALS_ROUTES) },
          { path: 'trainings', loadChildren: () => import('./features/dashboard/pages/trainings/trainings.routes').then(m => m.TRAININGS_ROUTES) }
        ]
      }
    ])
  ]
};
