import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import Konva from 'konva';
import { WhiteboardService, SportType } from '../../services/whiteboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `<div #canvasContainer class="w-full h-full bg-gray-200"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef<HTMLDivElement>;

  private stage!: Konva.Stage;
  private layer!: Konva.Layer;
  private backgroundGroup!: Konva.Group;
  private contentGroup!: Konva.Group;
  private sportSubscription!: Subscription;
  private resizeObserver!: ResizeObserver;

  constructor(private whiteboardService: WhiteboardService) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initKonva();
    this.setupEventListeners();
    
    this.sportSubscription = this.whiteboardService.currentSport$.subscribe(sport => {
      this.drawField(sport);
    });
    this.toolSub = this.whiteboardService.activeTool$.subscribe(tool => {
      this.activeTool = tool;
      this.updateCursor();
    });
    this.colorSub = this.whiteboardService.activeColor$.subscribe(color => this.activeColor = color);
  
    // Handle Capture Request
    this.whiteboardService.captureRequest$.subscribe(() => {
        if (this.contentGroup) {
            // Serialize ONLY the content (players, etc.)
            const contentJson = this.contentGroup.toJSON();
            const slideData = {
                sport: this.currentSport,
                content: contentJson,
                timestamp: Date.now()
            };
            this.whiteboardService.saveSlide(JSON.stringify(slideData));
        }
    });

    // Handle Load Request
    this.whiteboardService.loadRequest$.subscribe(json => {
        if (json) {
            this.loadSlideData(json);
        }
    });
  }

  private initKonva(): void {
    const container = this.canvasContainer.nativeElement;
    
    this.stage = new Konva.Stage({
      container: container,
      width: container.clientWidth,
      height: container.clientHeight,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    
    // 1. Background Group (Static, behind)
    this.backgroundGroup = new Konva.Group({ name: 'background_group' });
    this.layer.add(this.backgroundGroup);

    // 2. Content Group (Dynamic, serialized)
    this.contentGroup = new Konva.Group({ name: 'content_group' });
    this.layer.add(this.contentGroup);

    // Robust resizing using ResizeObserver
    this.resizeObserver = new ResizeObserver(() => {
        // Wrap in requestAnimationFrame to avoid "ResizeObserver loop limit exceeded" error
        requestAnimationFrame(() => {
             this.fitStageIntoParentContainer();
        });
    });
    this.resizeObserver.observe(container);
  }

  private updateCursor(): void {
    if (!this.stage) return;
    const container = this.stage.container();
    if (this.activeTool === 'cursor') {
        container.style.cursor = 'default';
    } else {
        container.style.cursor = 'crosshair';
    }
  }

  ngOnDestroy(): void {
    if (this.sportSubscription) this.sportSubscription.unsubscribe();
    if (this.toolSub) this.toolSub.unsubscribe();
    if (this.colorSub) this.colorSub.unsubscribe();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  private fitStageIntoParentContainer(): void {
    if (!this.stage) return;
    const container = this.canvasContainer.nativeElement;
    
    // Check if dimensions actually changed/are valid
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    if (newWidth === 0 || newHeight === 0) return;

    this.stage.width(newWidth);
    this.stage.height(newHeight);
    this.drawField(this.currentSport); 
  }

  private drawField(sport?: SportType): void {
    if (!this.stage) return;
    this.updateBackground(sport || 'football');
  }

  private currentSport: SportType = 'football';

  private updateBackground(sport: SportType): void {
    this.currentSport = sport;
    // Safety check: ensure backgroundGroup exists
    if (!this.backgroundGroup) {
         this.backgroundGroup = new Konva.Group({ name: 'background_group' });
         this.layer.add(this.backgroundGroup);
         this.backgroundGroup.moveToBottom();
    }
    
    this.backgroundGroup.destroyChildren();

    const stageWidth = this.stage.width();
    const stageHeight = this.stage.height();
    
    // Check for Dark Mode (simple check against document class)
    const isDark = document.documentElement.classList.contains('dark');

    // 1. Draw Infinite Background (Grid)
    const bgFill = isDark ? '#0f172a' : '#f8fafc'; // slate-900 vs slate-50
    const gridColor = isDark ? '#1e293b' : '#e2e8f0'; // slate-800 vs slate-200
    
    const canvasBg = new Konva.Rect({
        x: 0, 
        y: 0, 
        width: stageWidth, 
        height: stageHeight,
        fill: bgFill, 
        listening: true 
    });
    this.backgroundGroup.add(canvasBg);

    // Draw Grid
    const gridSize = 40;
    const gridGroup = new Konva.Group({ listening: false });
    
    if (stageWidth > 0 && stageHeight > 0) {
         // Horizontal lines
        for (let i = 0; i < stageWidth / gridSize; i++) {
            gridGroup.add(new Konva.Line({
                points: [i * gridSize, 0, i * gridSize, stageHeight],
                stroke: gridColor,
                strokeWidth: 1
            }));
        }
        // Vertical lines
        for (let j = 0; j < stageHeight / gridSize; j++) {
            gridGroup.add(new Konva.Line({
                points: [0, j * gridSize, stageWidth, j * gridSize],
                stroke: gridColor,
                strokeWidth: 1
            }));
        }
    }
    this.backgroundGroup.add(gridGroup);


    // 2. Calculate Field Dimensions
    let aspectRatio = 1.5; 
    let fieldColor = '#4ca64c';
    let lineColor = 'white';
    
    switch (sport) {
        case 'football':
            aspectRatio = 105 / 68; 
            fieldColor = isDark ? '#14532d' : '#22c55e'; // Deep green vs Bright green
            break;
        case 'basketball':
            aspectRatio = 28 / 15; 
            fieldColor = isDark ? '#7c2d12' : '#ea580c'; // Dark orange vs Orange
            break;
        case 'futsal':
        case 'handball':
            aspectRatio = 40 / 20; 
            fieldColor = isDark ? '#1e3a8a' : '#3b82f6'; // Dark blue vs Blue
            break;
    }

    const margin = 40; 
    const availableWidth = stageWidth - (margin * 2);
    const availableHeight = stageHeight - (margin * 2);
    
    // Safety check for small containers
    if (availableWidth <= 0 || availableHeight <= 0) {
        return; // Too small to draw
    }

    let fieldWidth = availableWidth;
    let fieldHeight = fieldWidth / aspectRatio;

    if (fieldHeight > availableHeight) {
        fieldHeight = availableHeight;
        fieldWidth = fieldHeight * aspectRatio;
    }

    const startX = (stageWidth - fieldWidth) / 2;
    const startY = (stageHeight - fieldHeight) / 2;

    // 3. Draw Field with Glow/Shadow
    const fieldGroup = new Konva.Group();
    
    // Shadow/Glow
    const shadow = new Konva.Rect({
        x: startX + 10, y: startY + 10, width: fieldWidth, height: fieldHeight,
        fill: 'black', blur: 30, opacity: 0.3, cornerRadius: 4
    });
    this.backgroundGroup.add(shadow);

    const fieldBg = new Konva.Rect({
        x: startX, y: startY, width: fieldWidth, height: fieldHeight,
        fill: fieldColor, cornerRadius: 2, 
        listening: false 
    });
    this.backgroundGroup.add(fieldBg);

    // Subtle Pattern on field (Stripes)
    if (sport === 'football') {
         const stripeCount = 10;
         const stripeWidth = fieldWidth / stripeCount;
         for(let i=0; i<stripeCount; i+=2) {
             this.backgroundGroup.add(new Konva.Rect({
                 x: startX + (i * stripeWidth),
                 y: startY,
                 width: stripeWidth,
                 height: fieldHeight,
                 fill: 'black',
                 opacity: 0.05,
                 listening: false
             }));
         }
    }

    const border = new Konva.Rect({
        x: startX, y: startY, width: fieldWidth, height: fieldHeight,
        stroke: lineColor, strokeWidth: 2, opacity: 0.8
    });
    this.backgroundGroup.add(border);

    const centerLine = new Konva.Line({
        points: [startX + fieldWidth / 2, startY, startX + fieldWidth / 2, startY + fieldHeight],
        stroke: lineColor, strokeWidth: 2, opacity: 0.8
    });
    this.backgroundGroup.add(centerLine);

    const circleRadius = fieldWidth * 0.09;
    const centerCircle = new Konva.Circle({
        x: startX + fieldWidth / 2, y: startY + fieldHeight / 2,
        radius: circleRadius, stroke: lineColor, strokeWidth: 2, opacity: 0.8
    });
    this.backgroundGroup.add(centerCircle);

    if (sport === 'football') {
        const boxWidth = fieldWidth * 0.16;
        const boxHeight = fieldHeight * 0.6;
        const boxY = startY + (fieldHeight - boxHeight) / 2;
        this.backgroundGroup.add(new Konva.Rect({
            x: startX, y: boxY, width: boxWidth, height: boxHeight, stroke: lineColor, strokeWidth: 2, opacity: 0.8
        }));
        this.backgroundGroup.add(new Konva.Rect({
            x: startX + fieldWidth - boxWidth, y: boxY, width: boxWidth, height: boxHeight, stroke: lineColor, strokeWidth: 2, opacity: 0.8
        }));
    } 

    this.layer.batchDraw();
  }

  private loadSlideData(json: string): void {
    try {
        const data = JSON.parse(json);
        
        // Handle "Legacy" full-stage saves (if any exist from previous steps)
        if (data.attrs && data.className === 'Stage') {
             // Fallback: This is a full stage save. We can't really load it safely into our new architecture.
             // Best to just ignore or try to extract. 
             console.warn('Legacy slide format detected. Ignoring to prevent layout corruption.');
             return;
        }

        // 1. Restore Sport
        if (data.sport) {
            this.whiteboardService.setSport(data.sport as SportType);
        }

        // 2. Restore Content
        if (data.content && this.contentGroup) {
            this.contentGroup.destroy(); // Clear old content group
             
            // Re-create from JSON
            this.contentGroup = Konva.Node.create(data.content);
            this.layer.add(this.contentGroup);
            
            // Ensure proper z-index
            this.contentGroup.moveToTop();
            
            // Re-bind click events if we need to? 
            // Konva nodes created from JSON keep their attributes but events are not serialized.
            // But we handle clicks via `handleStageClick` on the Stage, not on individual nodes generally.
            // Dragging should work if draggable:true was saved.
        }

    } catch (e) {
        console.error('Error loading slide', e);
    }
  }

  private setupEventListeners(): void {
    this.stage.on('click tap', (e) => {
      // If clicking on an empty area (stage or background)
      if (e.target === this.stage || e.target.getParent() === this.backgroundGroup) {
        this.handleStageClick();
      }
    });

    // Update cursor based on tool
    this.stage.on('mousemove', () => {
        // Here we could update cursor style
    });
  }

  private handleStageClick(): void {
    const pos = this.stage.getPointerPosition();
    if (!pos) return;

    const tool = this.activeTool;
    const color = this.activeColor;

    if (tool === 'player') {
      this.addPlayer(pos.x, pos.y, color);
    } else if (tool === 'cone') {
      this.addCone(pos.x, pos.y, color);
    } else if (tool === 'ball') {
      this.addBall(pos.x, pos.y);
    }
  }

  private addPlayer(x: number, y: number, color: string): void {
    const number = this.whiteboardService.getNextPlayerNumber(color);
    
    const group = new Konva.Group({
      x: x,
      y: y,
      draggable: true
    });

    const circle = new Konva.Circle({
      radius: 15,
      fill: color,
      stroke: 'white',
      strokeWidth: 2,
      shadowColor: 'black',
      shadowBlur: 2,
      shadowOffset: { x: 1, y: 1 },
      shadowOpacity: 0.4
    });

    // Determine text color based on background luminance roughly
    // For simplicity, white text for dark colors, black for light.
    // Defaulting to white or black based on simple check or always contrast
    const textColor = (color === '#ffffff' || color === '#f1c40f') ? 'black' : 'white';

    const text = new Konva.Text({
      text: number.toString(),
      fontSize: 14,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: textColor,
      width: 30,
      height: 30,
      offsetX: 15,
      offsetY: 7,
      align: 'center'
    });

    group.add(circle);
    group.add(text);
    this.contentGroup.add(group);
    
    // Animate pop in
    group.scale({ x: 0, y: 0 });
    const tween = new Konva.Tween({
        node: group,
        scaleX: 1,
        scaleY: 1,
        duration: 0.2,
        easing: Konva.Easings.BackEaseOut
    });
    tween.play();
  }

  private addCone(x: number, y: number, color: string): void {
      const group = new Konva.Group({
          x: x,
          y: y,
          draggable: true
      });

      // Simple Triangle Cone
      const triangle = new Konva.RegularPolygon({
          sides: 3,
          radius: 12,
          fill: '#e67e22', // Orange cone typical
          stroke: 'white',
          strokeWidth: 1
      });

      group.add(triangle);
      this.contentGroup.add(group);
  }

  private addBall(x: number, y: number): void {
      const group = new Konva.Group({
          x: x,
          y: y,
          draggable: true
      });

      const circle = new Konva.Circle({
          radius: 10,
          fill: 'white',
          stroke: 'black',
          strokeWidth: 1
      });
      // Ball pattern
      const pattern = new Konva.Path({
          data: 'M -5 0 L 5 0 M 0 -5 L 0 5', // Simple cross for now
          stroke: 'black',
          strokeWidth: 1
      });

      group.add(circle);
      group.add(pattern);
      this.contentGroup.add(group);
  }

  // Subscribe state vars
  private activeTool: any = 'cursor';
  private activeColor: string = '#e74c3c';
  private toolSub!: Subscription;
  private colorSub!: Subscription;
}
