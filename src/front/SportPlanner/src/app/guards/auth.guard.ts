import { inject } from '@angular/core';
import { Router, type CanActivateFn, type CanActivateChildFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Functional guard to protect routes that require authentication
 * Redirects unauthenticated users to the auth page
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  try {
    const isAuthenticated = await authService.checkAuthState();
    
    if (isAuthenticated) {
      return true;
    } else {
      // Store the attempted URL for redirect after login
      const redirectUrl = state.url !== '/auth' ? state.url : '/dashboard';
      
      notificationService.showWarning('Debes iniciar sesión para acceder a esta página.');
      
      return router.createUrlTree(['/auth'], { 
        queryParams: { redirectUrl } 
      });
    }
  } catch (error) {
    console.error('Auth guard error:', error);
    notificationService.showError('Error al verificar la autenticación.');
    
    return router.createUrlTree(['/auth']);
  }
};

/**
 * Functional guard for child routes that require authentication
 */
export const authChildGuard: CanActivateChildFn = (childRoute, state) => {
  return authGuard(childRoute, state);
};

/**
 * Functional guard to prevent authenticated users from accessing guest-only pages
 * Redirects authenticated users to the dashboard
 */
export const guestGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const isAuthenticated = await authService.checkAuthState();
    
    if (!isAuthenticated) {
      return true;
    } else {
      // Check for redirect URL in query params
      const redirectUrl = route.queryParams?.['redirectUrl'] || '/dashboard';
      
      return router.createUrlTree([redirectUrl]);
    }
  } catch (error) {
    console.error('Guest guard error:', error);
    // Allow access if there's an error checking auth state
    return true;
  }
};

/**
 * Functional guard for routes that require specific user roles
 * Usage: canActivate: [roleGuard(['admin', 'coach'])]
 */
export const createRoleGuard = (allowedRoles: string[]): CanActivateFn => {
  return async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    try {
      const isAuthenticated = await authService.checkAuthState();
      
      if (!isAuthenticated) {
        notificationService.showWarning('Debes iniciar sesión para acceder a esta página.');
        return router.createUrlTree(['/auth'], { 
          queryParams: { redirectUrl: state.url } 
        });
      }

      const currentUser = authService.currentUser();
      
      if (!currentUser) {
        notificationService.showError('No se pudo verificar tu usuario.');
        return router.createUrlTree(['/auth']);
      }

      // Check if user role is allowed (convert enum to string for comparison)
      const userRole = currentUser.role.toString().toLowerCase();
      const hasPermission = allowedRoles.some(role => 
        role.toLowerCase() === userRole
      );

      if (hasPermission) {
        return true;
      } else {
        notificationService.showError('No tienes permisos para acceder a esta página.');
        return router.createUrlTree(['/dashboard']);
      }
    } catch (error) {
      console.error('Role guard error:', error);
      notificationService.showError('Error al verificar los permisos.');
      return router.createUrlTree(['/dashboard']);
    }
  };
};

/**
 * Functional guard that shows a loading state while checking authentication
 * Useful for routes that need to wait for auth initialization
 */
export const authLoadingGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth service to initialize
  while (authService.isLoading()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const isAuthenticated = await authService.checkAuthState();
  
  if (isAuthenticated) {
    return true;
  } else {
    return router.createUrlTree(['/auth'], { 
      queryParams: { redirectUrl: state.url } 
    });
  }
};