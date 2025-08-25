import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Planning, CreatePlanningRequest } from '../models/planning.model';
import { TeamLevel } from '../models/team.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private apiUrl = `${environment.apiUrl}/api/plannings`;

  constructor(private http: HttpClient) {}

  getPlannings(): Observable<Planning[]> {
    return this.http.get<Planning[]>(this.apiUrl);
  }

  getPlanning(id: string): Observable<Planning> {
    return this.http.get<Planning>(`${this.apiUrl}/${id}`);
  }

  createPlanning(planning: CreatePlanningRequest): Observable<Planning> {
    return this.http.post<Planning>(this.apiUrl, planning);
  }

  generateTrainingSessions(planningId: string): Observable<{ message: string; sessionsCount: number }> {
    return this.http.post<{ message: string; sessionsCount: number }>(
      `${this.apiUrl}/${planningId}/generate-sessions`, 
      {}
    );
  }

  getMarketplacePlannings(filters?: {
    sport?: string;
    category?: string;
    level?: TeamLevel;
    page?: number;
    pageSize?: number;
  }): Observable<Planning[]> {
    let params = new HttpParams();
    
    if (filters?.sport) {
      params = params.set('sport', filters.sport);
    }
    if (filters?.category) {
      params = params.set('category', filters.category);
    }
    if (filters?.level !== undefined) {
      params = params.set('level', filters.level.toString());
    }
    if (filters?.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters?.pageSize) {
      params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<Planning[]>(`${this.apiUrl}/marketplace`, { params });
  }
}