import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import Konva from 'konva';
import { WhiteboardService, SportType, ViewMode } from '../../services/whiteboard.service';
import { Subscription, Observable } from 'rxjs';

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
  private activeSlideIndex: number = -1;

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
    
    this.whiteboardService.activeSlideIndex$.subscribe(index => {
        this.activeSlideIndex = index;
    });
  
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
            
            // Clear only lines/arrows for new scene (keep players, balls, cones)
            const children = this.contentGroup.getChildren();
            const linesToRemove: any[] = [];
            children.forEach(child => {
                if (child.getClassName() === 'Arrow' || child.name() === 'aux_shape') {
                    linesToRemove.push(child as any);
                }
            });
            linesToRemove.forEach(line => line.destroy());
            this.layer.batchDraw();
        }
    });

    // Handle Load Request
    this.whiteboardService.loadRequest$.subscribe((data: any) => {
        if (data && data.json) {
            const stageData = JSON.parse(data.json);
            this.loadStageData(stageData);
        }
    });

    this.whiteboardService.clearBoard$.subscribe(() => {
        if (this.contentGroup) {
            this.contentGroup.destroyChildren();
            this.layer.batchDraw();
            this.syncState();
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

    // Enable line drawing
    this.setupLineDrawing();
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

  private loadStageData(data: any): void {
    try {
        // Handle "Legacy" full-stage saves
        if (data.attrs && data.className === 'Stage') {
             console.warn('Legacy slide format detected. Ignoring.');
             return;
        }

        // 1. Restore Sport
        if (data.sport) {
            this.whiteboardService.setSport(data.sport as SportType);
        }

        // 2. Restore Content with Animation
        if (data.content && this.contentGroup) {
            // Parse the target content from JSON
            const targetContent = JSON.parse(data.content);
            
            // Get current children (Groups for players, cones, balls and Arrows for lines)
            const currentChildren = this.contentGroup.getChildren().slice();
            
            // Parse target children from saved data
            const targetChildren = targetContent.children || [];
            
            // Create a map of target positions by the child's attributes (x, y, name or index)
            const targetPositionsMap = new Map<number, { x: number, y: number, attrs: any }>();
            targetChildren.forEach((child: any, index: number) => {
                if (child.attrs) {
                    targetPositionsMap.set(index, {
                        x: child.attrs.x || 0,
                        y: child.attrs.y || 0,
                        attrs: child.attrs
                    });
                }
            });

            // Animation duration in seconds
            const animationDuration = 0.6;

            // Keep track of which current children have been matched
            const matchedCurrentIndices = new Set<number>();
            
            // Animate matching children (Groups - players, cones, balls)
            const groupChildren = currentChildren.filter(child => child.getClassName() === 'Group');
            const targetGroups = targetChildren.filter((child: any) => child.className === 'Group');

            groupChildren.forEach((currentChild, currentIndex) => {
                if (currentIndex < targetGroups.length) {
                    const targetData = targetGroups[currentIndex];
                    if (targetData && targetData.attrs) {
                        const targetX = targetData.attrs.x || 0;
                        const targetY = targetData.attrs.y || 0;
                        
                        matchedCurrentIndices.add(currentIndex);
                        
                        // Animate position change with smooth easing
                        const tween = new Konva.Tween({
                            node: currentChild,
                            x: targetX,
                            y: targetY,
                            duration: animationDuration,
                            easing: Konva.Easings.EaseInOut,
                            onFinish: () => {
                                tween.destroy();
                            }
                        });
                        tween.play();
                    }
                }
            });

            // Handle lines (Arrows) - these don't animate smoothly, just update
            const currentArrows = currentChildren.filter(child => child.getClassName() === 'Arrow');
            const targetArrows = targetChildren.filter((child: any) => child.className === 'Arrow');

            // Remove extra current arrows
            currentArrows.forEach((arrow, index) => {
                if (index >= targetArrows.length) {
                    arrow.destroy();
                } else {
                    // Update arrow points with animation
                    const targetArrow = targetArrows[index];
                    if (targetArrow && targetArrow.attrs && targetArrow.attrs.points) {
                        const tween = new Konva.Tween({
                            node: arrow,
                            points: targetArrow.attrs.points,
                            duration: animationDuration,
                            easing: Konva.Easings.EaseInOut,
                            onFinish: () => {
                                tween.destroy();
                            }
                        });
                        tween.play();
                    }
                }
            });

            // Add new arrows if target has more
            if (targetArrows.length > currentArrows.length) {
                for (let i = currentArrows.length; i < targetArrows.length; i++) {
                    const arrowData = targetArrows[i];
                    if (arrowData && arrowData.attrs) {
                        const newArrow = new Konva.Arrow({
                            points: arrowData.attrs.points || [0, 0, 0, 0],
                            stroke: arrowData.attrs.stroke || this.activeColor,
                            strokeWidth: arrowData.attrs.strokeWidth || 2,
                            dash: arrowData.attrs.dash || [],
                            pointerLength: arrowData.attrs.pointerLength || 10,
                            pointerWidth: arrowData.attrs.pointerWidth || 8,
                            lineCap: 'round',
                            lineJoin: 'round',
                            draggable: true,
                            opacity: 0
                        });
                        this.contentGroup.add(newArrow);
                        
                        // Fade in new arrow
                        new Konva.Tween({
                            node: newArrow,
                            opacity: 1,
                            duration: animationDuration,
                            easing: Konva.Easings.EaseInOut
                        }).play();
                    }
                }
            }

            // Handle new Groups (players/cones/balls) if target has more
            if (targetGroups.length > groupChildren.length) {
                for (let i = groupChildren.length; i < targetGroups.length; i++) {
                    const groupData = targetGroups[i];
                    if (groupData) {
                        const newGroup = Konva.Node.create(JSON.stringify(groupData)) as Konva.Group;
                        newGroup.opacity(0);
                        this.contentGroup.add(newGroup);
                        
                        // Fade in new group
                        new Konva.Tween({
                            node: newGroup,
                            opacity: 1,
                            duration: animationDuration,
                            easing: Konva.Easings.EaseInOut
                        }).play();
                    }
                }
            }

            // Remove extra Groups if current has more than target
            if (groupChildren.length > targetGroups.length) {
                for (let i = targetGroups.length; i < groupChildren.length; i++) {
                    const groupToRemove = groupChildren[i];
                    // Fade out and destroy
                    new Konva.Tween({
                        node: groupToRemove,
                        opacity: 0,
                        duration: animationDuration * 0.5,
                        easing: Konva.Easings.EaseInOut,
                        onFinish: () => {
                            groupToRemove.destroy();
                        }
                    }).play();
                }
            }

            this.layer.batchDraw();
        }

    } catch (e) {
        console.error('Error loading slide', e);
    }
  }

  private setupEventListeners(): void {
    this.stage.on('click tap', (e: Konva.KonvaEventObject<MouseEvent>) => {
      const tool = this.activeTool;
      
      // If clicking on a shape and eraser is active
      if (tool === 'eraser' && e.target !== this.stage && e.target.getParent() !== this.backgroundGroup) {
          // Find the top-most group or shape in contentGroup
          let node: any = e.target;
          while (node.getParent() && node.getParent() !== (this.contentGroup as any) && node.getParent() !== (this.stage as any)) {
              node = node.getParent();
          }
          
          if (node.getParent() === this.contentGroup) {
              node.destroy();
              this.layer.batchDraw();
              this.syncState();
          }
          return;
      }

      // If clicking on an empty area (stage or background)
      if (e.target === this.stage || e.target.getParent() === this.backgroundGroup) {
        this.handleStageClick();
      }
    });

    // Update cursor based on tool
    this.stage.on('mousemove', () => {
        // Here we could update cursor style
    });

    this.contentGroup.on('dragend', () => {
        this.syncState();
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
    } else if (tool === 'defender') {
      this.addDefender(pos.x, pos.y);
    } else if (tool === 'attacker') {
      this.addAttacker(pos.x, pos.y);
    } else if (tool === 'rebound') {
      this.addRebound(pos.x, pos.y);
    } else if (tool === 'jump-stop-1') {
      this.addJumpStop(pos.x, pos.y, 1);
    } else if (tool === 'jump-stop-2') {
      this.addJumpStop(pos.x, pos.y, 2);
    } else if (tool === 'coach') {
      this.addCoach(pos.x, pos.y);
    } else if (tool === 'sequence') {
      this.addSequence(pos.x, pos.y);
    }
    // Line tools are handled by mousedown/mouseup - see setupLineDrawing()
    
    this.syncState();
  }

  private syncState(): void {
    if (this.activeSlideIndex >= 0 && this.contentGroup) {
        const contentJson = this.contentGroup.toJSON();
        const slideData = {
            sport: this.currentSport,
            viewMode: this.currentViewMode,
            content: contentJson,
            timestamp: Date.now()
        };
        this.whiteboardService.saveSlide(JSON.stringify(slideData));
    }
  }

  // Line drawing state
  private isDrawingLine = false;
  private currentLine: Konva.Arrow | null = null;
  private lineStartPos: { x: number, y: number } | null = null;

  private setupLineDrawing(): void {
    this.stage.on('mousedown touchstart', (e) => {
      if (e.target !== this.stage && e.target.getParent() !== this.backgroundGroup) return;
      
      const tool = this.activeTool;
      if (!['pass', 'movement', 'block', 'shot', 'dribbling', 'bounce-pass', 'pivot', 'hand-off', 'cut'].includes(tool)) return;

      const pos = this.stage.getPointerPosition();
      if (!pos) return;

      this.isDrawingLine = true;
      this.lineStartPos = pos;

      // Create the line arrow
      const lineConfig = this.getLineConfig(tool);
      this.currentLine = new Konva.Arrow({
        points: [pos.x, pos.y, pos.x, pos.y],
        stroke: this.activeColor,
        strokeWidth: lineConfig.strokeWidth,
        dash: lineConfig.dash,
        pointerLength: 10,
        pointerWidth: 8,
        lineCap: 'round',
        lineJoin: 'round',
        hitStrokeWidth: 20
      });
      this.contentGroup.add(this.currentLine);

      if (tool === 'shot') {
          this.addShotStartSymbol(pos.x, pos.y);
      }
      
      this.layer.batchDraw();
    });

    this.stage.on('mousemove touchmove', () => {
      if (!this.isDrawingLine || !this.currentLine || !this.lineStartPos) return;

      const pos = this.stage.getPointerPosition();
      if (!pos) return;

      const tool = this.activeTool;
      const points = this.getShapePoints(tool, this.lineStartPos, pos);
      this.currentLine.points(points);
      
      // Special handling for some tools
      if (tool === 'hand-off') {
          this.currentLine.pointerAtBeginning(true);
      } else {
          this.currentLine.pointerAtBeginning(false);
      }

      if (tool === 'block') {
          this.currentLine.pointerLength(0);
          this.currentLine.pointerWidth(0);
      } else {
          this.currentLine.pointerLength(10);
          this.currentLine.pointerWidth(8);
      }

      this.layer.batchDraw();
    });

    this.stage.on('mouseup touchend', () => {
      if (!this.isDrawingLine || !this.currentLine) return;

      this.isDrawingLine = false;
      
      const points = this.currentLine.points();
      const n = points.length;
      if (n < 4) {
          this.currentLine.destroy();
      } else {
          const dx = points[n-2] - points[0];
          const dy = points[n-1] - points[1];
          const totalDist = Math.sqrt(dx * dx + dy * dy);
          
          if (totalDist < 15) {
              this.currentLine.destroy();
          } else {
              // Handle 'block' T-shape
              if (this.activeTool === 'block') {
                  this.addBlockHead(this.currentLine);
              }
              this.currentLine.draggable(true);
          }
      }

      this.currentLine = null;
      this.lineStartPos = null;
      this.syncState();
    });
  }

  private getLineConfig(tool: string): { strokeWidth: number, dash: number[] } {
    switch (tool) {
      case 'movement':
        return { strokeWidth: 3, dash: [] }; // Solid
      case 'pass':
        return { strokeWidth: 2, dash: [10, 5] }; // Dashed
      case 'block':
        return { strokeWidth: 3, dash: [] }; // Solid with T-end (handled in points)
      case 'dribbling':
        return { strokeWidth: 2, dash: [] }; // Wavy (handled in points)
      case 'bounce-pass':
        return { strokeWidth: 2, dash: [5, 5] }; // Curved Dashed (handled in points)
      case 'shot':
        return { strokeWidth: 4, dash: [] }; // Bold
      case 'hand-off':
        return { strokeWidth: 2, dash: [] }; // Double arrow
      default:
        return { strokeWidth: 2, dash: [] };
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

  private getShapePoints(tool: string, start: { x: number, y: number }, end: { x: number, y: number }): number[] {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1) return [start.x, start.y, end.x, end.y];

      const angle = Math.atan2(dy, dx);

      if (tool === 'dribbling') {
          const points = [];
          const segments = Math.max(20, Math.floor(dist / 4));
          const waveAmp = 5;
          const frequency = 0.25;

          for (let i = 0; i <= segments; i++) {
              const t = i / segments;
              const x = start.x + dx * t;
              const y = start.y + dy * t;
              
              // Perpendicular offset for wave
              const perpX = -Math.sin(angle) * Math.sin(t * dist * frequency) * waveAmp;
              const perpY = Math.cos(angle) * Math.sin(t * dist * frequency) * waveAmp;
              
              points.push(x + perpX, y + perpY);
          }
          return points;
      }

      if (tool === 'bounce-pass' || tool === 'pivot') {
          const points = [];
          const segments = 15;
          const curveAmp = dist * 0.2; // 20% arc

          for (let i = 0; i <= segments; i++) {
              const t = i / segments;
              const x = start.x + dx * t;
              const y = start.y + dy * t;
              
              // Bell curve for arc
              const offset = Math.sin(t * Math.PI) * curveAmp;
              const perpX = -Math.sin(angle) * offset;
              const perpY = Math.cos(angle) * offset;
              
              points.push(x + perpX, y + perpY);
          }
          return points;
      }

      if (tool === 'cut') {
          // Angled check/V shape
          // Go 70% of the way, then sharp turn? 
          // Actually usually a cut is just an arrow with a specific angle, 
          // but the image shows a "dar un paso adelante y atrás" which is more like a zigzag.
          // Let's implement it as a 2-segment line.
          const midX = start.x + dx * 0.6 + Math.cos(angle + Math.PI/2) * 20;
          const midY = start.y + dy * 0.6 + Math.sin(angle + Math.PI/2) * 20;
          return [start.x, start.y, midX, midY, end.x, end.y];
      }

      return [start.x, start.y, end.x, end.y];
  }

  private addBlockHead(arrow: Konva.Arrow): void {
      const points = arrow.points();
      const n = points.length;
      if (n < 4) return;
      
      const lastX = points[n-2];
      const lastY = points[n-1];
      const prevX = points[n-4];
      const prevY = points[n-3];
      
      const angle = Math.atan2(lastY - prevY, lastX - prevX);
      const headSize = 10;
      
      const t1x = lastX + Math.cos(angle + Math.PI/2) * headSize;
      const t1y = lastY + Math.sin(angle + Math.PI/2) * headSize;
      const t2x = lastX + Math.cos(angle - Math.PI/2) * headSize;
      const t2y = lastY + Math.sin(angle - Math.PI/2) * headSize;
      
      const tLine = new Konva.Line({
          points: [t1x, t1y, t2x, t2y],
          stroke: arrow.stroke(),
          strokeWidth: arrow.strokeWidth(),
          listening: false,
          name: 'aux_shape',
          hitStrokeWidth: 20
      });
      
      arrow.getParent()?.add(tLine);
      this.layer.batchDraw();
  }

  private addShotStartSymbol(x: number, y: number): void {
      const group = new Konva.Group({ x, y, name: 'aux_shape', listening: false });
      const circle = new Konva.Circle({
          radius: 8,
          stroke: this.activeColor,
          strokeWidth: 2
      });
      const text = new Konva.Text({
          text: 'S',
          fontSize: 10,
          fontStyle: 'bold',
          fill: this.activeColor,
          offsetX: 3,
          offsetY: 5
      });
      group.add(circle);
      group.add(text);
      this.contentGroup.add(group);
  }

  private addBall(x: number, y: number): void {
      const group = new Konva.Group({
          x: x,
          y: y,
          draggable: true
      });

      const radius = 12;

      if (this.currentSport === 'basketball') {
          // Basketball: Orange with black lines
          const ball = new Konva.Circle({
              radius: radius,
              fill: '#f97316', // Orange
              stroke: '#000',
              strokeWidth: 1.5
          });
          group.add(ball);

          // Horizontal line
          group.add(new Konva.Line({
              points: [-radius, 0, radius, 0],
              stroke: '#000',
              strokeWidth: 1
          }));

          // Vertical arc (curved lines)
          group.add(new Konva.Arc({
              x: 0, y: 0,
              innerRadius: radius * 0.6,
              outerRadius: radius * 0.6,
              angle: 180,
              rotation: -90,
              stroke: '#000',
              strokeWidth: 1
          }));
          group.add(new Konva.Arc({
              x: 0, y: 0,
              innerRadius: radius * 0.6,
              outerRadius: radius * 0.6,
              angle: 180,
              rotation: 90,
              stroke: '#000',
              strokeWidth: 1
          }));

      } else {
          // Football/Soccer: White with black pentagon pattern
          const ball = new Konva.Circle({
              radius: radius,
              fill: '#ffffff',
              stroke: '#000',
              strokeWidth: 1.5
          });
          group.add(ball);

          // Simplified pentagon pattern (center pentagon)
          const pentagonSize = radius * 0.5;
          group.add(new Konva.RegularPolygon({
              x: 0, y: 0,
              sides: 5,
              radius: pentagonSize,
              fill: '#000',
              rotation: -18 // Rotate to look like a soccer ball
          }));

          // Small edge pentagons (simplified as dots)
          const edgeAngles = [0, 72, 144, 216, 288];
          edgeAngles.forEach(angle => {
              const rad = (angle * Math.PI) / 180;
              const px = Math.cos(rad) * radius * 0.7;
              const py = Math.sin(rad) * radius * 0.7;
              group.add(new Konva.Circle({
                  x: px, y: py,
                  radius: 2,
                  fill: '#000'
              }));
          });
      }

      this.contentGroup.add(group);

      // Animate pop in
      group.scale({ x: 0, y: 0 });
      const tween = new Konva.Tween({
          node: group,
          scaleX: 1,
          scaleY: 1,
          duration: 0.15,
          easing: Konva.Easings.BackEaseOut
      });
      tween.play();
  }

  private addDefender(x: number, y: number): void {
      const number = this.whiteboardService.getNextDefenderNumber();
      const group = new Konva.Group({ x, y, draggable: true });
      const text = new Konva.Text({
          text: `X${number}`,
          fontSize: 24,
          fontStyle: 'bold',
          fill: this.activeColor,
          offsetX: 12,
          offsetY: 12
      });
      group.add(text);
      this.contentGroup.add(group);
      this.animatePopIn(group);
  }

  private addAttacker(x: number, y: number): void {
      const number = this.whiteboardService.getNextAttackerNumber();
      const group = new Konva.Group({ x, y, draggable: true });
      const text = new Konva.Text({
          text: `O${number}`,
          fontSize: 24,
          fontStyle: 'bold',
          fill: this.activeColor,
          offsetX: 12,
          offsetY: 12
      });
      group.add(text);
      this.contentGroup.add(group);
      this.animatePopIn(group);
  }

  private addCoach(x: number, y: number): void {
      const group = new Konva.Group({ x, y, draggable: true });
      const text = new Konva.Text({
          text: 'E',
          fontSize: 24,
          fontStyle: 'bold',
          fill: this.activeColor,
          offsetX: 8,
          offsetY: 12
      });
      group.add(text);
      this.contentGroup.add(group);
      this.animatePopIn(group);
  }

  private addRebound(x: number, y: number): void {
      const group = new Konva.Group({ x, y, draggable: true });
      const circle = new Konva.Circle({
          radius: 12,
          stroke: this.activeColor,
          strokeWidth: 2
      });
      const text = new Konva.Text({
          text: 'R',
          fontSize: 16,
          fontStyle: 'bold',
          fill: this.activeColor,
          offsetX: 6,
          offsetY: 8
      });
      group.add(circle);
      group.add(text);
      this.contentGroup.add(group);
      this.animatePopIn(group);
  }

  private addJumpStop(x: number, y: number, times: 1 | 2): void {
      const group = new Konva.Group({ x, y, draggable: true });
      const size = 15;
      if (times === 1) {
          group.add(new Konva.Rect({
              x: -size / 2, y: -size / 2,
              width: size, height: size,
              stroke: this.activeColor, strokeWidth: 2
          }));
      } else {
          group.add(new Konva.Rect({
              x: -size - 2, y: -size / 2,
              width: size, height: size,
              stroke: this.activeColor, strokeWidth: 2
          }));
          group.add(new Konva.Rect({
              x: 2, y: -size / 2,
              width: size, height: size,
              stroke: this.activeColor, strokeWidth: 2
          }));
      }
      this.contentGroup.add(group);
      this.animatePopIn(group);
  }

  private addSequence(x: number, y: number): void {
      const number = this.whiteboardService.getNextSequenceNumber();
      const group = new Konva.Group({ x, y, draggable: true });
      const circle = new Konva.Circle({
          radius: 12,
          fill: this.activeColor,
          stroke: 'white',
          strokeWidth: 1
      });
      const text = new Konva.Text({
          text: number.toString(),
          fontSize: 14,
          fontStyle: 'bold',
          fill: 'white',
          width: 24,
          align: 'center',
          offsetX: 12,
          offsetY: 7
      });
      group.add(circle);
      group.add(text);
      this.contentGroup.add(group);
      this.animatePopIn(group);
  }

  private animatePopIn(node: Konva.Node): void {
      node.scale({ x: 0, y: 0 });
      new Konva.Tween({
          node: node,
          scaleX: 1, scaleY: 1,
          duration: 0.2,
          easing: Konva.Easings.BackEaseOut
      }).play();
  }
}
