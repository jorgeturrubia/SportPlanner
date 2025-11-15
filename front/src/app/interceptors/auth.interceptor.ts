import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private supabase: SupabaseService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only attach Authorization for backend API calls
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }
    const token = this.supabase.getAccessToken();
    if (token) {
      const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      return next.handle(cloned).pipe(
        catchError((err) => {
          if (err?.status === 401) {
            // Sign out locally and navigate to login: token expired or invalid
            this.supabase.signOut();
            this.router.navigate(['/login']);
          }
          return throwError(() => err);
        })
      );
    }
    return next.handle(req).pipe(
      catchError((err) => {
        if (err?.status === 401) {
          this.supabase.signOut();
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }
}
