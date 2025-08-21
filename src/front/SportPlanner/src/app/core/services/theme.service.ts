import { Injectable, signal, computed, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

export interface ThemeState {
  currentTheme: Theme;
  systemPreference: EffectiveTheme;
  effectiveTheme: EffectiveTheme;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme-preference';
  private mediaQuery?: MediaQueryList;
  
  // Signals for reactive state management
  private _currentTheme = signal<Theme>(this.getStoredTheme());
  private _systemPreference = signal<EffectiveTheme>(this.detectSystemPreference());
  
  // Public readonly signals
  readonly currentTheme = this._currentTheme.asReadonly();
  readonly systemPreference = this._systemPreference.asReadonly();
  
  // Computed signal for effective theme
  readonly effectiveTheme = computed<EffectiveTheme>(() => {
    const current = this._currentTheme();
    return current === 'system' ? this._systemPreference() : current as EffectiveTheme;
  });
  
  // Computed signal for complete theme state
  readonly themeState = computed<ThemeState>(() => ({
    currentTheme: this._currentTheme(),
    systemPreference: this._systemPreference(),
    effectiveTheme: this.effectiveTheme()
  }));

  constructor() {
    // Initialize mediaQuery only in browser environment
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Listen for system preference changes
      this.mediaQuery.addEventListener('change', (e) => {
        this._systemPreference.set(e.matches ? 'dark' : 'light');
      });
    }
    
    // Effect to apply theme changes to DOM
    effect(() => {
      this.applyThemeToDOM(this.effectiveTheme());
    });
    
    // Effect to persist theme changes
    effect(() => {
      const theme = this._currentTheme();
      if (theme !== 'system') {
        localStorage.setItem(this.STORAGE_KEY, theme);
      } else {
        localStorage.setItem(this.STORAGE_KEY, 'system');
      }
    });
  }

  /**
   * Toggle between light and dark themes
   * If current theme is 'system', it will toggle to the opposite of current system preference
   */
  toggleTheme(): void {
    const current = this.effectiveTheme();
    const newTheme: EffectiveTheme = current === 'light' ? 'dark' : 'light';
    this._currentTheme.set(newTheme);
  }

  /**
   * Set a specific theme
   */
  setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
  }

  /**
   * Detect and update system preference
   */
  detectSystemPreference(): EffectiveTheme {
    if (!this.mediaQuery) {
      // Default to light theme in SSR environment
      return 'light';
    }
    
    const preference = this.mediaQuery.matches ? 'dark' : 'light';
    this._systemPreference.set(preference);
    return preference;
  }

  /**
   * Get stored theme from localStorage or default to 'light'
   */
  private getStoredTheme(): Theme {
    if (typeof window === 'undefined') {
      return 'light'; // SSR fallback
    }
    
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme;
    return stored && ['light', 'dark', 'system'].includes(stored) ? stored : 'light';
  }

  /**
   * Apply theme class to document element
   */
  private applyThemeToDOM(theme: EffectiveTheme): void {
    if (typeof document === 'undefined') {
      return; // SSR guard
    }
    
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', theme);
  }

  /**
   * Get theme icon name for UI display
   */
  getThemeIcon(theme?: Theme): string {
    const targetTheme = theme || this._currentTheme();
    
    switch (targetTheme) {
      case 'light':
        return 'heroSun';
      case 'dark':
        return 'heroMoon';
      case 'system':
        return 'heroComputerDesktop';
      default:
        return 'heroSun';
    }
  }

  /**
   * Get theme display name for UI
   */
  getThemeDisplayName(theme?: Theme): string {
    const targetTheme = theme || this._currentTheme();
    
    switch (targetTheme) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Oscuro';
      case 'system':
        return 'Sistema';
      default:
        return 'Claro';
    }
  }
}