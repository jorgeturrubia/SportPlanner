import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  TacticalBoard,
  CreateTacticalBoardDto,
  UpdateTacticalBoardDto,
} from '../core/models/tactical-board.model';

@Injectable({
  providedIn: 'root',
})
export class TacticalBoardService {
  private apiUrl = `${environment.apiUrl}/tacticalboards`;

  constructor(private http: HttpClient) {}

  getAll(exerciseId?: number): Observable<TacticalBoard[]> {
    let params = new HttpParams();
    if (exerciseId) {
      params = params.set('exerciseId', exerciseId.toString());
    }
    return this.http.get<TacticalBoard[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<TacticalBoard> {
    return this.http.get<TacticalBoard>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateTacticalBoardDto): Observable<TacticalBoard> {
    return this.http.post<TacticalBoard>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateTacticalBoardDto): Observable<TacticalBoard> {
    return this.http.put<TacticalBoard>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
