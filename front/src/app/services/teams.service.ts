import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SeasonService } from './season.service';

@Injectable({ providedIn: 'root' })
export class TeamsService {
    private http = inject(HttpClient);
    private seasonService = inject(SeasonService);

    getMyTeams(seasonId?: number): Observable<any[]> {
        const id = seasonId ?? this.seasonService.currentSeason()?.id;
        let url = `${environment.apiUrl}/teams/my-teams`;
        if (id) {
            url += `?seasonId=${id}`;
        }
        return this.http.get<any[]>(url);
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
