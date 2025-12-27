import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanningTemplate } from '../core/models/planning-template.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanningTemplateService {
  private apiUrl = `${environment.apiUrl}/planningtemplates`;

  constructor(private http: HttpClient) { }

  getMyTemplates(sportId?: number): Observable<PlanningTemplate[]> {
    const url = sportId ? `${this.apiUrl}?sportId=${sportId}` : this.apiUrl;
    return this.http.get<PlanningTemplate[]>(url);
  }

  getById(id: number): Observable<PlanningTemplate> {
    return this.http.get<PlanningTemplate>(`${this.apiUrl}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  create(template: PlanningTemplate): Observable<PlanningTemplate> {
    return this.http.post<PlanningTemplate>(this.apiUrl, template);
  }

  update(template: PlanningTemplate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${template.id}`, template);
  }

  updateConcepts(templateId: number, concepts: any[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${templateId}/concepts`, concepts);
  }
}
