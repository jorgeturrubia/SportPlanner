import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Logo -->
        <div class="text-center">
          <h1 class="text-3xl font-bold text-primary-600 mb-2">SportPlanner</h1>
          <p class="text-secondary-600">Planifica tu entrenamiento</p>
        </div>

        <!-- Auth Content -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <router-outlet></router-outlet>
        </div>

        <!-- Back to Landing -->
        <div class="text-center">
          <a routerLink="/" class="text-primary-600 hover:text-primary-700 font-medium transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  `
})
export class AuthLayoutComponent {}