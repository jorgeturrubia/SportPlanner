import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { filter, map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);
  
  return supabase.session$.pipe(
    filter(session => session !== undefined), // Wait for initialization
    take(1),
    map(session => {
      if (!session) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
