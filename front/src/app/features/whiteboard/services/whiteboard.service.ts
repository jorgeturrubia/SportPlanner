import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


export type SportType = 'football' | 'basketball' | 'futsal' | 'handball';
export type ToolType = 'cursor' | 'player' | 'ball' | 'cone' | 'arrow' | 'line' | 'zigzag';

@Injectable({
  providedIn: 'root'
})
export class WhiteboardService {
  private currentSportSubject = new BehaviorSubject<SportType>('football');
  currentSport$ = this.currentSportSubject.asObservable();

  private activeToolSubject = new BehaviorSubject<ToolType>('cursor');
  activeTool$ = this.activeToolSubject.asObservable();

  private activeColorSubject = new BehaviorSubject<string>('#e74c3c'); // Default Red
  activeColor$ = this.activeColorSubject.asObservable();

  // Counters for auto-numbering players by color
  private playerCounts: { [color: string]: number } = {};

  private slidesSubject = new BehaviorSubject<string[]>([]);
  slides$ = this.slidesSubject.asObservable();

  private captureRequestSubject = new Subject<void>();
  captureRequest$ = this.captureRequestSubject.asObservable(); // Emits when we want canvas to send us data

  private loadRequestSubject = new BehaviorSubject<string | null>(null);
  loadRequest$ = this.loadRequestSubject.asObservable();

  constructor() { }

  setSport(sport: SportType) {
    this.currentSportSubject.next(sport);
  }

  setTool(tool: ToolType) {
    this.activeToolSubject.next(tool);
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
