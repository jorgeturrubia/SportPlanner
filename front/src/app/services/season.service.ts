import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Season, CreateSeasonDto, UpdateSeasonDto } from '../models/season.model';

@Injectable({
    providedIn: 'root'
})
export class SeasonService {
    private apiUrl = `${environment.apiUrl}/seasons`;

    // State for the currently selected season (Global Context)
    // Initialize from localStorage if available
    private currentSeasonSignal = signal<Season | null>(this.loadSeasonFromStorage());

    public currentSeason = computed(() => this.currentSeasonSignal());

    private seasonsRefreshSubject = new Subject<void>();
    public seasonsRefreshed$ = this.seasonsRefreshSubject.asObservable();

    constructor(private http: HttpClient) { }

    private loadSeasonFromStorage(): Season | null {
        const stored = localStorage.getItem('selectedSeason');
        return stored ? JSON.parse(stored) : null;
    }

    public setSeason(season: Season | null) {
        this.currentSeasonSignal.set(season);
        if (season) {
            localStorage.setItem('selectedSeason', JSON.stringify(season));
        } else {
            localStorage.removeItem('selectedSeason');
        }
    }

    public refreshSeasonsList() {
        this.seasonsRefreshSubject.next();
    }

    getSeasons(organizationId?: number): Observable<Season[]> {
        let url = this.apiUrl;
        if (organizationId) {
            url += `?organizationId=${organizationId}`;
        }
        return this.http.get<Season[]>(url);
    }

    getSeason(id: number): Observable<Season> {
        return this.http.get<Season>(`${this.apiUrl}/${id}`);
    }

    createSeason(season: CreateSeasonDto): Observable<Season> {
        return this.http.post<Season>(this.apiUrl, season).pipe(
            tap(() => this.refreshSeasonsList())
        );
    }

    updateSeason(id: number, season: UpdateSeasonDto): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, season).pipe(
            tap(() => this.refreshSeasonsList())
        );
    }

    deleteSeason(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.refreshSeasonsList())
        );
    }
}
