import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MethodologicalItinerary, MarketplaceFilter, RateItineraryRequest, PlanningTemplateSimple } from '../core/models/planning-template.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private apiUrl = `${environment.apiUrl}/marketplace`;

  constructor(private http: HttpClient) { }

  search(filter: MarketplaceFilter): Observable<MethodologicalItinerary[]> {
    let params = new HttpParams();
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.minRating) params = params.set('minRating', filter.minRating.toString());
    if (filter.teamCategoryId) params = params.set('teamCategoryId', filter.teamCategoryId.toString());

    return this.http.get<MethodologicalItinerary[]>(this.apiUrl, { params });
  }

  download(id: number): Observable<PlanningTemplateSimple[]> {
    return this.http.post<PlanningTemplateSimple[]>(`${this.apiUrl}/download/${id}`, {});
  }

  rate(request: RateItineraryRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/rate`, request);
  }

  getMyRating(itineraryId: number): Observable<number | null> {
    return this.http.get<number | null>(`${this.apiUrl}/my-rating/${itineraryId}`);
  }
}
