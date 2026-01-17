import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhiteboardService } from '../../services/whiteboard.service';

@Component({
  selector: 'app-footer-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-panel.component.html'
})
export class FooterPanelComponent implements OnDestroy {
  slides$;
  isPlaying = false;
  private playbackInterval: any = null;
  private currentSlideIndex = 0;
  
  constructor(private whiteboardService: WhiteboardService) {
    this.slides$ = this.whiteboardService.slides$;
  }

  ngOnDestroy(): void {
    this.stopPlayback();
  }

  addSlide() {
    this.whiteboardService.requestCapture();
  }

  loadSlide(json: string, index: number) {
    this.whiteboardService.loadSlide(json, index);
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.stopPlayback();
    } else {
      this.startPlayback();
    }
  }

  private startPlayback() {
    const slides = this.whiteboardService.getSlidesCount();
    if (slides === 0) return;

    this.isPlaying = true;
    this.currentSlideIndex = 0;

    // Load first slide
    this.slides$.subscribe(allSlides => {
      if (allSlides.length > 0) {
        this.loadSlide(allSlides[this.currentSlideIndex], this.currentSlideIndex);
      }
    }).unsubscribe();

    // Start interval
    this.playbackInterval = setInterval(() => {
      this.slides$.subscribe(allSlides => {
        this.currentSlideIndex++;
        if (this.currentSlideIndex >= allSlides.length) {
          this.currentSlideIndex = 0; // Loop
        }
        if (allSlides.length > 0) {
          this.loadSlide(allSlides[this.currentSlideIndex], this.currentSlideIndex);
        }
      }).unsubscribe();
    }, 1500); // 1.5 seconds per frame
  }

  private stopPlayback() {
    this.isPlaying = false;
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
  }
}
