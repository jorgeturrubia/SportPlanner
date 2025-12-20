import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConceptTemplate, ConceptTemplateCreate, ConceptTemplateUpdate } from '../core/models/concept-template.model';

@Injectable({
    providedIn: 'root'
})
export class ConceptTemplatesService {
    private apiUrl = `${environment.apiUrl}/concepttemplates`;

    constructor(private http: HttpClient) { }

    getTemplates(sportId?: number): Observable<ConceptTemplate[]> {
        let params = new HttpParams();
        if (sportId) {
            params = params.set('sportId', sportId.toString());
        }
        return this.http.get<ConceptTemplate[]>(this.apiUrl, { params });
    }

    getTemplateById(id: number): Observable<ConceptTemplate> {
        return this.http.get<ConceptTemplate>(`${this.apiUrl}/${id}`);
    }

    createTemplate(data: ConceptTemplateCreate): Observable<ConceptTemplate> {
        return this.http.post<ConceptTemplate>(this.apiUrl, data);
    }

    updateTemplate(id: number, data: ConceptTemplateUpdate): Observable<ConceptTemplate> {
        return this.http.put<ConceptTemplate>(`${this.apiUrl}/${id}`, data);
    }

    deleteTemplate(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
