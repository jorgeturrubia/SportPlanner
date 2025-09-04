import { Injectable, signal, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'sportplanner-theme';
  
  // Signal to track current theme
  isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    // Apply initial theme
    this.applyTheme(this.isDarkMode());
    
    // Effect to apply theme changes to document
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update(current => !current);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.THEME_KEY, this.isDarkMode() ? 'dark' : 'light');
    }
  }

  private getInitialTheme(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true; // Default to dark mode on server
    }
    
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Default to dark mode instead of system preference
    return true;
  }

  private applyTheme(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip theme application on server
    }
    
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}