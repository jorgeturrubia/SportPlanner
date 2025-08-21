import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroSun,
  heroMoon,
  heroComputerDesktop,
  heroChevronDown
} from '@ng-icons/heroicons/outline';

import { ThemeService, Theme } from '../../../core/services/theme.service';

export interface ThemeOption {
  value: Theme;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroSun,
      heroMoon,
      heroComputerDesktop,
      heroChevronDown
    })
  ],
  template: `
    <div class="relative" [class]="containerClasses">
      <!-- Simple Toggle Button (when variant is 'button') -->
      <button
        *ngIf="variant === 'button'"
        (click)="handleToggle()"
        [class]="buttonClasses()"
        [attr.aria-label]="'Cambiar a tema ' + getNextThemeLabel()"
        [title]="'Tema actual: ' + themeService.getThemeDisplayName() + '. Click para cambiar.'">
        
        <ng-icon 
          [name]="getCurrentThemeIcon()" 
          [size]="size"
          class="transition-transform duration-200 hover:scale-110">
        </ng-icon>
      </button>

      <!-- Dropdown Toggle (when variant is 'dropdown') -->
      <div *ngIf="variant === 'dropdown'">
        <!-- Dropdown Button -->
        <button
          (click)="toggleDropdown()"
          [class]="dropdownButtonClasses()"
          [attr.aria-expanded]="isDropdownOpen"
          aria-haspopup="true"
          [attr.aria-label]="'Selector de tema. Tema actual: ' + themeService.getThemeDisplayName()">
          
          <ng-icon 
            [name]="getCurrentThemeIcon()" 
            [size]="size"
            class="flex-shrink-0">
          </ng-icon>
          
          <span *ngIf="showLabel" class="font-medium text-sm truncate">
            {{ themeService.getThemeDisplayName() }}
          </span>
          
          <ng-icon 
            name="heroChevronDown" 
            size="16" 
            class="flex-shrink-0 transition-transform duration-200"
            [class.rotate-180]="isDropdownOpen">
          </ng-icon>
        </button>

        <!-- Dropdown Menu -->
        <div
          *ngIf="isDropdownOpen"
          [class]="dropdownMenuClasses()">
          
          <button
            *ngFor="let option of themeOptions"
            (click)="selectTheme(option.value)"
            [class]="getOptionClasses(option)"
            [attr.aria-label]="'Cambiar a tema ' + option.label">
            
            <ng-icon 
              [name]="option.icon" 
              size="16" 
              class="flex-shrink-0">
            </ng-icon>
            
            <span class="font-medium text-sm">{{ option.label }}</span>
            
            <!-- Active Indicator -->
            <div 
              *ngIf="themeService.currentTheme() === option.value"
              class="w-2 h-2 bg-[var(--color-theme-toggle-active)] rounded-full ml-auto">
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Click Outside Detector -->
    <div 
      *ngIf="isDropdownOpen && variant === 'dropdown'"
      class="fixed inset-0 z-10"
      (click)="closeDropdown()">
    </div>
  `,
  styles: [`
    .dropdown-shadow {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.15s ease-out;
    }

    .dark .dropdown-shadow {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
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
export class ThemeToggleComponent {
  @Input() variant: 'button' | 'dropdown' = 'button';
  @Input() size: string = '20';
  @Input() showLabel = false;
  @Input() containerClasses = '';
  
  protected readonly themeService = inject(ThemeService);
  
  // Dropdown state
  protected isDropdownOpen = false;
  
  // Theme options for dropdown
  protected readonly themeOptions: ThemeOption[] = [
    {
      value: 'light',
      label: 'Claro',
      icon: 'heroSun'
    },
    {
      value: 'dark',
      label: 'Oscuro',
      icon: 'heroMoon'
    },
    {
      value: 'system',
      label: 'Sistema',
      icon: 'heroComputerDesktop'
    }
  ];
  
  // Computed classes
  protected readonly buttonClasses = computed(() => {
    const baseClasses = [
      'p-2',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'bg-[var(--color-theme-toggle-bg)]',
      'hover:bg-[var(--color-theme-toggle-hover)]',
      'text-[var(--color-sidebar-text)]',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-[var(--color-theme-toggle-active)]',
      'focus:ring-offset-2'
    ];
    
    return baseClasses.join(' ');
  });
  
  protected readonly dropdownButtonClasses = computed(() => {
    const baseClasses = [
      'flex',
      'items-center',
      'space-x-2',
      'px-3',
      'py-2',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'bg-[var(--color-theme-toggle-bg)]',
      'hover:bg-[var(--color-theme-toggle-hover)]',
      'text-[var(--color-sidebar-text)]',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-[var(--color-theme-toggle-active)]',
      'focus:ring-offset-2'
    ];
    
    if (this.isDropdownOpen) {
      baseClasses.push('bg-[var(--color-theme-toggle-hover)]');
    }
    
    return baseClasses.join(' ');
  });
  
  protected readonly dropdownMenuClasses = computed(() => {
    return [
      'absolute',
      'top-full',
      'right-0',
      'mt-2',
      'w-48',
      'bg-[var(--color-user-menu-bg)]',
      'border',
      'border-[var(--color-user-menu-border)]',
      'rounded-lg',
      'dropdown-shadow',
      'z-50',
      'py-2'
    ].join(' ');
  });
  
  protected getCurrentThemeIcon(): string {
    return this.themeService.getThemeIcon();
  }
  
  protected getNextThemeLabel(): string {
    const current = this.themeService.currentTheme();
    const effective = this.themeService.effectiveTheme();
    
    // For simple toggle, switch between light and dark
    return effective === 'light' ? 'oscuro' : 'claro';
  }
  
  protected handleToggle(): void {
    if (this.variant === 'button') {
      this.themeService.toggleTheme();
    }
  }
  
  protected toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  protected closeDropdown(): void {
    this.isDropdownOpen = false;
  }
  
  protected selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.closeDropdown();
  }
  
  protected getOptionClasses(option: ThemeOption): string {
    const baseClasses = [
      'w-full',
      'flex',
      'items-center',
      'space-x-3',
      'px-4',
      'py-2',
      'text-left',
      'text-[var(--color-sidebar-text)]',
      'hover:bg-[var(--color-user-menu-hover)]',
      'transition-colors',
      'duration-150'
    ];
    
    if (this.themeService.currentTheme() === option.value) {
      baseClasses.push('bg-[var(--color-user-menu-hover)]');
    }
    
    return baseClasses.join(' ');
  }
}