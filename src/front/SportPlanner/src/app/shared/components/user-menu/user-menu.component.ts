import { Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import {
  heroUser,
  heroArrowRightOnRectangle,
  heroChevronDown,
  heroChevronUpDown,
  heroCog6Tooth,
  heroUserCircle
} from '@ng-icons/heroicons/outline';

import { ThemeService } from '../../../core/services/theme.service';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface UserMenuAction {
  label: string;
  icon: string;
  action: () => void;
  divider?: boolean;
}

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroUser,
      heroCog6Tooth,
      heroArrowRightOnRectangle,
      heroChevronDown,
      heroChevronUpDown
    })
  ],
  template: `
    <div class="relative">
      <!-- User Menu Button -->
      <button
        (click)="toggleMenu()"
        [class]="userButtonClasses()"
        [attr.aria-expanded]="isMenuOpen()"
        aria-haspopup="true"
        [attr.aria-label]="collapsed ? 'Abrir menú de usuario' : 'Menú de ' + currentUser().name">
        
        <!-- User Avatar -->
        <div class="flex-shrink-0">
          <div 
            *ngIf="currentUser().avatar; else defaultAvatar"
            class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <img 
              [src]="currentUser().avatar" 
              [alt]="currentUser().name"
              class="w-full h-full object-cover">
          </div>
          <ng-template #defaultAvatar>
            <div class="w-8 h-8 rounded-full bg-[var(--color-sidebar-active)] flex items-center justify-center">
              <ng-icon name="heroUser" class="text-white" size="16"></ng-icon>
            </div>
          </ng-template>
        </div>
        
        <!-- User Info (hidden when collapsed) -->
        <div 
          class="flex-1 text-left transition-all duration-200"
          [class.opacity-0]="collapsed"
          [class.w-0]="collapsed"
          [class.overflow-hidden]="collapsed">
          <div class="font-medium text-sm text-[var(--color-sidebar-text)] truncate">
            {{ currentUser().name }}
          </div>
          <div class="text-xs text-[var(--color-sidebar-text-muted)] truncate">
            {{ currentUser().email }}
          </div>
        </div>
        
        <!-- Chevron Icon (hidden when collapsed) -->
        <ng-icon 
          name="heroChevronUpDown" 
          size="16" 
          class="text-[var(--color-sidebar-text-muted)] transition-all duration-200"
          [class.opacity-0]="collapsed"
          [class.w-0]="collapsed"
          [class.rotate-180]="isMenuOpen()">
        </ng-icon>
      </button>

      <!-- Dropdown Menu -->
      <div
        *ngIf="isMenuOpen()"
        [class]="dropdownClasses()"
        (clickOutside)="closeMenu()">
        
        <!-- User Info Header (always visible in dropdown) -->
        <div class="px-4 py-3 border-b border-[var(--color-user-menu-border)]">
          <div class="flex items-center space-x-3">
            <div 
              *ngIf="currentUser().avatar; else defaultAvatarLarge"
              class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img 
                [src]="currentUser().avatar" 
                [alt]="currentUser().name"
                class="w-full h-full object-cover">
            </div>
            <ng-template #defaultAvatarLarge>
              <div class="w-10 h-10 rounded-full bg-[var(--color-sidebar-active)] flex items-center justify-center">
                <ng-icon name="heroUser" class="text-white" size="20"></ng-icon>
              </div>
            </ng-template>
            
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm text-[var(--color-sidebar-text)] truncate">
                {{ currentUser().name }}
              </div>
              <div class="text-xs text-[var(--color-sidebar-text-muted)] truncate">
                {{ currentUser().email }}
              </div>
              <div 
                *ngIf="currentUser().role"
                class="text-xs text-[var(--color-sidebar-text-muted)] truncate">
                {{ currentUser().role }}
              </div>
            </div>
          </div>
        </div>

        <!-- Menu Actions -->
        <div class="py-2">
          <button
            *ngFor="let action of menuActions"
            (click)="handleAction(action)"
            [class]="getActionClasses(action)"
            [attr.aria-label]="action.label">
            
            <ng-icon [name]="action.icon" size="16" class="flex-shrink-0"></ng-icon>
            <span class="font-medium">{{ action.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Click Outside Detector -->
    <div 
      *ngIf="isMenuOpen()"
      class="fixed inset-0 z-10"
      (click)="closeMenu()">
    </div>
  `,
  styles: [`
    .dropdown-menu {
      box-shadow: 0 10px 25px var(--color-user-menu-shadow);
      animation: fadeIn 0.15s ease-out;
    }

    @keyframes fadeIn {
      from { 
        opacity: 0; 
        transform: translateY(-8px) scale(0.95);
      }
      to { 
        opacity: 1; 
        transform: translateY(0) scale(1);
      }
    }
  `]
})
export class UserMenuComponent {
  @Input() collapsed = false;
  private themeService = inject(ThemeService);
  private readonly router = inject(Router);
  
  // Menu state
  private _isMenuOpen = signal(false);
  protected readonly isMenuOpen = this._isMenuOpen.asReadonly();
  
  // Mock user data (in real app, this would come from AuthService)
  protected readonly currentUser = signal<User>({
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    role: 'Administrador'
  });
  
  // Menu actions
  protected readonly menuActions: UserMenuAction[] = [
    {
      label: 'Perfil',
      icon: 'heroUserCircle',
      action: () => this.navigateToProfile()
    },
    {
      label: 'Configuración',
      icon: 'heroCog6Tooth',
      action: () => this.navigateToSettings()
    },
    {
      label: 'Cerrar Sesión',
      icon: 'heroArrowRightOnRectangle',
      action: () => this.logout(),
      divider: true
    }
  ];
  
  // Computed classes
  protected readonly userButtonClasses = computed(() => {
    const baseClasses = [
      'w-full',
      'flex',
      'items-center',
      'space-x-3',
      'p-3',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'hover:bg-[var(--color-sidebar-hover)]',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-[var(--color-sidebar-active)]',
      'focus:ring-offset-2',
      'focus:ring-offset-[var(--color-sidebar-bg)]'
    ];
    
    if (this.collapsed) {
      baseClasses.push('justify-center', 'px-2');
    }
    
    return baseClasses.join(' ');
  });
  
  protected readonly dropdownClasses = computed(() => {
    const baseClasses = [
      'absolute',
      'bottom-full',
      'left-0',
      'mb-2',
      'w-64',
      'bg-[var(--color-user-menu-bg)]',
      'border',
      'border-[var(--color-user-menu-border)]',
      'rounded-lg',
      'dropdown-menu',
      'z-50'
    ];
    
    // Adjust position when collapsed
    if (this.collapsed) {
      baseClasses.push('left-full', 'bottom-0', 'ml-2', 'mb-0');
    }
    
    return baseClasses.join(' ');
  });
  
  protected toggleMenu(): void {
    this._isMenuOpen.update(open => !open);
  }
  
  protected closeMenu(): void {
    this._isMenuOpen.set(false);
  }
  
  protected handleAction(action: UserMenuAction): void {
    this.closeMenu();
    action.action();
  }
  
  protected getActionClasses(action: UserMenuAction): string {
    const baseClasses = [
      'w-full',
      'flex',
      'items-center',
      'space-x-3',
      'px-4',
      'py-2',
      'text-left',
      'text-sm',
      'text-[var(--color-sidebar-text)]',
      'hover:bg-[var(--color-user-menu-hover)]',
      'transition-colors',
      'duration-150'
    ];
    
    if (action.divider) {
      baseClasses.push('border-t', 'border-[var(--color-user-menu-border)]', 'mt-2', 'pt-4');
    }
    
    if (action.label === 'Cerrar Sesión') {
      baseClasses.push('text-red-600', 'hover:text-red-700', 'hover:bg-red-50');
    }
    
    return baseClasses.join(' ');
  }
  
  private navigateToProfile(): void {
    this.router.navigate(['/dashboard/profile']);
  }
  
  private navigateToSettings(): void {
    this.router.navigate(['/dashboard/settings']);
  }
  
  private logout(): void {
    // In real app, this would call AuthService.logout()
    console.log('Logging out...');
    this.router.navigate(['/auth/login']);
  }
}