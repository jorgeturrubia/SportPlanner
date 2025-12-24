import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Planning, CreatePlanning, UpdatePlanning, PlanMonitor } from '../core/models/planning.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private apiUrl = `${environment.apiUrl}/plannings`;

  constructor(private http: HttpClient) { }

  getPlannings(teamId?: number, seasonId?: number): Observable<Planning[]> {
    let params = [];
    if (teamId) params.push(`teamId=${teamId}`);
    if (seasonId) params.push(`seasonId=${seasonId}`);

    const queryString = params.length ? `?${params.join('&')}` : '';
    return this.http.get<Planning[]>(`${this.apiUrl}${queryString}`);
  }

  getPlanning(id: number): Observable<Planning> {
    return this.http.get<Planning>(`${this.apiUrl}/${id}`);
  }

  createPlanning(planning: CreatePlanning): Observable<Planning> {
    return this.http.post<Planning>(this.apiUrl, planning);
  }

  updatePlanning(id: number, planning: UpdatePlanning): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, planning);
  }

  deletePlanning(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getPlanMonitor(id: number): Observable<PlanMonitor> {
    return this.http.get<PlanMonitor>(`${this.apiUrl}/${id}/monitor`);
  }
}
