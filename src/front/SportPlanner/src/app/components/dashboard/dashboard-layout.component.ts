import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NgIcon],
  template: `
    <div class="min-h-screen bg-secondary-50 flex">
      <!-- Sidebar -->
      <aside [class]="sidebarCollapsed() ? 'w-20' : 'w-64'" class="bg-white shadow-lg transition-all duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Logo -->
          <div class="flex items-center justify-center h-16 border-b border-secondary-200">
            @if (!sidebarCollapsed()) {
              <h1 class="text-xl font-bold text-primary-600">SportPlanner</h1>
            } @else {
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">SP</span>
              </div>
            }
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-4 py-6 space-y-2">
            <a
              routerLink="/dashboard/home"
              routerLinkActive="bg-primary-100 text-primary-700"
              class="flex items-center px-3 py-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors group"
            >
              <ng-icon name="heroHome" class="h-5 w-5 mr-3 group-hover:text-primary-600"></ng-icon>
              @if (!sidebarCollapsed()) {
                <span>Home</span>
              }
            </a>
            
            <a
              routerLink="/dashboard/teams"
              routerLinkActive="bg-primary-100 text-primary-700"
              class="flex items-center px-3 py-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors group"
            >
              <ng-icon name="heroUsers" class="h-5 w-5 mr-3 group-hover:text-primary-600"></ng-icon>
              @if (!sidebarCollapsed()) {
                <span>Equipos</span>
              }
            </a>
          </nav>

          <!-- Settings -->
          <div class="border-t border-secondary-200 p-4">
            <button class="flex items-center px-3 py-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors w-full group">
              <ng-icon name="heroCog6Tooth" class="h-5 w-5 mr-3 group-hover:text-primary-600"></ng-icon>
              @if (!sidebarCollapsed()) {
                <span>Configuración</span>
              }
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Top Navigation -->
        <header class="bg-white shadow-sm border-b border-secondary-200">
          <div class="flex items-center justify-between px-6 py-4">
            <!-- Sidebar Toggle -->
            <button
              (click)="toggleSidebar()"
              class="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <ng-icon name="heroBars3" class="h-5 w-5"></ng-icon>
            </button>

            <!-- User Menu -->
            <div class="flex items-center space-x-4">
              <!-- User Avatar -->
              <div class="relative">
                <button
                  (click)="toggleUserMenu()"
                  class="flex items-center space-x-2 p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
                >
                  <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <ng-icon name="heroUser" class="h-4 w-4 text-white"></ng-icon>
                  </div>
                  <ng-icon name="heroChevronDown" class="h-4 w-4"></ng-icon>
                </button>

                <!-- User Dropdown -->
                @if (showUserMenu()) {
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                    <a href="#" class="block px-4 py-2 text-secondary-700 hover:bg-secondary-100 transition-colors">
                      Mi Perfil
                    </a>
                    <hr class="my-2 border-secondary-200">
                    <button
                      (click)="logout()"
                      class="w-full text-left px-4 py-2 text-error-600 hover:bg-error-50 transition-colors flex items-center"
                    >
                      <ng-icon name="heroArrowRightOnRectangle" class="h-4 w-4 mr-2"></ng-icon>
                      Cerrar Sesión
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {
  sidebarCollapsed = signal(false);
  showUserMenu = signal(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  toggleUserMenu(): void {
    this.showUserMenu.set(!this.showUserMenu());
  }

  logout(): void {
    // TODO: Implement actual logout logic
    console.log('Logout clicked');
    this.showUserMenu.set(false);
  }
}