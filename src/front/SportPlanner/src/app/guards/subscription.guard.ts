import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of, timeout, throwError } from 'rxjs';
import { SubscriptionService } from '../services/subscription.service';
import { AuthService } from '../services/auth.service';

export const subscriptionGuard: CanActivateFn = (route, state) => {
  const subscriptionService = inject(SubscriptionService);
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔒 Subscription guard activated for:', state.url);

  // If user is not authenticated, redirect to login
  if (!authService.isAuthenticated()) {
    console.log('🔒 Subscription guard: User not authenticated, redirecting to auth');
    router.navigate(['/auth'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  console.log('🔒 Subscription guard: User authenticated, checking subscription status...');

  // Check subscription status with timeout
  return subscriptionService.getSubscriptionStatus().pipe(
    timeout({
      each: 10000,
      with: () => throwError(() => new Error('Timeout checking subscription status in guard'))
    }),
    map(status => {
      console.log('🔒 Subscription guard: Status received:', status);

      if (status.hasActiveSubscription) {
        console.log('🔒 Subscription guard: Active subscription found, allowing access');
        return true;
      } else {
        console.log('🔒 Subscription guard: No active subscription, redirecting to subscription page');
        // Redirect to subscription page if no active subscription
        router.navigate(['/subscription']);
        return false;
      }
    }),
    catchError(error => {
      console.error('🔒 Subscription guard: Error checking subscription status:', error);
      // In case of error, redirect to subscription page for safety
      console.log('🔒 Subscription guard: Error occurred, redirecting to subscription page for safety');
      router.navigate(['/subscription']);
      return of(false);
    })
  );
};

export const noSubscriptionGuard: CanActivateFn = (route, state) => {
  const subscriptionService = inject(SubscriptionService);
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔓 No-subscription guard activated for:', state.url);

  // If user is not authenticated, redirect to login
  if (!authService.isAuthenticated()) {
    console.log('🔓 No-subscription guard: User not authenticated, redirecting to auth');
    router.navigate(['/auth'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  console.log('🔓 No-subscription guard: User authenticated, checking subscription status...');

  // Check subscription status with timeout
  return subscriptionService.getSubscriptionStatus().pipe(
    timeout({
      each: 10000,
      with: () => throwError(() => new Error('Timeout checking subscription status in no-subscription guard'))
    }),
    map(status => {
      console.log('🔓 No-subscription guard: Status received:', status);

      if (status.hasActiveSubscription) {
        console.log('🔓 No-subscription guard: Active subscription found, redirecting to dashboard');
        // If user has subscription, redirect to dashboard
        router.navigate(['/dashboard']);
        return false;
      } else {
        console.log('🔓 No-subscription guard: No active subscription, allowing access to subscription page');
        // Allow access to subscription page
        return true;
      }
    }),
    catchError(error => {
      console.error('🔓 No-subscription guard: Error checking subscription status:', error);
      // In case of error, allow access to subscription page for safety
      console.log('🔓 No-subscription guard: Error occurred, allowing access to subscription page');
      return of(true);
    })
  );
};
