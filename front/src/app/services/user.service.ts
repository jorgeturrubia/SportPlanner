import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BackendUserDto {
  id: string;
  email?: string;
  name?: string;
  userName?: string;
  supabaseUserId?: string;
}

export interface DebugClaimsResponse {
  isAuthenticated: boolean;
  claimsCount: number;
  claims: Array<{ type: string; value: string }>;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  me(): Observable<BackendUserDto> {
    return this.http.get<BackendUserDto>(`${environment.apiUrl}/auth/me`);
  }

  debugClaims(): Observable<DebugClaimsResponse> {
    return this.http.get<DebugClaimsResponse>(`${environment.apiUrl}/auth/debug-claims`);
  }
}
