import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
        <h1 class="text-2xl font-bold text-secondary-900 mb-2">¡Bienvenido a SportPlanner!</h1>
        <p class="text-secondary-600">Aquí tienes un resumen de tu actividad deportiva.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-primary-100 rounded-lg">
              <ng-icon name="heroUsers" class="h-6 w-6 text-primary-600"></ng-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-secondary-600">Equipos</p>
              <p class="text-2xl font-bold text-secondary-900">0</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-success-100 rounded-lg">
              <ng-icon name="heroCheckCircle" class="h-6 w-6 text-success-600"></ng-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-secondary-600">Entrenamientos</p>
              <p class="text-2xl font-bold text-secondary-900">0</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-warning-100 rounded-lg">
              <ng-icon name="heroInformationCircle" class="h-6 w-6 text-warning-600"></ng-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-secondary-600">Eventos</p>
              <p class="text-2xl font-bold text-secondary-900">0</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-error-100 rounded-lg">
              <ng-icon name="heroExclamationTriangle" class="h-6 w-6 text-error-600"></ng-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-secondary-600">Pendientes</p>
              <p class="text-2xl font-bold text-secondary-900">0</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
        <h2 class="text-lg font-semibold text-secondary-900 mb-4">Acciones Rápidas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button class="p-4 border-2 border-dashed border-secondary-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors text-center">
            <ng-icon name="heroUsers" class="h-8 w-8 text-secondary-400 mx-auto mb-2"></ng-icon>
            <p class="text-sm font-medium text-secondary-600">Crear Equipo</p>
          </button>
          
          <button class="p-4 border-2 border-dashed border-secondary-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors text-center">
            <ng-icon name="heroCheckCircle" class="h-8 w-8 text-secondary-400 mx-auto mb-2"></ng-icon>
            <p class="text-sm font-medium text-secondary-600">Nuevo Entrenamiento</p>
          </button>
          
          <button class="p-4 border-2 border-dashed border-secondary-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors text-center">
            <ng-icon name="heroInformationCircle" class="h-8 w-8 text-secondary-400 mx-auto mb-2"></ng-icon>
            <p class="text-sm font-medium text-secondary-600">Programar Evento</p>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
        <h2 class="text-lg font-semibold text-secondary-900 mb-4">Actividad Reciente</h2>
        <div class="text-center py-8">
          <ng-icon name="heroInformationCircle" class="h-12 w-12 text-secondary-300 mx-auto mb-4"></ng-icon>
          <p class="text-secondary-500">No hay actividad reciente</p>
          <p class="text-sm text-secondary-400 mt-1">Comienza creando tu primer equipo</p>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}