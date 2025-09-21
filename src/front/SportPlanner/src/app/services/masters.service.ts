import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Sport {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  minAge?: number;
  maxAge?: number;
  isActive: boolean;
  sportId: number;
  sportName: string;
}

export interface SportGender {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  sportId: number;
  sportName: string;
}

export interface Level {
  id: number;
  name: string;
  description?: string;
  difficulty: number;
  isActive: boolean;
  sportId: number;
  sportName: string;
}

@Injectable({
  providedIn: 'root'
})
export class MastersService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  // Signals for reactive data
  readonly sports = signal<Sport[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly sportGenders = signal<SportGender[]>([]);
  readonly levels = signal<Level[]>([]);

  // Load all masters data
  loadAllMasters(): Observable<void> {
    return forkJoin({
      sports: this.getSports(),
      categories: this.getCategories(),
      sportGenders: this.getSportGenders(),
      levels: this.getLevels()
    }).pipe(
      map(() => void 0)
    );
  }

  // Sports
  getSports(): Observable<Sport[]> {
    return this.http.get<Sport[]>(`${this.apiUrl}/sports`).pipe(
      tap(sports => this.sports.set(sports))
    );
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      tap(categories => this.categories.set(categories))
    );
  }

  getCategoriesBySport(sportId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/sport/${sportId}`);
  }

  // Sport Genders
  getSportGenders(): Observable<SportGender[]> {
    return this.http.get<SportGender[]>(`${this.apiUrl}/sportgenders`).pipe(
      tap(sportGenders => this.sportGenders.set(sportGenders))
    );
  }

  getSportGendersBySport(sportId: number): Observable<SportGender[]> {
    return this.http.get<SportGender[]>(`${this.apiUrl}/sportgenders/sport/${sportId}`);
  }

  // Levels
  getLevels(): Observable<Level[]> {
    return this.http.get<Level[]>(`${this.apiUrl}/levels`).pipe(
      tap(levels => this.levels.set(levels))
    );
  }

  getLevelsBySport(sportId: number): Observable<Level[]> {
    return this.http.get<Level[]>(`${this.apiUrl}/levels/sport/${sportId}`);
  }

  // Helper methods
  getSportById(id: number): Sport | undefined {
    return this.sports().find(sport => sport.id === id);
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories().find(category => category.id === id);
  }

  getSportGenderById(id: number): SportGender | undefined {
    return this.sportGenders().find(gender => gender.id === id);
  }

  getLevelById(id: number): Level | undefined {
    return this.levels().find(level => level.id === id);
  }
}