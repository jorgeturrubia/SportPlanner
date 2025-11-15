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

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  me(): Observable<BackendUserDto> {
    return this.http.get<BackendUserDto>(`${environment.apiUrl}/auth/me`);
  }
}
