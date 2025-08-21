import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { map, take, filter, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if we have a token in localStorage first
  const token = authService.getAuthToken();
  if (!token) {
    router.navigate(['/auth']);
    return false;
  }

  return authService.currentUser$.pipe(
    // Wait for either a user to be loaded or timeout after 1 second
    timeout(1000),
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/auth']);
        return false;
      }
    }),
    catchError(() => {
      // If timeout or error, check localStorage one more time
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser && token) {
        try {
          JSON.parse(storedUser); // Validate JSON
          return of(true); // Allow access if valid data exists
        } catch {
          router.navigate(['/auth']);
          return of(false);
        }
      }
      router.navigate(['/login']);
      return of(false);
    })
  );
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check localStorage directly for faster response
  const token = authService.getAuthToken();
  if (token) {
    router.navigate(['/dashboard']);
    return false;
  }

  return authService.currentUser$.pipe(
    timeout(500),
    take(1),
    map(user => {
      if (!user) {
        return true;
      } else {
        router.navigate(['/dashboard']);
        return false;
      }
    }),
    catchError(() => {
      // If timeout, allow guest access
      return of(true);
    })
  );
};