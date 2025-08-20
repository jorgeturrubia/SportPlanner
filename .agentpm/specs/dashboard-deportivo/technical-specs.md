# Especificaciones Técnicas - Dashboard Deportivo

## Arquitectura General

### **Stack Tecnológico**
- **Frontend:** Angular 20.1.0 (Standalone Components)
- **Styling:** TailwindCSS 4.1.12
- **Icons:** Lucide Angular 0.539.0
- **State Management:** Angular Signals (nativo)
- **Forms:** Reactive Forms
- **HTTP:** Angular HttpClient
- **Routing:** Angular Router con Guards

### **Estructura de Carpetas**
```
src/app/
├── dashboard/
│   ├── components/
│   │   ├── dashboard-header/
│   │   ├── sidebar/
│   │   ├── user-menu/
│   │   └── theme-toggle/
│   ├── pages/
│   │   ├── dashboard-home/
│   │   └── teams/
│   ├── services/
│   │   ├── theme.service.ts
│   │   └── teams.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── interfaces/
│       ├── dashboard.interfaces.ts
│       ├── team.interfaces.ts
│       └── user.interfaces.ts
├── shared/
│   ├── components/
│   └── services/
└── core/
    ├── services/
    │   └── auth.service.ts
    └── interfaces/
```

## Interfaces y Tipos

### **User Interface**
```typescript
// src/app/dashboard/interfaces/user.interfaces.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  user: User;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
}
```

### **Team Interface**
```typescript
// src/app/dashboard/interfaces/team.interfaces.ts
export interface Team {
  id: string;
  name: string;
  sport: SportType;
  category: string;
  description?: string;
  logo?: string;
  color: string;
  playersCount: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export type SportType = 'football' | 'basketball' | 'handball' | 'volleyball' | 'other';

export interface CreateTeamRequest {
  name: string;
  sport: SportType;
  category: string;
  description?: string;
  color: string;
}

export interface UpdateTeamRequest extends Partial<CreateTeamRequest> {
  id: string;
}
```

### **Navigation Interface**
```typescript
// src/app/dashboard/interfaces/dashboard.interfaces.ts
export interface NavigationItem {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  route: string;
  active?: boolean;
  badge?: number;
}

export interface SidebarState {
  isCollapsed: boolean;
  isMobile: boolean;
}
```

## Componentes Principales

### **1. Dashboard Layout Component**
```typescript
// src/app/dashboard/dashboard-layout.component.ts
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DashboardHeaderComponent, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <app-dashboard-header 
        [user]="user()" 
        (toggleSidebar)="toggleSidebar()"
        (logout)="handleLogout()" />
      
      <div class="flex">
        <app-sidebar 
          [isCollapsed]="sidebarCollapsed()"
          [navigationItems]="navigationItems()"
          (itemSelected)="handleNavigation($event)" />
        
        <main class="flex-1 p-6 transition-all duration-200"
              [class.ml-64]="!sidebarCollapsed()"
              [class.ml-16]="sidebarCollapsed()">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {
  private themeService = inject(ThemeService);
  
  sidebarCollapsed = signal(false);
  user = signal<User | null>(null);
  
  navigationItems = signal<NavigationItem[]>([
    { id: 'home', label: 'Inicio', icon: 'home', route: '/dashboard' },
    { id: 'teams', label: 'Equipos', icon: 'users', route: '/dashboard/teams' }
  ]);
  
  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }
  
  handleNavigation(item: NavigationItem) {
    // Navigation logic
  }
  
  handleLogout() {
    // Logout logic
  }
}
```

### **2. Dashboard Header Component**
```typescript
// src/app/dashboard/components/dashboard-header/dashboard-header.component.ts
import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { User } from '../../interfaces/user.interfaces';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent, UserMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
      <div class="flex items-center space-x-4">
        <button 
          (click)="toggleSidebar.emit()"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <lucide-icon name="menu" class="w-5 h-5" />
        </button>
        
        <div class="flex items-center space-x-2">
          <img src="/assets/logo.svg" alt="PlanSport" class="h-8 w-8" />
          <span class="font-semibold text-gray-900 dark:text-white">PlanSport</span>
        </div>
      </div>
      
      <div class="flex items-center space-x-4">
        <app-theme-toggle />
        <app-user-menu [user]="user()" (logout)="logout.emit()" />
      </div>
    </header>
  `
})
export class DashboardHeaderComponent {
  user = input.required<User | null>();
  toggleSidebar = output<void>();
  logout = output<void>();
}
```

### **3. Sidebar Component**
```typescript
// src/app/dashboard/components/sidebar/sidebar.component.ts
import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationItem } from '../../interfaces/dashboard.interfaces';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-16 transition-all duration-200 z-40"
           [class.w-64]="!isCollapsed()"
           [class.w-16]="isCollapsed()">
      <nav class="p-4 space-y-2">
        @for (item of navigationItems(); track item.id) {
          <a [routerLink]="item.route"
             routerLinkActive="bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
             class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
            <lucide-icon [name]="item.icon" class="w-5 h-5 flex-shrink-0" />
            @if (!isCollapsed()) {
              <span class="font-medium">{{ item.label }}</span>
            }
            @if (item.badge && !isCollapsed()) {
              <span class="ml-auto bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400 text-xs px-2 py-1 rounded-full">
                {{ item.badge }}
              </span>
            }
          </a>
        }
      </nav>
    </aside>
  `
})
export class SidebarComponent {
  isCollapsed = input.required<boolean>();
  navigationItems = input.required<NavigationItem[]>();
  itemSelected = output<NavigationItem>();
}
```

### **4. Theme Toggle Component**
```typescript
// src/app/dashboard/components/theme-toggle/theme-toggle.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button 
      (click)="toggleTheme()"
      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      [attr.aria-label]="currentTheme() === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'">
      @if (currentTheme() === 'dark') {
        <lucide-icon name="sun" class="w-5 h-5 text-yellow-500" />
      } @else {
        <lucide-icon name="moon" class="w-5 h-5 text-gray-600" />
      }
    </button>
  `
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  
  currentTheme = this.themeService.currentTheme;
  
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
```

### **5. User Menu Component**
```typescript
// src/app/dashboard/components/user-menu/user-menu.component.ts
import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interfaces';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <button 
        (click)="toggleMenu()"
        class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {{ getUserInitials() }}
        </div>
        @if (user()) {
          <div class="text-left hidden md:block">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user()!.firstName }} {{ user()!.lastName }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ user()!.email }}</p>
          </div>
        }
        <lucide-icon name="chevron-down" class="w-4 h-4 text-gray-500" />
      </button>
      
      @if (isMenuOpen()) {
        <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          <button 
            (click)="handleLogout()"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
            <lucide-icon name="log-out" class="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      }
    </div>
  `
})
export class UserMenuComponent {
  user = input.required<User | null>();
  logout = output<void>();
  
  isMenuOpen = signal(false);
  
  toggleMenu() {
    this.isMenuOpen.update(open => !open);
  }
  
  getUserInitials(): string {
    const currentUser = this.user();
    if (!currentUser) return 'U';
    return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
  }
  
  handleLogout() {
    this.isMenuOpen.set(false);
    this.logout.emit();
  }
}
```

## Servicios

### **Theme Service**
```typescript
// src/app/dashboard/services/theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'plansport-theme';
  
  currentTheme = signal<Theme>('system');
  
  constructor() {
    this.loadTheme();
    this.setupThemeEffect();
  }
  
  private loadTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
    }
  }
  
  private setupThemeEffect() {
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
      localStorage.setItem(this.THEME_KEY, theme);
    });
  }
  
  private applyTheme(theme: Theme) {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }
  
  toggleTheme() {
    const current = this.currentTheme();
    const next = current === 'light' ? 'dark' : 'light';
    this.currentTheme.set(next);
  }
  
  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
  }
}
```

### **Teams Service**
```typescript
// src/app/dashboard/services/teams.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team, CreateTeamRequest, UpdateTeamRequest } from '../interfaces/team.interfaces';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/teams';
  
  teams = signal<Team[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  async loadTeams() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const teams = await this.http.get<Team[]>(this.API_URL).toPromise();
      this.teams.set(teams || []);
    } catch (error) {
      this.error.set('Error al cargar los equipos');
      console.error('Error loading teams:', error);
    } finally {
      this.loading.set(false);
    }
  }
  
  async createTeam(teamData: CreateTeamRequest): Promise<Team | null> {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const newTeam = await this.http.post<Team>(this.API_URL, teamData).toPromise();
      if (newTeam) {
        this.teams.update(teams => [...teams, newTeam]);
        return newTeam;
      }
      return null;
    } catch (error) {
      this.error.set('Error al crear el equipo');
      console.error('Error creating team:', error);
      return null;
    } finally {
      this.loading.set(false);
    }
  }
  
  async updateTeam(teamData: UpdateTeamRequest): Promise<Team | null> {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const updatedTeam = await this.http.put<Team>(`${this.API_URL}/${teamData.id}`, teamData).toPromise();
      if (updatedTeam) {
        this.teams.update(teams => 
          teams.map(team => team.id === updatedTeam.id ? updatedTeam : team)
        );
        return updatedTeam;
      }
      return null;
    } catch (error) {
      this.error.set('Error al actualizar el equipo');
      console.error('Error updating team:', error);
      return null;
    } finally {
      this.loading.set(false);
    }
  }
  
  async deleteTeam(teamId: string): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      await this.http.delete(`${this.API_URL}/${teamId}`).toPromise();
      this.teams.update(teams => teams.filter(team => team.id !== teamId));
      return true;
    } catch (error) {
      this.error.set('Error al eliminar el equipo');
      console.error('Error deleting team:', error);
      return false;
    } finally {
      this.loading.set(false);
    }
  }
}
```

## Routing Configuration

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './dashboard/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/pages/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      {
        path: 'teams',
        loadComponent: () => import('./dashboard/pages/teams/teams.component').then(m => m.TeamsComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];
```

## Consideraciones de Performance

### **Lazy Loading**
- Todas las rutas del dashboard usan lazy loading
- Componentes cargados bajo demanda

### **Change Detection**
- OnPush strategy en todos los componentes
- Uso de signals para estado reactivo
- Minimizar re-renders innecesarios

### **Bundle Optimization**
- Tree-shaking automático con Angular 20
- Standalone components reducen bundle size
- Lazy loading de rutas

## Accesibilidad

### **ARIA Labels**
- Botones con labels descriptivos
- Navegación semánticamente correcta
- Estados de loading anunciados

### **Keyboard Navigation**
- Tab order lógico
- Escape para cerrar modales
- Enter/Space para activar botones

### **Screen Readers**
- Estructura semántica HTML
- Roles ARIA apropiados
- Texto alternativo para iconos

## Testing Strategy

### **Unit Tests**
- Componentes individuales
- Servicios y lógica de negocio
- Pipes y utilidades

### **Integration Tests**
- Flujos de navegación
- Interacciones entre componentes
- API calls y manejo de errores

### **E2E Tests**
- Flujos completos de usuario
- Responsive design
- Accesibilidad