import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    canActivate: [guestGuard],
    title: 'PlanSport - Planifica tu temporada deportiva como un profesional'
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent),
    canActivate: [guestGuard],
    title: 'Autenticación - PlanSport'
  },
  // Authenticated routes with layout
  {
    path: '',
    loadComponent: () => import('./shared/layouts/authenticated-layout/authenticated-layout.component').then(m => m.AuthenticatedLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard-content.component').then(m => m.DashboardContentComponent),
        title: 'Dashboard - PlanSport'
      },
      {
        path: 'teams',
        loadComponent: () => import('./pages/teams/teams-page.component').then(m => m.TeamsPageComponent),
        title: 'Gestión de Equipos - PlanSport'
      },
      {
        path: 'objectives',
        loadComponent: () => import('./pages/objectives/objectives-page.component').then(m => m.ObjectivesPageComponent),
        title: 'Objetivos - PlanSport'
      },
      {
        path: 'exercises',
        loadComponent: () => import('./pages/exercises/exercises-page.component').then(m => m.ExercisesPageComponent),
        title: 'Ejercicios - PlanSport'
      },
      {
        path: 'planning',
        loadComponent: () => import('./pages/planning/planning-page.component').then(m => m.PlanningPageComponent),
        title: 'Planificación - PlanSport'
      },
      {
        path: 'training',
        loadComponent: () => import('./pages/dashboard/dashboard-content.component').then(m => m.DashboardContentComponent),
        title: 'Entrenamientos - PlanSport'
      },
      {
        path: 'marketplace',
        loadComponent: () => import('./pages/dashboard/dashboard-content.component').then(m => m.DashboardContentComponent),
        title: 'Marketplace - PlanSport'
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/dashboard/dashboard-content.component').then(m => m.DashboardContentComponent),
        title: 'Perfil - PlanSport'
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/dashboard/dashboard-content.component').then(m => m.DashboardContentComponent),
        title: 'Configuración - PlanSport'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
