import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return new Observable(observer => {
      const isAuthenticated = this.authService.isLoggedIn()();
      
      if (isAuthenticated) {
        observer.next(true);
      } else {
        this.router.navigate(['/auth/login']);
        observer.next(false);
      }
      
      observer.complete();
    });
  }
}