import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface TeamLevel { id: number; name: string; rank?: number; description?: string }
export interface TeamCategory { id: number; name: string; minAge?: number; maxAge?: number; description?: string }

@Injectable({ providedIn: 'root' })
export class LookupService {
  constructor(private http: HttpClient) {}

  getTeamLevels(): Observable<TeamLevel[]> {
    return this.http.get<TeamLevel[]>(`${environment.apiUrl}/lookups/team-levels`);
  }

  getTeamCategories(): Observable<TeamCategory[]> {
    return this.http.get<TeamCategory[]>(`${environment.apiUrl}/lookups/team-categories`);
  }
}
