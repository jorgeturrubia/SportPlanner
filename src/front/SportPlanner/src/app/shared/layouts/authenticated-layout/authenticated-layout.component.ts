import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { filter, map } from 'rxjs/operators';
import {
  heroBars3,
  heroXMark
} from '@ng-icons/heroicons/outline';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { SidebarService } from '../../../core/services/sidebar.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NgIconComponent,
    SidebarComponent,
    ThemeToggleComponent
  ],
  providers: [
    provideIcons({
      heroBars3,
      heroXMark
    })
  ],
  templateUrl: './authenticated-layout.component.html',
  styleUrls: ['./authenticated-layout.component.css']
})
export class AuthenticatedLayoutComponent {
  protected readonly sidebarService = inject(SidebarService);
  protected readonly themeService = inject(ThemeService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  // Page title based on current route
  pageTitle = signal<string>('Dashboard');
  
  // Auth data
  currentUser$ = this.authService.currentUser$;
  
  // Computed properties
  protected readonly contentMarginLeft = computed(() => {
    // On mobile, no margin (sidebar is overlay)
    if (this.sidebarService.isMobileBreakpoint()) {
      return '0px';
    }
    
    // On desktop, adjust margin based on sidebar width
    return `${this.sidebarService.currentWidth()}px`;
  });
  
  constructor() {
    // Listen to route changes to update page title
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(event => event as NavigationEnd)
      )
      .subscribe((event) => {
        this.updatePageTitle(event.url);
      });

    // Set initial page title
    this.updatePageTitle(this.router.url);
  }
  
  private updatePageTitle(url: string): void {
    const routeTitleMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/teams': 'Gestión de Equipos',
      '/planning': 'Planificación',
      '/training': 'Entrenamientos',
      '/marketplace': 'Marketplace',
      '/profile': 'Perfil',
      '/settings': 'Configuración'
    };

    // Find the matching route
    const matchedRoute = Object.keys(routeTitleMap).find(route => 
      url.startsWith(route)
    );

    this.pageTitle.set(matchedRoute ? routeTitleMap[matchedRoute] : 'PlanSport');
  }
  
  onSignOut() {
    this.authService.signOut();
  }
}