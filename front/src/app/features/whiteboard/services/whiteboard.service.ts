import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


export type SportType = 'football' | 'basketball' | 'futsal' | 'handball';
export type ToolType = 'cursor' | 'player' | 'ball' | 'cone' | 'arrow' | 'pass' | 'block' | 'movement' | 'shot';
export type ViewMode = 'full' | 'half';
export type LineStyle = 'solid' | 'dashed' | 'dotted' | 'wavy';

@Injectable({
  providedIn: 'root'
})
export class WhiteboardService {
  private currentSportSubject = new BehaviorSubject<SportType>('football');
  currentSport$ = this.currentSportSubject.asObservable();

  private activeToolSubject = new BehaviorSubject<ToolType>('cursor');
  activeTool$ = this.activeToolSubject.asObservable();

  private viewModeSubject = new BehaviorSubject<ViewMode>('full');
  viewMode$ = this.viewModeSubject.asObservable();

  private activeColorSubject = new BehaviorSubject<string>('#e74c3c'); // Default Red
  activeColor$ = this.activeColorSubject.asObservable();

  private playerCounts: { [color: string]: number } = {};

  private slidesSubject = new BehaviorSubject<string[]>([]);
  slides$ = this.slidesSubject.asObservable();

  private captureRequestSubject = new Subject<void>();
  captureRequest$ = this.captureRequestSubject.asObservable();

  private loadRequestSubject = new BehaviorSubject<string | null>(null);
  loadRequest$ = this.loadRequestSubject.asObservable();

  constructor() { }

  setSport(sport: SportType) {
    this.currentSportSubject.next(sport);
  }

  setTool(tool: ToolType) {
    this.activeToolSubject.next(tool);
  }

  setViewMode(mode: ViewMode) {
    this.viewModeSubject.next(mode);
  }

  setColor(color: string) {
    this.activeColorSubject.next(color);
  }

  getNextPlayerNumber(color: string): number {
    if (!this.playerCounts[color]) {
      this.playerCounts[color] = 1;
    }
    return this.playerCounts[color]++;
  }

  resetCounters() {
    this.playerCounts = {};
  }

  // Slide Management
  requestCapture() {
    this.captureRequestSubject.next();
  }

  saveSlide(json: string) {
    const current = this.slidesSubject.value;
    this.slidesSubject.next([...current, json]);
  }

  loadSlide(json: string) {
    this.loadRequestSubject.next(json);
  }

  getSlidesCount(): number {
    return this.slidesSubject.value.length;
  }
}
