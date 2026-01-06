import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanvasComponent } from './components/canvas/canvas.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterPanelComponent } from './components/footer-panel/footer-panel.component';

@Component({
  selector: 'app-whiteboard',
  standalone: true,
  imports: [CommonModule, CanvasComponent, ToolbarComponent, FooterPanelComponent],
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.css']
})
export class WhiteboardComponent {

}
