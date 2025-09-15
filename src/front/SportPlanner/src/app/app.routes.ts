import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';
import { subscriptionGuard, noSubscriptionGuard } from './guards/subscription.guard';

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
    path: 'subscription',
    loadComponent: () => import('./pages/subscription/subscription.component').then(m => m.SubscriptionComponent),
    canActivate: [authGuard, noSubscriptionGuard],
    title: 'SportPlanner - Suscripción'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard, subscriptionGuard],
    title: 'SportPlanner - Dashboard',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/dashboard/pages/home/home.component').then(m => m.DashboardHomeComponent),
        title: 'SportPlanner - Dashboard'
      },
      {
        path: 'teams',
        loadComponent: () => import('./pages/dashboard/pages/teams/teams.component').then(m => m.TeamsComponent),
        title: 'SportPlanner - Equipos'
      },
      {
        path: 'objectives',
        loadComponent: () => import('./pages/dashboard/pages/objectives/objectives.component').then(m => m.ObjectivesComponent),
        title: 'SportPlanner - Objetivos'
      },
      {
        path: 'exercises',
        loadComponent: () => import('./pages/dashboard/pages/exercises/exercises.component').then(m => m.ExercisesComponent),
        title: 'SportPlanner - Ejercicios'
      },
      {
        path: 'plannings',
        loadComponent: () => import('./pages/dashboard/pages/plannings/plannings').then(m => m.Plannings),
        title: 'SportPlanner - Planificaciones'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
