import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Exercise, CreateExerciseDto } from '../core/models/exercise.model';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
    private apiUrl = `${environment.apiUrl}/exercises`;

    constructor(private http: HttpClient) { }

    getAll(conceptId?: number): Observable<Exercise[]> {
        const params: any = {};
        if (conceptId) params.conceptId = conceptId;
        return this.http.get<Exercise[]>(this.apiUrl, { params });
    }

    getById(id: number): Observable<Exercise> {
        return this.http.get<Exercise>(`${this.apiUrl}/${id}`);
    }

    create(dto: CreateExerciseDto): Observable<Exercise> {
        return this.http.post<Exercise>(this.apiUrl, dto);
    }

    update(id: number, dto: CreateExerciseDto): Observable<Exercise> {
        return this.http.put<Exercise>(`${this.apiUrl}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
