import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up DOM classes
    document.documentElement.classList.remove('dark', 'light');
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Theme Detection', () => {
    it('should detect system preference', () => {
      // Mock matchMedia for dark theme
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jasmine.createSpy().and.callFake((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jasmine.createSpy(),
          removeListener: jasmine.createSpy(),
          addEventListener: jasmine.createSpy(),
          removeEventListener: jasmine.createSpy(),
          dispatchEvent: jasmine.createSpy(),
        })),
      });

      service.detectSystemPreference();
      expect(service.systemPreference()).toBe('dark');
    });

    it('should default to light theme when no preference stored', () => {
      expect(service.currentTheme()).toBe('light');
    });

    it('should load stored theme preference from localStorage', () => {
      localStorage.setItem('theme-preference', 'dark');
      service = TestBed.inject(ThemeService);
      expect(service.currentTheme()).toBe('dark');
    });
  });

  describe('Theme Management', () => {
    it('should toggle between light and dark themes', () => {
      expect(service.currentTheme()).toBe('light');
      
      service.toggleTheme();
      expect(service.currentTheme()).toBe('dark');
      
      service.toggleTheme();
      expect(service.currentTheme()).toBe('light');
    });

    it('should set specific theme', () => {
      service.setTheme('dark');
      expect(service.currentTheme()).toBe('dark');
      
      service.setTheme('system');
      expect(service.currentTheme()).toBe('system');
    });

    it('should persist theme preference to localStorage', () => {
      service.setTheme('dark');
      expect(localStorage.getItem('theme-preference')).toBe('dark');
    });

    it('should apply theme class to document element', () => {
      service.setTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      
      service.setTheme('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('System Theme Handling', () => {
    it('should follow system preference when theme is set to system', () => {
      // Mock system preference as dark
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jasmine.createSpy().and.callFake((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jasmine.createSpy(),
          removeListener: jasmine.createSpy(),
          addEventListener: jasmine.createSpy(),
          removeEventListener: jasmine.createSpy(),
          dispatchEvent: jasmine.createSpy(),
        })),
      });

      service.setTheme('system');
      expect(service.effectiveTheme()).toBe('dark');
    });

    it('should update when system preference changes', () => {
      let mediaQueryCallback: any = null;
      
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jasmine.createSpy().and.callFake(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jasmine.createSpy(),
          removeListener: jasmine.createSpy(),
          addEventListener: jasmine.createSpy().and.callFake((event: string, callback: any) => {
            if (event === 'change') {
              mediaQueryCallback = callback;
            }
          }),
          removeEventListener: jasmine.createSpy(),
          dispatchEvent: jasmine.createSpy(),
        })),
      });

      service.setTheme('system');
      
      // Simulate system preference change
      if (mediaQueryCallback) {
        mediaQueryCallback({ matches: true } as MediaQueryListEvent);
        expect(service.systemPreference()).toBe('dark');
      }
    });
  });
});