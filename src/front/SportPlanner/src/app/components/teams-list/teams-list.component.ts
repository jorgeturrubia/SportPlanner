import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { Team, Gender, TeamLevel } from '../../models/team.model';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Mis Equipos</h1>
        <a
          routerLink="/teams/create"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Crear Equipo
        </a>
      </div>

      <!-- Loading state -->
      <div *ngIf="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Cargando equipos...</p>
      </div>

      <!-- Empty state -->
      <div *ngIf="!isLoading && teams.length === 0" class="text-center py-12">
        <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No tienes equipos creados</h3>
        <p class="text-gray-600 mb-4">Crea tu primer equipo para comenzar a planificar entrenamientos</p>
        <a
          routerLink="/teams/create"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Crear mi primer equipo
        </a>
      </div>

      <!-- Teams grid -->
      <div *ngIf="!isLoading && teams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let team of teams"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
        >
          <div class="p-6">
            <!-- Team header -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ team.name }}</h3>
                <p class="text-sm text-gray-600">{{ team.sport }} • {{ team.category }}</p>
              </div>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                [ngClass]="{
                  'bg-green-100 text-green-800': team.level === TeamLevel.A,
                  'bg-yellow-100 text-yellow-800': team.level === TeamLevel.B,
                  'bg-red-100 text-red-800': team.level === TeamLevel.C
                }"
              >
                Nivel {{ getLevelText(team.level) }}
              </span>
            </div>

            <!-- Team details -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                {{ getGenderText(team.gender) }}
              </div>
              <div *ngIf="team.description" class="text-sm text-gray-600">
                {{ team.description }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button
                (click)="viewTeam(team.id)"
                class="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Ver Detalles
              </button>
              <button
                (click)="createPlanning(team.id)"
                class="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Planificar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeamsListComponent implements OnInit {
  teams: Team[] = [];
  isLoading = true;
  TeamLevel = TeamLevel;
  Gender = Gender;

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.isLoading = true;
    this.teamService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar equipos:', error);
        this.isLoading = false;
      }
    });
  }

  getLevelText(level: TeamLevel): string {
    switch (level) {
      case TeamLevel.A: return 'A';
      case TeamLevel.B: return 'B';
      case TeamLevel.C: return 'C';
      default: return 'B';
    }
  }

  getGenderText(gender: Gender): string {
    switch (gender) {
      case Gender.Male: return 'Masculino';
      case Gender.Female: return 'Femenino';
      case Gender.Mixed: return 'Mixto';
      default: return 'Masculino';
    }
  }

  viewTeam(teamId: string) {
    // Navegar a los detalles del equipo
    console.log('Ver equipo:', teamId);
  }

  createPlanning(teamId: string) {
    // Navegar a crear planificación para este equipo
    console.log('Crear planificación para equipo:', teamId);
  }
}