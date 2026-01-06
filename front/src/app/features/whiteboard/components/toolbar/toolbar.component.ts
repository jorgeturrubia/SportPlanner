import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhiteboardService, SportType, ViewMode } from '../../services/whiteboard.service';

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
  viewMode$;

  // Reduced color palette for tactical clarity
  colors = ['#e74c3c', '#3498db', '#f1c40f', '#ffffff'];

  constructor(private whiteboardService: WhiteboardService) {
    this.currentSport$ = this.whiteboardService.currentSport$;
    this.activeTool$ = this.whiteboardService.activeTool$;
    this.activeColor$ = this.whiteboardService.activeColor$;
    this.viewMode$ = this.whiteboardService.viewMode$;
  }

  setSport(sport: SportType) {
    this.whiteboardService.setSport(sport);
  }

  setViewMode(mode: ViewMode) {
    this.whiteboardService.setViewMode(mode);
  }

  setTool(tool: any) {
    this.whiteboardService.setTool(tool);
  }

  setColor(color: string) {
    this.whiteboardService.setColor(color);
  }

  // Line menu dropdown
  showLineMenu = false;

  toggleLineMenu() {
    this.showLineMenu = !this.showLineMenu;
  }

  selectLineType(type: string) {
    this.whiteboardService.setTool(type as any);
    this.showLineMenu = false;
  }
}
