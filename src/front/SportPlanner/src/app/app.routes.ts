import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/teams',
    pathMatch: 'full'
  },
  {
    path: 'teams/create',
    loadComponent: () => import('./components/create-team/create-team.component').then(m => m.CreateTeamComponent)
  },
  {
    path: 'teams',
    loadComponent: () => import('./components/teams-list/teams-list.component').then(m => m.TeamsListComponent)
  },
  {
    path: '**',
    redirectTo: '/teams'
  }
];
