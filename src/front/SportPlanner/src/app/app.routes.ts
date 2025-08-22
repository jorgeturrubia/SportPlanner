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
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard - PlanSport'
  },
  {
    path: 'teams',
    loadComponent: () => import('./pages/teams/teams-page.component').then(m => m.TeamsPageComponent),
    canActivate: [authGuard],
    title: 'Gestión de Equipos - PlanSport'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
