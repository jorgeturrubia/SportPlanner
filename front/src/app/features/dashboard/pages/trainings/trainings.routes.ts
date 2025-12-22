import { Routes } from '@angular/router';

export const TRAININGS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./trainings.component').then(m => m.TrainingsComponent)
    },
    {
        path: 'new',
        loadComponent: () => import('./training-detail/training-detail.component').then(m => m.TrainingDetailComponent)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./training-detail/training-detail.component').then(m => m.TrainingDetailComponent)
    }
];
