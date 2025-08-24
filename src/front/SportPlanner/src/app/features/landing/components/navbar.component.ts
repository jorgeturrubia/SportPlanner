import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface NavItem {
  label: string;
  href: string;
  scrollTo?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <a href="#" class="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              PlanSport
            </a>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-8">
              @for (item of navItems(); track item.label) {
                <a
                  [href]="item.href"
                  (click)="scrollToSection($event, item.scrollTo)"
                  class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {{ item.label }}
                </a>
              }
            </div>
          </div>

          <!-- Auth Buttons -->
          <div class="hidden md:flex items-center space-x-4">
            <button
              type="button"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Registrarse
            </button>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              type="button"
              (click)="toggleMobileMenu()"
              class="text-gray-700 hover:text-blue-600 inline-flex items-center justify-center p-2 rounded-md"
              [attr.aria-expanded]="isMobileMenuOpen()"
              aria-label="Abrir menú principal"
            >
              @if (!isMobileMenuOpen()) {
                <!-- Hamburger icon -->
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              } @else {
                <!-- Close icon -->
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      @if (isMobileMenuOpen()) {
        <div class="md:hidden bg-white border-t border-gray-200">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            @for (item of navItems(); track item.label) {
              <a
                [href]="item.href"
                (click)="scrollToSection($event, item.scrollTo); closeMobileMenu()"
                class="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
              >
                {{ item.label }}
              </a>
            }
            <div class="border-t border-gray-200 pt-4 pb-3">
              <div class="flex flex-col space-y-3">
                <button
                  type="button"
                  class="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  class="bg-blue-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors mx-3"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  protected readonly isMobileMenuOpen = signal(false);
  protected readonly navItems = signal<NavItem[]>([
    { label: 'Sobre Nosotros', href: '#sobre-nosotros', scrollTo: 'sobre-nosotros' },
    { label: 'Entrenamientos', href: '#entrenamientos', scrollTo: 'entrenamientos' },
    { label: 'Marketplace', href: '#marketplace', scrollTo: 'marketplace' },
    { label: 'Suscripciones', href: '#suscripciones', scrollTo: 'suscripciones' }
  ]);

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  protected scrollToSection(event: Event, sectionId: string | undefined): void {
    if (!sectionId) return;
    
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }
}