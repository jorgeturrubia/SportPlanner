import { Component, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroHome,
  heroCalendarDays,
  heroUsers,
  heroChartBarSquare,
  heroCog6Tooth,
  heroChevronLeft,
  heroChevronRight,
  heroBars3,
  heroXMark
} from '@ng-icons/heroicons/outline';

import { SidebarService } from '../../../core/services/sidebar.service';
import { ThemeService } from '../../../core/services/theme.service';
import { UserMenuComponent } from '../user-menu/user-menu.component';

export interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent, UserMenuComponent],
  providers: [
    provideIcons({
      heroHome,
      heroCalendarDays,
      heroUsers,
      heroChartBarSquare,
      heroCog6Tooth,
      heroChevronLeft,
      heroChevronRight,
      heroBars3,
      heroXMark
    })
  ],
  template: `
    <!-- Mobile Overlay -->
    <div 
      *ngIf="sidebarService.shouldShowOverlay()"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      (click)="sidebarService.handleOverlayClick()">
    </div>

    <!-- Sidebar -->
    <aside 
      [class]="sidebarClasses()"
      [style]="sidebarStyles()">
      
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between p-4 border-b border-[var(--color-sidebar-border)]">
        <!-- Logo/Brand -->
        <div class="flex items-center space-x-3" [class.hidden]="sidebarService.isCollapsed() && !sidebarService.isMobileBreakpoint()">
          <div class="w-8 h-8 bg-[var(--color-sidebar-active)] rounded-lg flex items-center justify-center">
            <ng-icon name="heroChartBarSquare" class="text-white" size="20"></ng-icon>
          </div>
          <span class="font-semibold text-lg text-[var(--color-sidebar-text)] truncate">
            SportPlanner
          </span>
        </div>
        
        <!-- Toggle Buttons -->
        <div class="flex items-center space-x-2">
          <!-- Mobile Close Button -->
          <button 
            *ngIf="sidebarService.isMobileBreakpoint()"
            (click)="sidebarService.closeMobile()"
            class="p-2 rounded-lg hover:bg-[var(--color-sidebar-hover)] text-[var(--color-sidebar-text)] transition-colors"
            aria-label="Cerrar menú">
            <ng-icon name="heroXMark" size="20"></ng-icon>
          </button>
          
          <!-- Desktop Toggle Button -->
          <button 
            *ngIf="!sidebarService.isMobileBreakpoint()"
            (click)="sidebarService.toggle()"
            class="p-2 rounded-lg hover:bg-[var(--color-sidebar-hover)] text-[var(--color-sidebar-text)] transition-colors"
            [attr.aria-label]="sidebarService.isCollapsed() ? 'Expandir menú' : 'Contraer menú'">
            <ng-icon 
              [name]="sidebarService.isCollapsed() ? 'heroChevronRight' : 'heroChevronLeft'" 
              size="20">
            </ng-icon>
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto sidebar-scrollbar">
        <div class="space-y-1">
          <a 
            *ngFor="let item of navigationItems"
            [routerLink]="item.route"
            routerLinkActive="sidebar-nav-active"
            #rla="routerLinkActive"
            [class]="getNavItemClasses(rla.isActive)"
            [attr.aria-label]="item.label"
            [title]="sidebarService.isCollapsed() && !sidebarService.isMobileBreakpoint() ? item.label : ''">
            
            <ng-icon [name]="item.icon" size="20" class="flex-shrink-0"></ng-icon>
            
            <span 
              class="font-medium truncate transition-opacity duration-200"
              [class.opacity-0]="sidebarService.isCollapsed() && !sidebarService.isMobileBreakpoint()"
              [class.w-0]="sidebarService.isCollapsed() && !sidebarService.isMobileBreakpoint()">
              {{ item.label }}
            </span>
          </a>
        </div>
      </nav>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- User Section -->
      <div class="p-4 border-t border-[var(--color-sidebar-border)]">
        <app-user-menu 
          [collapsed]="sidebarService.isCollapsed() && !sidebarService.isMobileBreakpoint()">
        </app-user-menu>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-nav-active {
      background-color: var(--color-sidebar-active);
      color: var(--color-sidebar-active-text);
    }
    
    .sidebar-nav-active ng-icon {
      color: var(--color-sidebar-active-text);
    }

    /* Sidebar Styles */
    aside {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 40;
      height: 100vh;
      overflow-y: auto;
      background: var(--color-sidebar-bg);
      border-right: 1px solid var(--color-sidebar-border);
      transition: width var(--sidebar-transition), transform var(--sidebar-transition);
    }

    /* Mobile Styles */
    aside.sidebar-mobile {
      width: 20rem;
      transform: translateX(-100%);
    }

    aside.sidebar-mobile-open {
      transform: translateX(0);
    }

    /* Desktop Styles */
    aside.sidebar-desktop {
      transform: translateX(0);
      width: var(--sidebar-current-width, var(--sidebar-width));
    }

    @media (min-width: 768px) {
      aside.sidebar-mobile {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  protected readonly sidebarService = inject(SidebarService);
  protected readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  // Navigation items
  protected readonly navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: 'heroHome',
      route: '/dashboard'
    },
    {
      label: 'Calendario',
      icon: 'heroCalendarDays',
      route: '/dashboard/calendar'
    },
    {
      label: 'Equipos',
      icon: 'heroUsers',
      route: '/teams'
    },
    {
      label: 'Estadísticas',
      icon: 'heroChartBarSquare',
      route: '/dashboard/stats'
    },
    {
      label: 'Configuración',
      icon: 'heroCog6Tooth',
      route: '/dashboard/settings'
    }
  ];

  // Computed properties for template
  protected readonly sidebarClasses = computed(() => {
    const baseClasses = [
      'flex',
      'flex-col',
      'bg-[var(--color-sidebar-bg)]',
      'border-r',
      'border-[var(--color-sidebar-border)]',
      'sidebar-transition'
    ];

    // Add responsive classes
    if (this.sidebarService.isMobileBreakpoint()) {
      baseClasses.push('w-80', 'sidebar-mobile');
      if (this.sidebarService.isMobileOpen()) {
        baseClasses.push('sidebar-mobile-open');
      }
    } else {
      // Desktop: use dynamic width based on collapsed state
      baseClasses.push('sidebar-desktop');
    }

    return baseClasses.join(' ');
  });

  protected readonly sidebarStyles = computed(() => {
    const styles = this.sidebarService.getCSSProperties();
    return {
      '--sidebar-current-width': styles['--sidebar-current-width']
    };
  });

  ngOnInit(): void {
    // Listen for escape key to close mobile sidebar
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  protected getNavItemClasses(isActive: boolean): string {
    const baseClasses = [
      'flex',
      'items-center',
      'space-x-3',
      'px-3',
      'py-2.5',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'group'
    ];

    if (isActive) {
      baseClasses.push('sidebar-nav-active');
    } else {
      baseClasses.push(
        'text-[var(--color-sidebar-text)]',
        'hover:bg-[var(--color-sidebar-hover)]',
        'hover:text-[var(--color-sidebar-text)]'
      );
    }

    // Collapsed state adjustments
    if (this.sidebarService.isCollapsed() && !this.sidebarService.isMobileBreakpoint()) {
      baseClasses.push('justify-center', 'px-2');
    }

    return baseClasses.join(' ');
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.sidebarService.handleEscapeKey();
    }
  }
}