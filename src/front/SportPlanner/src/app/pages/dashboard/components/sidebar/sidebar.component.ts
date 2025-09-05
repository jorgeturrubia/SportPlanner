import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../../../../services/auth.service';
import { NotificationService } from '../../../../services/notification.service';

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIcon],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full'
  }
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isCollapsed = signal<boolean>(false);

  readonly navigationItems: NavigationItem[] = [
    { path: '/dashboard/home', label: 'Inicio', icon: 'heroHome' },
    { path: '/dashboard/teams', label: 'Equipos', icon: 'heroUsers' },
    { path: '/dashboard/objectives', label: 'Objetivos', icon: 'heroTarget' },
    { path: '/dashboard/exercises', label: 'Ejercicios', icon: 'heroAcademicCap' },
    { path: '/dashboard/plannings', label: 'Planificaciones', icon: 'heroCalendarDays' }
  ];

  readonly userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    
    const first = user.firstName?.charAt(0).toUpperCase() || '';
    const last = user.lastName?.charAt(0).toUpperCase() || '';
    return first + last || user.email?.charAt(0).toUpperCase() || 'U';
  });

  readonly userDisplayName = computed(() => {
    const user = this.currentUser();
    if (!user) return 'Usuario';
    
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    
    return user.email || 'Usuario';
  });

  readonly userRole = computed(() => {
    const user = this.currentUser();
    return user?.role || 'Coach';
  });

  async onLogout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      this.notificationService.showError('Error al cerrar sesión');
      console.error('Logout error:', error);
    }
  }

  onToggleSidebar(): void {
    this.isCollapsed.update(current => !current);
  }
}