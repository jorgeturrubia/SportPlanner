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
}
