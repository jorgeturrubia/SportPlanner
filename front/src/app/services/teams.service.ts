import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsService {
    constructor(private http: HttpClient) { }

    getMyTeams(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/teams/my-teams`);
    }

    getTeam(id: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/teams/${id}`);
    }

    createTeam(team: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/teams`, team);
    }

    updateTeam(id: number, team: any): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/teams/${id}`, team);
    }

    deleteTeam(id: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}/teams/${id}`);
    }

    toggleActive(id: number): Observable<any> {
        return this.http.patch<any>(`${environment.apiUrl}/teams/${id}/toggle-active`, {});
    }
}
