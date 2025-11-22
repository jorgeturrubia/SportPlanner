import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SportConceptsService {
    constructor(private http: HttpClient) { }

    getConcepts(sportId?: number): Observable<any[]> {
        const params = sportId ? { sportId: sportId.toString() } : {};
        return this.http.get<any[]>(`${environment.apiUrl}/sportConcepts`, { params });
    }

    getConceptById(id: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/sportConcepts/${id}`);
    }

    createConcept(data: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/sportConcepts`, data);
    }

    updateConcept(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/sportConcepts/${id}`, data);
    }

    deleteConcept(id: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}/sportConcepts/${id}`);
    }
}
