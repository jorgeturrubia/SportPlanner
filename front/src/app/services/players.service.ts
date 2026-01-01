import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Player, CreatePlayerDto, UpdatePlayerDto } from '../core/models/player.model';

@Injectable({ providedIn: 'root' })
export class PlayersService {
    private http = inject(HttpClient);

    getTeamPlayers(teamId: number): Observable<Player[]> {
        return this.http.get<Player[]>(`${environment.apiUrl}/players/team/${teamId}`);
    }

    getPlayer(id: number): Observable<Player> {
        return this.http.get<Player>(`${environment.apiUrl}/players/${id}`);
    }

    createPlayer(player: CreatePlayerDto): Observable<Player> {
        return this.http.post<Player>(`${environment.apiUrl}/players`, player);
    }

    updatePlayer(id: number, player: UpdatePlayerDto): Observable<Player> {
        return this.http.put<Player>(`${environment.apiUrl}/players/${id}`, player);
    }

    deletePlayer(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/players/${id}`);
    }

    toggleActive(id: number): Observable<{ isActive: boolean }> {
        return this.http.patch<{ isActive: boolean }>(`${environment.apiUrl}/players/${id}/toggle-active`, {});
    }
}
