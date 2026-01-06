import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanvasComponent } from './components/canvas/canvas.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidebarPanelComponent } from './components/sidebar-panel/sidebar-panel.component';

@Component({
  selector: 'app-whiteboard',
  standalone: true,
  imports: [CommonModule, CanvasComponent, ToolbarComponent, SidebarPanelComponent],
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.css']
})
export class WhiteboardComponent {

}
