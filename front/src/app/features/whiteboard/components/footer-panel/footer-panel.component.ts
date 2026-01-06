import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhiteboardService } from '../../services/whiteboard.service';

@Component({
  selector: 'app-footer-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-panel.component.html'
})
export class FooterPanelComponent {
  slides$;
  
  constructor(private whiteboardService: WhiteboardService) {
    this.slides$ = this.whiteboardService.slides$;
  }

  addSlide() {
    this.whiteboardService.requestCapture();
  }

  loadSlide(json: string) {
    this.whiteboardService.loadSlide(json);
  }

  // TODO: Add play functionality when available in service
}
