import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-secondary-900">Equipos</h1>
          <p class="text-secondary-600 mt-1">Gestiona tus equipos deportivos</p>
        </div>
        <button class="btn-primary">
          <ng-icon name="heroUsers" class="h-4 w-4 mr-2"></ng-icon>
          Crear Equipo
        </button>
      </div>

      <!-- Teams Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Empty State -->
        <div class="col-span-full">
          <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-12 text-center">
            <ng-icon name="heroUsers" class="h-16 w-16 text-secondary-300 mx-auto mb-4"></ng-icon>
            <h3 class="text-lg font-semibold text-secondary-900 mb-2">No tienes equipos aún</h3>
            <p class="text-secondary-600 mb-6">Crea tu primer equipo para comenzar a organizar tus entrenamientos</p>
            <button class="btn-primary">
              <ng-icon name="heroUsers" class="h-4 w-4 mr-2"></ng-icon>
              Crear mi primer equipo
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeamsComponent {}