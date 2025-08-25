import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { CreateTeamRequest, Gender, TeamLevel } from '../../models/team.model';

@Component({
  selector: 'app-create-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Equipo</h2>
      
      <form (ngSubmit)="onSubmit()" #teamForm="ngForm" class="space-y-6">
        <!-- Nombre del equipo -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Equipo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            [(ngModel)]="team.name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Juvenil Masculino A"
          />
        </div>

        <!-- Deporte -->
        <div>
          <label for="sport" class="block text-sm font-medium text-gray-700 mb-2">
            Deporte *
          </label>
          <select
            id="sport"
            name="sport"
            [(ngModel)]="team.sport"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona un deporte</option>
            <option value="Baloncesto">Baloncesto</option>
            <option value="Fútbol">Fútbol</option>
            <option value="Voleibol">Voleibol</option>
            <option value="Balonmano">Balonmano</option>
            <option value="Tenis">Tenis</option>
          </select>
        </div>

        <!-- Categoría -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            id="category"
            name="category"
            [(ngModel)]="team.category"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona una categoría</option>
            <option value="Prebenjamín">Prebenjamín</option>
            <option value="Benjamín">Benjamín</option>
            <option value="Alevín">Alevín</option>
            <option value="Infantil">Infantil</option>
            <option value="Cadete">Cadete</option>
            <option value="Juvenil">Juvenil</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <!-- Género -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Género *
          </label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                type="radio"
                name="gender"
                [value]="Gender.Male"
                [(ngModel)]="team.gender"
                required
                class="mr-2"
              />
              Masculino
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                name="gender"
                [value]="Gender.Female"
                [(ngModel)]="team.gender"
                required
                class="mr-2"
              />
              Femenino
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                name="gender"
                [value]="Gender.Mixed"
                [(ngModel)]="team.gender"
                required
                class="mr-2"
              />
              Mixto
            </label>
          </div>
        </div>

        <!-- Nivel -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nivel del Equipo *
          </label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                type="radio"
                name="level"
                [value]="TeamLevel.A"
                [(ngModel)]="team.level"
                required
                class="mr-2"
              />
              Nivel A (Alto)
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                name="level"
                [value]="TeamLevel.B"
                [(ngModel)]="team.level"
                required
                class="mr-2"
              />
              Nivel B (Medio)
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                name="level"
                [value]="TeamLevel.C"
                [(ngModel)]="team.level"
                required
                class="mr-2"
              />
              Nivel C (Básico)
            </label>
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            [(ngModel)]="team.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descripción opcional del equipo..."
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            (click)="onCancel()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            [disabled]="!teamForm.valid || isLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Creando...' : 'Crear Equipo' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class CreateTeamComponent {
  Gender = Gender;
  TeamLevel = TeamLevel;
  
  team: CreateTeamRequest = {
    name: '',
    sport: '',
    category: '',
    gender: Gender.Male,
    level: TeamLevel.B,
    description: '',
    createdByUserId: '00000000-0000-0000-0000-000000000000' // Temporal, en producción vendrá del auth
  };

  isLoading = false;

  constructor(
    private teamService: TeamService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.isLoading) return;

    this.isLoading = true;
    
    this.teamService.createTeam(this.team).subscribe({
      next: (createdTeam) => {
        console.log('Equipo creado:', createdTeam);
        this.router.navigate(['/teams']);
      },
      error: (error) => {
        console.error('Error al crear equipo:', error);
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/teams']);
  }
}