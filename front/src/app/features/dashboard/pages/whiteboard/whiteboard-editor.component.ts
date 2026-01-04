import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import Konva from 'konva';
import {
  TacticalBoard,
  CreateTacticalBoardDto,
  UpdateTacticalBoardDto,
  TacticalBoardType,
  FieldType,
  DrawingTool,
  BoardData,
  Frame,
  BoardElement,
  ElementType,
  Position,
} from '../../../../core/models/tactical-board.model';
import { TacticalBoardService } from '../../../../services/tactical-board.service';

@Component({
  selector: 'app-whiteboard-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './whiteboard-editor.component.html',
  styleUrls: ['./whiteboard-editor.component.css'],
})
export class WhiteboardEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('stageContainer', { static: false }) stageContainer!: ElementRef;

  // Konva stage and layers
  private stage!: Konva.Stage;
  private fieldLayer!: Konva.Layer;
  private drawingLayer!: Konva.Layer;

  // State signals
  boardId = signal<number | null>(null);
  exerciseId = signal<number | null>(null);
  boardName = signal('Nueva Pizarra');
  boardDescription = signal('');
  selectedTool = signal<DrawingTool>(DrawingTool.Select);
  selectedFieldType = signal<FieldType>(FieldType.Basketball);
  boardType = signal<TacticalBoardType>(TacticalBoardType.Static);
  isLoading = signal(false);
  isSaving = signal(false);

  // Animation state
  frames = signal<Frame[]>([
    {
      index: 0,
      duration: 1000,
      elements: [],
    },
  ]);
  currentFrame = signal(0);
  isPlaying = signal(false);
  playbackInterval: any = null;

  // Drawing state
  currentColor = signal('#FF6B00');
  currentStrokeWidth = signal(3);
  isDrawing = false;
  lastLine: Konva.Line | Konva.Arrow | null = null;

  // Enums for template
  DrawingTool = DrawingTool;
  FieldType = FieldType;
  TacticalBoardType = TacticalBoardType;
  ElementType = ElementType;

  // Tools configuration
  tools = [
    { id: DrawingTool.Select, icon: 'cursor', label: 'Seleccionar' },
    { id: DrawingTool.Player, icon: 'user', label: 'Jugador' },
    { id: DrawingTool.Ball, icon: 'circle', label: 'Balón' },
    { id: DrawingTool.Arrow, icon: 'arrow-right', label: 'Flecha' },
    { id: DrawingTool.Line, icon: 'minus', label: 'Línea' },
    { id: DrawingTool.Circle, icon: 'circle', label: 'Círculo' },
    { id: DrawingTool.Rectangle, icon: 'square', label: 'Rectángulo' },
    { id: DrawingTool.Text, icon: 'type', label: 'Texto' },
    { id: DrawingTool.Cone, icon: 'triangle', label: 'Cono' },
  ];

  colors = ['#FF6B00', '#CCFF00', '#FF0000', '#0000FF', '#FFFF00', '#FFFFFF', '#000000'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tacticalBoardService: TacticalBoardService
  ) {
    // Auto-save effect
    effect(() => {
      if (this.boardId() && !this.isSaving()) {
        // Auto-save after 2 seconds of inactivity
        // Implementation would use a debounce mechanism
      }
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    const exerciseId = this.route.snapshot.queryParams['exerciseId'];
    
    if (exerciseId) {
      this.exerciseId.set(parseInt(exerciseId));
    }

    if (id && id !== 'new') {
      this.boardId.set(parseInt(id));
      this.loadBoard();
    } else {
      this.initializeNewBoard();
    }
  }

  ngAfterViewInit() {
    this.initializeStage();
    this.drawField();
  }

  initializeNewBoard() {
    // Initialize with default values
    this.frames.set([
      {
        index: 0,
        duration: 1000,
        elements: [],
      },
    ]);
  }

  loadBoard() {
    const id = this.boardId();
    if (!id) return;

    this.isLoading.set(true);
    this.tacticalBoardService.getById(id).subscribe({
      next: (board) => {
        this.boardName.set(board.name);
        this.boardDescription.set(board.description || '');
        this.selectedFieldType.set(board.fieldType);
        this.boardType.set(board.type);
        this.frames.set(board.boardData.frames || this.frames());
        this.isLoading.set(false);
        this.renderCurrentFrame();
      },
      error: (err) => {
        console.error('Error loading board:', err);
        this.isLoading.set(false);
      },
    });
  }

  initializeStage() {
    const container = this.stageContainer.nativeElement;
    const width = container.offsetWidth;
    const height = 600;

    this.stage = new Konva.Stage({
      container: container,
      width: width,
      height: height,
    });

    // Create layers
    this.fieldLayer = new Konva.Layer();
    this.drawingLayer = new Konva.Layer();

    this.stage.add(this.fieldLayer);
    this.stage.add(this.drawingLayer);

    // Setup event listeners
    this.setupEventListeners();
  }

  drawField() {
    this.fieldLayer.destroyChildren();

    const width = this.stage.width();
    const height = this.stage.height();

    // Background
    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill: '#2D5016',
    });
    this.fieldLayer.add(bg);

    // Draw field lines based on field type
    switch (this.selectedFieldType()) {
      case FieldType.Basketball:
        this.drawBasketballCourt(width, height);
        break;
      case FieldType.Football:
        this.drawFootballField(width, height);
        break;
      case FieldType.Handball:
        this.drawHandballCourt(width, height);
        break;
      default:
        this.drawGenericField(width, height);
    }

    this.fieldLayer.batchDraw();
  }

  drawBasketballCourt(width: number, height: number) {
    const lineColor = '#FFFFFF';
    const lineWidth = 2;

    // Perimeter
    const perimeter = new Konva.Rect({
      x: 50,
      y: 50,
      width: width - 100,
      height: height - 100,
      stroke: lineColor,
      strokeWidth: lineWidth,
    });
    this.fieldLayer.add(perimeter);

    // Center line
    const centerLine = new Konva.Line({
      points: [width / 2, 50, width / 2, height - 50],
      stroke: lineColor,
      strokeWidth: lineWidth,
    });
    this.fieldLayer.add(centerLine);

    // Center circle
    const centerCircle = new Konva.Circle({
      x: width / 2,
      y: height / 2,
      radius: 60,
      stroke: lineColor,
      strokeWidth: lineWidth,
    });
    this.fieldLayer.add(centerCircle);

    // 3-point arcs
    const arc1 = new Konva.Arc({
      x: 50,
      y: height / 2,
      innerRadius: 0,
      outerRadius: 150,
      angle: 180,
      stroke: lineColor,
      strokeWidth: lineWidth,
      rotation: -90,
    });
    this.fieldLayer.add(arc1);

    const arc2 = new Konva.Arc({
      x: width - 50,
      y: height / 2,
      innerRadius: 0,
      outerRadius: 150,
      angle: 180,
      stroke: lineColor,
      strokeWidth: lineWidth,
      rotation: 90,
    });
    this.fieldLayer.add(arc2);
  }

  drawFootballField(width: number, height: number) {
    const lineColor = '#FFFFFF';
    const lineWidth = 2;

    // Perimeter
    const perimeter = new Konva.Rect({
      x: 50,
      y: 50,
      width: width - 100,
      height: height - 100,
      stroke: lineColor,
      strokeWidth: lineWidth,
    });
    this.fieldLayer.add(perimeter);

    // Center line
    const centerLine = new Konva.Line({
      points: [width / 2, 50, width / 2, height - 50],
      stroke: lineColor,
      strokeWidth: lineWidth,
    });
    this.fieldLayer.add(centerLine);

    // Center circle
    const centerCircle = new Konva.Circle({
      x: width / 2,
      y: height / 2,
      radius: 60,
      stroke: lineColor,
      strokeWidth: lineWidth,
    });
    this.fieldLayer.add(centerCircle);
  }

  drawHandballCourt(width: number, height: number) {
    // Similar to basketball but with handball specific markings
    this.drawBasketballCourt(width, height);
  }

  drawGenericField(width: number, height: number) {
    const lineColor = '#FFFFFF';
    const lineWidth = 2;

    // Just a simple rectangle
    const perimeter = new Konva.Rect({
      x: 50,
      y: 50,
      width: width - 100,
      height: height - 100,
      stroke: lineColor,
      strokeWidth: lineWidth,
    });
    this.fieldLayer.add(perimeter);
  }

  setupEventListeners() {
    this.stage.on('mousedown touchstart', (e) => {
      if (this.selectedTool() === DrawingTool.Select) return;

      const pos = this.stage.getPointerPosition();
      if (!pos) return;

      this.handleToolClick(pos);
    });

    this.stage.on('mousemove touchmove', (e) => {
      if (!this.isDrawing) return;

      const pos = this.stage.getPointerPosition();
      if (!pos) return;

      this.handleToolMove(pos);
    });

    this.stage.on('mouseup touchend', () => {
      this.isDrawing = false;
      this.lastLine = null;
    });
  }

  handleToolClick(pos: Position) {
    const tool = this.selectedTool();

    switch (tool) {
      case DrawingTool.Player:
        this.addPlayer(pos);
        break;
      case DrawingTool.Ball:
        this.addBall(pos);
        break;
      case DrawingTool.Arrow:
      case DrawingTool.Line:
        this.startDrawingLine(pos, tool === DrawingTool.Arrow);
        break;
      case DrawingTool.Circle:
        this.addCircle(pos);
        break;
      case DrawingTool.Rectangle:
        this.addRectangle(pos);
        break;
      case DrawingTool.Cone:
        this.addCone(pos);
        break;
      case DrawingTool.Text:
        this.addText(pos);
        break;
    }
  }

  handleToolMove(pos: Position) {
    if (this.lastLine && this.isDrawing) {
      const newPoints = this.lastLine.points().concat([pos.x, pos.y]);
      this.lastLine.points(newPoints);
      this.drawingLayer.batchDraw();
    }
  }

  addPlayer(pos: Position) {
    const group = new Konva.Group({
      x: pos.x,
      y: pos.y,
      draggable: true,
    });

    const circle = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 20,
      fill: this.currentColor(),
      stroke: '#FFFFFF',
      strokeWidth: 2,
    });

    const text = new Konva.Text({
      x: -10,
      y: -8,
      text: '1',
      fontSize: 16,
      fontFamily: 'Arial',
      fill: '#FFFFFF',
      width: 20,
      align: 'center',
    });

    group.add(circle);
    group.add(text);
    this.drawingLayer.add(group);
    this.drawingLayer.batchDraw();

    this.saveElementToFrame(group, ElementType.Player);
  }

  addBall(pos: Position) {
    const ball = new Konva.Circle({
      x: pos.x,
      y: pos.y,
      radius: 12,
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeWidth: 2,
      draggable: true,
    });

    this.drawingLayer.add(ball);
    this.drawingLayer.batchDraw();

    this.saveElementToFrame(ball, ElementType.Ball);
  }

  startDrawingLine(pos: Position, isArrow: boolean) {
    this.isDrawing = true;
    
    const config = {
      points: [pos.x, pos.y],
      stroke: this.currentColor(),
      strokeWidth: this.currentStrokeWidth(),
      lineCap: 'round' as const,
      lineJoin: 'round' as const,
    };

    if (isArrow) {
      this.lastLine = new Konva.Arrow({
        ...config,
        pointerLength: 15,
        pointerWidth: 15,
      });
    } else {
      this.lastLine = new Konva.Line(config);
    }

    this.drawingLayer.add(this.lastLine);
  }

  addCircle(pos: Position) {
    const circle = new Konva.Circle({
      x: pos.x,
      y: pos.y,
      radius: 40,
      stroke: this.currentColor(),
      strokeWidth: this.currentStrokeWidth(),
      draggable: true,
    });

    this.drawingLayer.add(circle);
    this.drawingLayer.batchDraw();

    this.saveElementToFrame(circle, ElementType.Circle);
  }

  addRectangle(pos: Position) {
    const rect = new Konva.Rect({
      x: pos.x,
      y: pos.y,
      width: 80,
      height: 50,
      stroke: this.currentColor(),
      strokeWidth: this.currentStrokeWidth(),
      draggable: true,
    });

    this.drawingLayer.add(rect);
    this.drawingLayer.batchDraw();

    this.saveElementToFrame(rect, ElementType.Rectangle);
  }

  addCone(pos: Position) {
    const cone = new Konva.RegularPolygon({
      x: pos.x,
      y: pos.y,
      sides: 3,
      radius: 20,
      fill: '#FF6B00',
      stroke: '#000000',
      strokeWidth: 1,
      draggable: true,
    });

    this.drawingLayer.add(cone);
    this.drawingLayer.batchDraw();

    this.saveElementToFrame(cone, ElementType.Cone);
  }

  addText(pos: Position) {
    const text = new Konva.Text({
      x: pos.x,
      y: pos.y,
      text: 'Texto',
      fontSize: 20,
      fontFamily: 'Arial',
      fill: this.currentColor(),
      draggable: true,
    });

    this.drawingLayer.add(text);
    this.drawingLayer.batchDraw();

    this.saveElementToFrame(text, ElementType.Text);
  }

  saveElementToFrame(shape: Konva.Shape | Konva.Group, type: ElementType) {
    // Save element to current frame
    const currentFrameData = this.frames()[this.currentFrame()];
    const element: BoardElement = {
      id: shape._id.toString(),
      type: type,
      position: { x: shape.x(), y: shape.y() },
      properties: this.extractShapeProperties(shape, type),
    };

    currentFrameData.elements.push(element);
    this.frames.update((frames) => {
      frames[this.currentFrame()] = currentFrameData;
      return [...frames];
    });
  }

  extractShapeProperties(shape: Konva.Shape | Konva.Group, type: ElementType): any {
    const props: any = {
      color: this.currentColor(),
      strokeWidth: this.currentStrokeWidth(),
    };

    if (shape instanceof Konva.Circle) {
      props.radius = (shape as any).radius();
    } else if (shape instanceof Konva.Rect) {
      props.width = (shape as any).width();
      props.height = (shape as any).height();
    }

    return props;
  }

  renderCurrentFrame() {
    this.drawingLayer.destroyChildren();
    const frameData = this.frames()[this.currentFrame()];

    // Render all elements in the current frame
    frameData.elements.forEach((element) => {
      this.renderElement(element);
    });

    this.drawingLayer.batchDraw();
  }

  renderElement(element: BoardElement) {
    // Implementation to render each element type
    // This would recreate Konva shapes from saved data
  }

  selectTool(tool: DrawingTool) {
    this.selectedTool.set(tool);
  }

  selectColor(color: string) {
    this.currentColor.set(color);
  }

  changeFieldType(type: FieldType) {
    this.selectedFieldType.set(type);
    this.drawField();
  }

  addFrame() {
    const newFrame: Frame = {
      index: this.frames().length,
      duration: 1000,
      elements: [],
    };
    this.frames.update((frames) => [...frames, newFrame]);
    this.currentFrame.set(this.frames().length - 1);
    this.renderCurrentFrame();
  }

  deleteFrame() {
    if (this.frames().length <= 1) return;

    this.frames.update((frames) => {
      const updated = frames.filter((_, i) => i !== this.currentFrame());
      return updated.map((f, i) => ({ ...f, index: i }));
    });

    if (this.currentFrame() >= this.frames().length) {
      this.currentFrame.set(this.frames().length - 1);
    }
    this.renderCurrentFrame();
  }

  goToFrame(index: number) {
    if (index >= 0 && index < this.frames().length) {
      this.currentFrame.set(index);
      this.renderCurrentFrame();
    }
  }

  playAnimation() {
    if (this.isPlaying()) {
      this.stopAnimation();
      return;
    }

    this.isPlaying.set(true);
    let frameIndex = 0;

    this.playbackInterval = setInterval(() => {
      this.goToFrame(frameIndex);
      frameIndex++;

      if (frameIndex >= this.frames().length) {
        frameIndex = 0;
      }
    }, this.frames()[0].duration || 1000);
  }

  stopAnimation() {
    this.isPlaying.set(false);
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
  }

  clearCanvas() {
    this.drawingLayer.destroyChildren();
    this.drawingLayer.batchDraw();

    this.frames.update((frames) => {
      frames[this.currentFrame()].elements = [];
      return [...frames];
    });
  }

  exportToPNG() {
    const dataURL = this.stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `${this.boardName()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async exportToGIF() {
    // Implementation would use gif.js library to create animated GIF
    console.log('Exporting to GIF...');
    // This requires additional implementation with gif.js
  }

  save() {
    this.isSaving.set(true);

    const boardData: BoardData = {
      field: {
        type: this.selectedFieldType(),
        width: this.stage.width(),
        height: this.stage.height(),
        showGrid: false,
        backgroundColor: '#2D5016',
      },
      frames: this.frames(),
    };

    if (this.boardId()) {
      const updateDto: UpdateTacticalBoardDto = {
        name: this.boardName(),
        description: this.boardDescription(),
        boardData: boardData,
        type: this.boardType(),
        frameCount: this.frames().length,
      };

      this.tacticalBoardService.update(this.boardId()!, updateDto).subscribe({
        next: () => {
          this.isSaving.set(false);
          console.log('Board saved successfully');
        },
        error: (err) => {
          console.error('Error saving board:', err);
          this.isSaving.set(false);
        },
      });
    } else {
      const createDto: CreateTacticalBoardDto = {
        name: this.boardName(),
        description: this.boardDescription(),
        boardData: boardData,
        type: this.boardType(),
        frameCount: this.frames().length,
        fieldType: this.selectedFieldType(),
        isPublic: false,
        exerciseId: this.exerciseId() || undefined,
      };

      this.tacticalBoardService.create(createDto).subscribe({
        next: (board) => {
          this.boardId.set(board.id);
          this.isSaving.set(false);
          console.log('Board created successfully');
          this.router.navigate(['/dashboard/whiteboard', board.id], { replaceUrl: true });
        },
        error: (err) => {
          console.error('Error creating board:', err);
          this.isSaving.set(false);
        },
      });
    }
  }

  goBack() {
    if (this.exerciseId()) {
      // Navigate back to exercise details or edit page
      // Assuming route is something like /dashboard/exercises/edit/:id or similar
      // Since I need to check the exact route, I'll default to going back in history or a specific route
      // For now, let's try to go to the exercises list if we don't have a specific edit page known
      // Or better, let's use window.history.back() as a fallback if router doesn't match?
      // Actually, let's look at the routes. 
      // Based on typical patterns:
      this.router.navigate(['/dashboard/master-user/exercises']); 
    } else {
      this.router.navigate(['/dashboard/whiteboard']);
    }
  }
}
