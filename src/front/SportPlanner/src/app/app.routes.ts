import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'SportPlanner - Organiza el Deporte Como Nunca Antes'
  },
  {
    path: 'test',
    loadComponent: () => import('./test/test.component').then(m => m.TestComponent),
    title: 'Test - Hello World'
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent),
    canActivate: [guestGuard],
    title: 'SportPlanner - Iniciar Sesión'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'SportPlanner - Dashboard'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
