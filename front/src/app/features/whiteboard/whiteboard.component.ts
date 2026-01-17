import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CanvasComponent } from './components/canvas/canvas.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { WhiteboardService } from './services/whiteboard.service';

@Component({
  selector: 'app-whiteboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CanvasComponent, ToolbarComponent],
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.css']
})
export class WhiteboardComponent implements OnDestroy {
  slides$;
  activeSlideIndex$;
  isPlaying = false;
  playbackSpeed = 1; // 1x, 1.5x, 2x
  isLooping = false;
  loopCount = 1; // Number of loops if isLooping is true
  currentLoop = 0;
  
  private playbackInterval: any = null;
  private currentSlideIndex = 0;

  constructor(private whiteboardService: WhiteboardService) {
    this.slides$ = this.whiteboardService.slides$;
    this.activeSlideIndex$ = this.whiteboardService.activeSlideIndex$;
  }

  ngOnDestroy(): void {
    this.stopPlayback();
  }

  addSlide() {
    this.whiteboardService.prepareNewSlide();
    this.whiteboardService.requestCapture();
  }

  clearBoard() {
    this.whiteboardService.clearBoard();
  }

  resetAll() {
    if (confirm('¿Estás seguro de que quieres borrar TODA la pizarra y todas las escenas?')) {
      this.whiteboardService.resetAll();
    }
  }

  deleteSlide(event: Event, index: number) {
    event.stopPropagation();
    this.whiteboardService.deleteSlide(index);
  }

  loadSlide(json: string, index: number) {
    this.whiteboardService.loadSlide(json, index);
  }

  setPlaybackSpeed(speed: number) {
    this.playbackSpeed = speed;
    if (this.isPlaying) {
      this.stopPlayback();
      this.startPlayback();
    }
  }

  toggleLoop() {
    this.isLooping = !this.isLooping;
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.stopPlayback();
    } else {
      this.startPlayback();
    }
  }

  private startPlayback() {
    const allSlides = this.whiteboardService.getSlidesCount();
    if (allSlides === 0) return;

    this.isPlaying = true;
    this.currentSlideIndex = 0;
    this.currentLoop = 0;

    const baseInterval = 1500;
    const intervalTime = baseInterval / this.playbackSpeed;

    this.playbackInterval = setInterval(() => {
      this.whiteboardService.slides$.subscribe(slides => {
        this.currentSlideIndex++;
        
        if (this.currentSlideIndex >= slides.length) {
          if (this.isLooping && (this.currentLoop < this.loopCount - 1 || this.loopCount === 0)) {
            this.currentSlideIndex = 0;
            this.currentLoop++;
          } else {
            this.stopPlayback();
            return;
          }
        }

        if (slides.length > 0) {
          this.loadSlide(slides[this.currentSlideIndex], this.currentSlideIndex);
        }
      }).unsubscribe();
    }, intervalTime);
  }

  private stopPlayback() {
    this.isPlaying = false;
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
  }
}
