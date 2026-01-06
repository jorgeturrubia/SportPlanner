import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhiteboardService, SportType } from '../../services/whiteboard.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {
  currentSport$;
  activeTool$;
  activeColor$;

  colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#ffffff', '#000000'];

  constructor(private whiteboardService: WhiteboardService) {
    this.currentSport$ = this.whiteboardService.currentSport$;
    this.activeTool$ = this.whiteboardService.activeTool$;
    this.activeColor$ = this.whiteboardService.activeColor$;
  }

  setSport(sport: SportType) {
    this.whiteboardService.setSport(sport);
  }

  setTool(tool: any) {
    this.whiteboardService.setTool(tool);
  }

  setColor(color: string) {
    this.whiteboardService.setColor(color);
  }
}
