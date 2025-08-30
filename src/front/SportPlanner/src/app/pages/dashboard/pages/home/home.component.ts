import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../../../../services/auth.service';

interface DashboardStats {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, NgIcon],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full'
  }
})
export class DashboardHomeComponent {
  private authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;

  // Mock stats for now - in real app these would come from services
  readonly stats = signal<DashboardStats[]>([
    {
      label: 'Equipos Activos',
      value: '5',
      icon: 'heroUsers',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'Entrenamientos',
      value: '24',
      icon: 'heroCalendarDays',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      label: 'Jugadores',
      value: '67',
      icon: 'heroUser',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      label: 'Planificaciones',
      value: '12',
      icon: 'heroAcademicCap',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ]);

  readonly welcomeTitle = computed(() => {
    const user = this.currentUser();
    const name = user?.firstName || user?.email?.split('@')[0] || 'Usuario';
    return `¡Hola, ${name}!`;
  });

  readonly welcomeSubtitle = computed(() => {
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `Hoy es ${dateString}`;
  });
}