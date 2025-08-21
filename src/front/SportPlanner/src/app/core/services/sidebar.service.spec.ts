import { TestBed } from '@angular/core/testing';
import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should start with expanded sidebar on desktop', () => {
      expect(service.isCollapsed()).toBe(false);
      expect(service.isMobileOpen()).toBe(false);
    });

    it('should load collapsed state from localStorage', () => {
      localStorage.setItem('sidebar-collapsed', 'true');
      service = TestBed.inject(SidebarService);
      expect(service.isCollapsed()).toBe(true);
    });

    it('should default to expanded when localStorage has invalid value', () => {
      localStorage.setItem('sidebar-collapsed', 'invalid');
      service = TestBed.inject(SidebarService);
      expect(service.isCollapsed()).toBe(false);
    });
  });

  describe('Sidebar Toggle', () => {
    it('should toggle collapsed state', () => {
      expect(service.isCollapsed()).toBe(false);
      
      service.toggle();
      expect(service.isCollapsed()).toBe(true);
      
      service.toggle();
      expect(service.isCollapsed()).toBe(false);
    });

    it('should collapse sidebar', () => {
      service.collapse();
      expect(service.isCollapsed()).toBe(true);
    });

    it('should expand sidebar', () => {
      service.collapse();
      expect(service.isCollapsed()).toBe(true);
      
      service.expand();
      expect(service.isCollapsed()).toBe(false);
    });

    it('should persist collapsed state to localStorage', () => {
      service.collapse();
      expect(localStorage.getItem('sidebar-collapsed')).toBe('true');
      
      service.expand();
      expect(localStorage.getItem('sidebar-collapsed')).toBe('false');
    });
  });

  describe('Mobile Behavior', () => {
    it('should set mobile open state', () => {
      service.setMobileOpen(true);
      expect(service.isMobileOpen()).toBe(true);
      
      service.setMobileOpen(false);
      expect(service.isMobileOpen()).toBe(false);
    });

    it('should close mobile sidebar', () => {
      service.setMobileOpen(true);
      expect(service.isMobileOpen()).toBe(true);
      
      service.closeMobile();
      expect(service.isMobileOpen()).toBe(false);
    });

    it('should toggle mobile sidebar', () => {
      expect(service.isMobileOpen()).toBe(false);
      
      service.toggleMobile();
      expect(service.isMobileOpen()).toBe(true);
      
      service.toggleMobile();
      expect(service.isMobileOpen()).toBe(false);
    });
  });

  describe('Computed State', () => {
    it('should provide complete sidebar state', () => {
      const state = service.sidebarState();
      
      expect(state).toEqual({
        isCollapsed: false,
        isMobileOpen: false,
        width: 280,
        collapsedWidth: 64
      });
    });

    it('should update state when collapsed changes', () => {
      service.collapse();
      const state = service.sidebarState();
      
      expect(state.isCollapsed).toBe(true);
    });

    it('should update state when mobile open changes', () => {
      service.setMobileOpen(true);
      const state = service.sidebarState();
      
      expect(state.isMobileOpen).toBe(true);
    });
  });

  describe('Responsive Behavior', () => {
    it('should detect mobile breakpoint', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      });
      
      expect(service.isMobileBreakpoint()).toBe(true);
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      });
      
      expect(service.isMobileBreakpoint()).toBe(false);
    });

    it('should handle window resize', () => {
      const resizeEvent = new Event('resize');
      
      // Set mobile width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600
      });
      
      window.dispatchEvent(resizeEvent);
      expect(service.isMobileBreakpoint()).toBe(true);
    });
  });

  describe('SSR Compatibility', () => {
    it('should handle undefined window gracefully', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      expect(() => {
        service = TestBed.inject(SidebarService);
      }).not.toThrow();
      
      global.window = originalWindow;
    });
  });
});