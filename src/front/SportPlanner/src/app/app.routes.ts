import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard } from './guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/landing/landing-page.component').then(m => m.LandingPageComponent),
    title: 'SportPlanner - Planifica tu entrenamiento'
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth-layout.component').then(m => m.AuthLayoutComponent),
    canActivate: [GuestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent),
        title: 'Iniciar Sesión - SportPlanner'
      },
      {
        path: 'register',
        loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent),
        title: 'Registrarse - SportPlanner'
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./components/dashboard/home.component').then(m => m.HomeComponent),
        title: 'Dashboard - SportPlanner'
      },
      {
        path: 'teams',
        loadComponent: () => import('./components/dashboard/teams.component').then(m => m.TeamsComponent),
        title: 'Equipos - SportPlanner'
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
