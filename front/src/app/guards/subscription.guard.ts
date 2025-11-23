import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SubscriptionsService } from '../services/subscriptions.service';
import { map, catchError, of } from 'rxjs';

export const subscriptionGuard: CanActivateFn = (route, state) => {
    const subscriptionsService = inject(SubscriptionsService);
    const router = inject(Router);

    return subscriptionsService.getMySubscriptions().pipe(
        map(subscriptions => {
            if (subscriptions && subscriptions.length > 0) {
                // User has at least one active subscription
                return true;
            } else {
                // No active subscriptions, redirect to subscription page
                router.navigate(['/subscription']);
                return false;
            }
        }),
        catchError(() => {
            // On error, redirect to subscription page
            router.navigate(['/subscription']);
            return of(false);
        })
    );
};
