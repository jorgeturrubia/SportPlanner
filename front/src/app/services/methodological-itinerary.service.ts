import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MethodologicalItinerary {
  id: number;
  name: string;
  description?: string;
  sportId: number;
  sportName?: string;
  isSystem: boolean;
  ownerId?: string;
  isActive: boolean;
  planningTemplates?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MethodologicalItineraryService {
  private apiUrl = `${environment.apiUrl}/api/methodological-itineraries`;

  constructor(private http: HttpClient) {}

  getMyItineraries(): Observable<MethodologicalItinerary[]> {
    return this.http.get<MethodologicalItinerary[]>(this.apiUrl);
  }

  getById(id: number): Observable<MethodologicalItinerary> {
    return this.http.get<MethodologicalItinerary>(`${this.apiUrl}/${id}`);
  }

  create(itinerary: MethodologicalItinerary): Observable<MethodologicalItinerary> {
    return this.http.post<MethodologicalItinerary>(this.apiUrl, itinerary);
  }

  update(id: number, itinerary: MethodologicalItinerary): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, itinerary);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
