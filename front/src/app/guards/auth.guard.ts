import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);
  const session = supabase.session$.getValue();
  if (!session) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
