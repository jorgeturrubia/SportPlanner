import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


export type SportType = 'football' | 'basketball' | 'futsal' | 'handball';
export type ToolType = 'cursor' | 'player' | 'ball' | 'cone' | 'arrow' | 'pass' | 'block' | 'movement' | 'shot' | 
  'dribbling' | 'bounce-pass' | 'pivot' | 'hand-off' | 'cut' | 'rebound' | 
  'jump-stop-1' | 'jump-stop-2' | 'coach' | 'defender' | 'attacker' | 'sequence' | 'eraser';
export type ViewMode = 'full' | 'half';
export type LineStyle = 'solid' | 'dashed' | 'dotted' | 'wavy' | 'curved' | 'curved-dashed' | 'double-arrow' | 'zigzag' | 'shot-basket';

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
  private defenderCount = 1;
  private attackerCount = 1;
  private sequenceCount = 1;

  private slidesSubject = new BehaviorSubject<string[]>([]);
  slides$ = this.slidesSubject.asObservable();

  private activeSlideIndexSubject = new BehaviorSubject<number>(-1);
  activeSlideIndex$ = this.activeSlideIndexSubject.asObservable();

  private captureRequestSubject = new Subject<void>();
  captureRequest$ = this.captureRequestSubject.asObservable();

  private loadRequestSubject = new BehaviorSubject<{json: string, index: number} | null>(null);
  loadRequest$ = this.loadRequestSubject.asObservable();

  private clearBoardSubject = new Subject<void>();
  clearBoard$ = this.clearBoardSubject.asObservable();

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

  getNextDefenderNumber(): number {
    return this.defenderCount++;
  }

  getNextAttackerNumber(): number {
    return this.attackerCount++;
  }

  getNextSequenceNumber(): number {
    return this.sequenceCount++;
  }

  resetCounters() {
    this.playerCounts = {};
    this.defenderCount = 1;
    this.attackerCount = 1;
    this.sequenceCount = 1;
  }

  // Slide Management
  requestCapture() {
    this.captureRequestSubject.next();
  }

  saveSlide(json: string) {
    const current = [...this.slidesSubject.value];
    const activeIndex = this.activeSlideIndexSubject.value;
    
    if (activeIndex >= 0 && activeIndex < current.length) {
      // Update existing
      current[activeIndex] = json;
      this.slidesSubject.next(current);
    } else {
      // Add new
      const newIndex = current.length;
      this.slidesSubject.next([...current, json]);
      this.activeSlideIndexSubject.next(newIndex);
    }
  }

  loadSlide(json: string, index: number) {
    this.activeSlideIndexSubject.next(index);
    this.loadRequestSubject.next({ json, index });
  }

  prepareNewSlide() {
    this.activeSlideIndexSubject.next(-1);
  }

  clearBoard() {
    this.clearBoardSubject.next();
    this.resetCounters();
  }

  resetAll() {
    this.slidesSubject.next([]);
    this.activeSlideIndexSubject.next(-1);
    this.clearBoard();
  }

  getSlidesCount(): number {
    return this.slidesSubject.value.length;
  }

  deleteSlide(index: number) {
    const current = [...this.slidesSubject.value];
    current.splice(index, 1);
    this.slidesSubject.next(current);
    
    // Update active index if it was the deleted one or after it
    const active = this.activeSlideIndexSubject.value;
    if (active === index) {
      this.activeSlideIndexSubject.next(-1);
    } else if (active > index) {
      this.activeSlideIndexSubject.next(active - 1);
    }
  }
}
