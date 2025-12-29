import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SportConcept } from '../core/models/sport-concept.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SportConceptService {
  private apiUrl = `${environment.apiUrl}/sportconcepts`;

  constructor(private http: HttpClient) { }

  getConcepts(): Observable<SportConcept[]> {
    return this.http.get<SportConcept[]>(this.apiUrl);
  }

  getSuggestions(teamId: number): Observable<SportConcept[]> {
    return this.http.get<SportConcept[]>(`${this.apiUrl}/suggestions/${teamId}`);
  }

  create(concept: any): Observable<SportConcept> {
    return this.http.post<SportConcept>(this.apiUrl, concept);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/conceptcategories`);
  }

  update(id: number, data: any): Observable<SportConcept> {
    return this.http.put<SportConcept>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
