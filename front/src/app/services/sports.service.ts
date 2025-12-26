import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { PlanningTemplateDto } from '../features/proposals/models/proposal.models';

export interface Sport {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    isActive: boolean;
}

export interface CreateSportDto {
    name: string;
    description?: string;
    isActive: boolean;
}

export interface UpdateSportDto {
    name: string;
    description?: string;
    isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class SportsService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Sport[]> {
        return this.http.get<Sport[]>(`${environment.apiUrl}/sports`);
    }

    getById(id: number): Observable<Sport> {
        return this.http.get<Sport>(`${environment.apiUrl}/sports/${id}`);
    }

    create(dto: CreateSportDto): Observable<Sport> {
        return this.http.post<Sport>(`${environment.apiUrl}/sports`, dto);
    }

    update(id: number, dto: UpdateSportDto): Observable<Sport> {
        return this.http.put<Sport>(`${environment.apiUrl}/sports/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/sports/${id}`);
    }

    getTemplates(id: number): Observable<PlanningTemplateDto[]> {
        return this.http.get<PlanningTemplateDto[]>(`${environment.apiUrl}/sports/${id}/itineraries`);
    }
}
