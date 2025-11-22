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

    createTeam(team: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/teams`, team);
    }
}
