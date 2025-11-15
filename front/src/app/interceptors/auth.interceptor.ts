import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private supabase: SupabaseService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only attach Authorization for backend API calls
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }
    const token = this.supabase.getAccessToken();
    if (token) {
      const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
