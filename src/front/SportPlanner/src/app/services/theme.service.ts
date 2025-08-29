import { Injectable, signal, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'sportplanner-theme';
  
  // Signal to track current theme
  isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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
      return false; // Default to light mode on server
    }
    
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
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