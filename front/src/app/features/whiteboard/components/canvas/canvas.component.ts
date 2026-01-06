import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import Konva from 'konva';
import { WhiteboardService, SportType, ViewMode } from '../../services/whiteboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `<div #canvasContainer class="w-full h-full bg-transparent"></div>`,
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
  private viewModeSubscription!: Subscription;
  private resizeObserver!: ResizeObserver;

  // Tools state
  private activeTool: any = 'cursor';
  private activeColor: string = '#e74c3c';
  private toolSub!: Subscription;
  private colorSub!: Subscription;

  private currentSport: SportType = 'football';
  private currentViewMode: ViewMode = 'full';

  constructor(private whiteboardService: WhiteboardService) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initKonva();
    this.setupEventListeners();
    
    this.sportSubscription = this.whiteboardService.currentSport$.subscribe(sport => {
      this.currentSport = sport;
      this.drawField();
    });

    this.viewModeSubscription = this.whiteboardService.viewMode$.subscribe(mode => {
      this.currentViewMode = mode;
      this.drawField();
    });

    this.toolSub = this.whiteboardService.activeTool$.subscribe(tool => {
      this.activeTool = tool;
      this.updateCursor();
    });
    this.colorSub = this.whiteboardService.activeColor$.subscribe(color => this.activeColor = color);
  
    // Handle Capture Request
    // ... (keep same capture logic)
    this.whiteboardService.captureRequest$.subscribe(() => {
        if (this.contentGroup) {
            const contentJson = this.contentGroup.toJSON();
            const slideData = {
                sport: this.currentSport,
                viewMode: this.currentViewMode,
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

  // ... (keep initKonva)
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
        requestAnimationFrame(() => {
             this.fitStageIntoParentContainer();
        });
    });
    this.resizeObserver.observe(container);
  }

  // ... (keep updateCursor)
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
    if (this.viewModeSubscription) this.viewModeSubscription.unsubscribe();
    if (this.toolSub) this.toolSub.unsubscribe();
    if (this.colorSub) this.colorSub.unsubscribe();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  // ... (keep fitStageIntoParentContainer)
  private fitStageIntoParentContainer(): void {
    if (!this.stage) return;
    const container = this.canvasContainer.nativeElement;
    
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    if (newWidth === 0 || newHeight === 0) return;

    this.stage.width(newWidth);
    this.stage.height(newHeight);
    this.drawField(); 
  }

  private drawField(): void {
    if (!this.stage) return;
    this.updateBackground(this.currentSport, this.currentViewMode);
  }

  private updateBackground(sport: SportType, viewMode: ViewMode): void {
    // Safety check
    if (!this.backgroundGroup) {
         this.backgroundGroup = new Konva.Group({ name: 'background_group' });
         this.layer.add(this.backgroundGroup);
         this.backgroundGroup.moveToBottom();
    }
    
    this.backgroundGroup.destroyChildren();

    const stageWidth = this.stage.width();
    const stageHeight = this.stage.height();
    
    // FORCE DARK MODE
    const isDark = true;

    // 1. Draw Infinite Background (Grid)
    const bgFill = '#0f172a'; // slate-900 
    const gridColor = '#1e293b'; // slate-800
    
    const canvasBg = new Konva.Rect({
        x: 0, y: 0, width: stageWidth, height: stageHeight,
        fill: bgFill, listening: true 
    });
    this.backgroundGroup.add(canvasBg);

    // Draw Grid (keep same code)
    const gridSize = 40;
    const gridGroup = new Konva.Group({ listening: false });
    if (stageWidth > 0 && stageHeight > 0) {
        for (let i = 0; i < stageWidth / gridSize; i++) {
            gridGroup.add(new Konva.Line({
                points: [i * gridSize, 0, i * gridSize, stageHeight],
                stroke: gridColor, strokeWidth: 1
            }));
        }
        for (let j = 0; j < stageHeight / gridSize; j++) {
            gridGroup.add(new Konva.Line({
                points: [0, j * gridSize, stageWidth, j * gridSize],
                stroke: gridColor, strokeWidth: 1
            }));
        }
    }
    this.backgroundGroup.add(gridGroup);

    // 2. Calculate Field Dimensions based on Sport AND Mode
    let aspectRatio = 1.5; 
    let fieldColor = '#4ca64c';
    let lineColor = 'white';
    
    if (viewMode === 'full') {
         switch (sport) {
            case 'football': aspectRatio = 105 / 68; fieldColor = '#15803d'; break;
            case 'basketball': aspectRatio = 28 / 15; fieldColor = '#c2410c'; break;
            case 'futsal':
            case 'handball': aspectRatio = 40 / 20; fieldColor = '#1d4ed8'; break;
        }
    } else {
        // HALF PITCH MODE
        // We will maintain the same aesthetic but crop/resize to half.
        // Usually half pitch is displayed PORTRAIT (vertical) to show depth, OR LANDSCAPE (left half).
        // For screen maximization, Portrait fits nicely in the center. 
        // Let's implement Portrait Half field (Goal at bottom).
        
        switch (sport) {
            case 'football': 
                // Half football pitch ~ 52.5 x 68. Aspect Ratio = 68 / 52.5 (Width / Height) if we rotate.
                // Standard: Height 105 -> 52.5. Width 68. 
                // In Portrait: Width = 68, Height = 52.5. Aspect = 68/52.5 = 1.29
                aspectRatio = 68 / 52.5; 
                fieldColor = '#15803d'; 
                break;
            case 'basketball': 
                // Half court: 14 x 15.
                // Portrait: Width = 15, Height = 14. Aspect = 15/14 = 1.07
                aspectRatio = 15 / 14; 
                fieldColor = '#c2410c'; 
                break;
            case 'futsal':
            case 'handball': 
                // Half: 20 x 20. Square.
                aspectRatio = 1; 
                fieldColor = '#1d4ed8'; 
                break;
        }
    }

    const margin = 10;
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

    // Subtle Pattern on field (Stripes) - Only for football usually
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

    const circleRadius = fieldWidth * 0.12; // Adjusted for better look
    const centerCircle = new Konva.Circle({
        x: startX + fieldWidth / 2, y: startY + fieldHeight / 2,
        radius: circleRadius, stroke: lineColor, strokeWidth: 2, opacity: 0.8
    });
    this.backgroundGroup.add(centerCircle);

    // BASKETBALL SPECIFIC MARKINGS
    if (sport === 'basketball') {
        const keyWidth = fieldWidth * 0.16; // Standard width of key relative to field width (approx)
        const keyDepth = fieldHeight * 0.19; // Depth from baseline to free throw line (approx) -> This needs to be relative to the length of the court
        
        // NBA/FIBA roughly: Key is ~4.9m wide, Court is 15m. 4.9/15 = 0.32 width of height?
        // Let's re-calculate proportions based on standard FIBA: 28m x 15m.
        // Key width: 4.9m. 4.9/15 = 0.326 of the Short Side.
        // Key depth (Free throw): 5.8m. 5.8/28 = 0.207 of the Long Side.
        
        // 3-Point: ~6.75m radius. 6.75/15 = 0.45 of Short Side (Radius).
        // Center Circle: 3.6m diameter. 1.8m radius.
        
        // We need to know if we are drawing Horizontal (Full) or Vertical (Half) to apply these percentages correctly to Width/Height.
        
        const isHorizontal = viewMode === 'full';

        const drawBasketballEnd = (isFirstEnd: boolean) => {
             // isFirstEnd: Left (Full) or Bottom (Half/Portrait)
             // Full Mode (Landscape): "Width" is the Long side (28m). "Height" is Short side (15m).
             // Half Mode (Portrait): "Width" is Short side (15m). "Height" is Half Long side (14m).
             
             let kW, kD, threeRad;
             let baseX, baseY;
             let rotation;
             
             if (isHorizontal) {
                 // Landscape: Long side is Width. Short side is Height.
                 // Key Width (4.9m) is along the Height. -> 0.33 * fieldHeight
                 kW = fieldHeight * 0.33; 
                 // Key Depth (5.8m) is along the Width. -> 0.21 * fieldWidth
                 kD = fieldWidth * 0.21;
                 // 3-Point Radius (6.75m) is along the Height. -> 0.45 * fieldHeight
                 threeRad = fieldHeight * 0.45;
                 
                 baseY = startY + fieldHeight / 2;
                 baseX = isFirstEnd ? startX : startX + fieldWidth;
                 rotation = isFirstEnd ? 90 : -90; // Rotate markings to face center
                 
             } else {
                 // Portrait (Half): Short side is Width. Long side is Height.
                 // Key Width (4.9m) is along the Width. -> 0.33 * fieldWidth
                 kW = fieldWidth * 0.33;
                 // Key Depth (5.8m) is along the Height. -> 0.21 of Full Length (28) -> 0.42 of Half Length (14)
                 kD = fieldHeight * 0.42; 
                 
                 threeRad = fieldWidth * 0.45;
                 
                 baseX = startX + fieldWidth / 2;
                 // Markings at Bottom for Half View
                 baseY = startY + fieldHeight; 
                 rotation = 0; // Standard upright
             }

             const guideGroup = new Konva.Group({
                 x: baseX,
                 y: baseY,
                 rotation: rotation
             });
             this.backgroundGroup.add(guideGroup);

             // 1. Paint / Key 
             // Paint (Blue Rect)
             guideGroup.add(new Konva.Rect({
                 x: -kW / 2,
                 y: -kD,
                 width: kW,
                 height: kD,
                 fill: '#3b82f6', opacity: 0.5, stroke: lineColor, strokeWidth: 2
             }));

             // 4. Hoop / Backboard
             // Hoop center is 1.575m from baseline. ~ 1.575/28 = 0.056 of length.
             const hoopOffset = kD * 0.27; // Approx relative to free throw line (5.8m). 1.6/5.8 ~ 0.27
             
             // 2. Free Throw Circle (at top of key)
             guideGroup.add(new Konva.Circle({
                 x: 0,
                 y: -kD,
                 radius: kW / 2,
                 stroke: lineColor, strokeWidth: 2, opacity: 0.8
             }));
             
             // 3. 3-Point Line (Path for proper "U" shape)
             // Use Path to draw straight lines from baseline ("Corner 3") + Arc.
             // Coordinate system: (0,0) is Baseline Center. Negative Y is "Into Court".
             
             const R = threeRad;
             const H = hoopOffset;
             
             // Path:
             // 1. Move to Left Baseline Corner: (-R, 0)
             // 2. Line to Left "Elbow/Corner" start of arc: (-R, -H)
             // 3. Arc to Right "Elbow": (R, -H). Sweep 1 (Clockwise/Outward relative to center).
             // 4. Line to Right Baseline Corner: (R, 0)
             
             const pathData = `M ${-R} 0 L ${-R} ${-H} A ${R} ${R} 0 0 1 ${R} ${-H} L ${R} 0`;

             guideGroup.add(new Konva.Path({
                 data: pathData,
                 stroke: lineColor,
                 strokeWidth: 2,
                 opacity: 0.8,
                 fill: 'transparent'
             }));

             // 4. Hoop / Backboard
             guideGroup.add(new Konva.Line({
                points: [-15, -hoopOffset, 15, -hoopOffset], // Backboard
                stroke: lineColor, strokeWidth: 3
             }));
             guideGroup.add(new Konva.Circle({
                 x: 0, y: -(hoopOffset + 5), 
                 radius: 5, stroke: lineColor, strokeWidth: 2
             }));
        };

        if (viewMode === 'full') {
            drawBasketballEnd(true);  // Left Side
            drawBasketballEnd(false); // Right Side
        } else {
            // Half Court Mode (Portrait, Goal at bottom)
            drawBasketballEnd(false); // Uses 'false' logic implies we manually set Rotation 0 in the function for !Horizontal
        }
    }

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
        
        // Handle "Legacy" full-stage saves
        if (data.attrs && data.className === 'Stage') {
             console.warn('Legacy slide format detected. Ignoring.');
             return;
        }

        // 1. Restore Sport
        if (data.sport) {
            this.whiteboardService.setSport(data.sport as SportType);
        }

        // 2. Restore Content
        if (data.content && this.contentGroup) {
            this.contentGroup.destroy(); 
            this.contentGroup = Konva.Node.create(data.content);
            this.layer.add(this.contentGroup);
            this.contentGroup.moveToTop();
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
}
