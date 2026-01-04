import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  signal,
  effect,
  HostListener
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
  Position
} from '../../../../core/models/tactical-board.model';
import { TacticalBoardService } from '../../../../services/tactical-board.service';

@Component({
  selector: 'app-whiteboard-v2',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './whiteboard-v2.component.html',
  styleUrls: ['./whiteboard-v2.component.css']
})
export class WhiteboardV2Component implements OnInit, AfterViewInit {
  @ViewChild('stageContainer', { static: false }) stageContainer!: ElementRef;

  // -- State Signals --
  boardId = signal<number | null>(null);
  exerciseId = signal<number | null>(null);
  boardName = signal('Nueva Táctica Premium');
  boardDescription = signal('');
  
  // UI State
  isLoading = signal(false);
  isSaving = signal(false);
  isPlaying = signal(false);
  selectedTool = signal<DrawingTool>(DrawingTool.Select);
  selectedFieldType = signal<FieldType>(FieldType.Football);
  
  // Timeline State
  scenes = signal<Frame[]>([]);
  currentSceneIndex = signal(0);
  
  // Drawing styling
  currentColor = signal('#FF6B00'); // Default Orange
  currentStrokeWidth = signal(4);

  // Konva Core
  private stage!: Konva.Stage;
  private layer!: Konva.Layer;
  private transformer!: Konva.Transformer;
  private selectionRect!: Konva.Rect;
  
  // Enums for Template
  FieldType = FieldType;
  DrawingTool = DrawingTool;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tacticalBoardService: TacticalBoardService
  ) {
    // Auto-save or reactive effects can go here
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    const exerciseId = this.route.snapshot.queryParams['exerciseId'];
    
    if (exerciseId) this.exerciseId.set(parseInt(exerciseId));

    if (id && id !== 'new') {
      this.boardId.set(parseInt(id));
      this.loadBoard();
    } else {
      this.initNewBoard();
    }
  }

  ngAfterViewInit() {
    this.initKonva();
    this.drawField(); // Initial draw
    
    // Add resize listener
    window.addEventListener('resize', () => {
       this.fitStageToContainer();
    });
  }

  // -- Initialization --

  initNewBoard() {
    this.scenes.set([{
      index: 0,
      duration: 2000,
      elements: []
    }]);
  }

  loadBoard() {
    if (!this.boardId()) return;
    this.isLoading.set(true);
    this.tacticalBoardService.getById(this.boardId()!).subscribe({
      next: (board) => {
        this.boardName.set(board.name);
        this.boardDescription.set(board.description || '');
        this.selectedFieldType.set(board.fieldType);
        this.scenes.set(board.boardData.frames || []);
        if (this.scenes().length === 0) this.initNewBoard();
        
        this.isLoading.set(false);
        // Defer render to ensure stage is ready
        setTimeout(() => this.loadScene(0), 100);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  initKonva() {
    const container = this.stageContainer.nativeElement;
    
    this.stage = new Konva.Stage({
      container: container,
      width: container.offsetWidth,
      height: container.offsetHeight,
      draggable: false // We use drag only for elements, or pan tool if we add it
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // Transformer for selection
    this.transformer = new Konva.Transformer({
      nodes: [],
      rotateEnabled: true,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      anchorSize: 8,
      anchorStroke: '#FF6B00',
      anchorFill: '#121212',
      borderStroke: '#FF6B00',
    });
    this.layer.add(this.transformer);

    // Selection Rectangle logic (simple click for now)
    this.stage.on('click tap', (e) => {
      // if click on empty area - remove all selections
      if (e.target === this.stage) {
        this.transformer.nodes([]);
        return;
      }

      // Check if we clicked on an item or a group
      // specific logic for tools vs select
      if (this.selectedTool() === DrawingTool.Select) {
         if (e.target.getParent()?.className === 'Group' || e.target.className === 'Shape' || e.target.className === 'Image') {
             // It's an element
             const node = e.target.getParent() || e.target;
             // Don't select the field background
             if (node.hasName('field-bg')) {
                 this.transformer.nodes([]);
                 return;
             }
             this.transformer.nodes([node]);
         }
      } else {
         // Drawing mode logic
         this.handleCanvasClick(this.stage.getPointerPosition());
      }
    });
  }

  fitStageToContainer() {
    const container = this.stageContainer.nativeElement;
    this.stage.width(container.offsetWidth);
    this.stage.height(container.offsetHeight);
    this.drawField(); // Redraw field background
  }

  // -- Drawing Logic --

  drawField() {
    // Clean only background elements, keep pieces
    const bgNodes = this.layer.find('.field-bg');
    bgNodes.forEach(n => n.destroy());

    const w = this.stage.width();
    const h = this.stage.height();

    // Base Grass
    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: w,
      height: h,
      fill: this.selectedFieldType() === FieldType.Basketball ? '#1a1a1a' : '#2D5016',
      name: 'field-bg',
      listening: true
    });
    
    // Add to bottom
    this.layer.add(bg);
    bg.moveToBottom();

    // Field Lines (Simplified for V2 Premium aesthetic)
    this.drawFieldLines(w, h);
    
    this.layer.batchDraw();
  }

  drawFieldLines(w: number, h: number) {
     const stroke = 'rgba(255,255,255,0.2)';
     // Simple perimeter
     const border = new Konva.Rect({
         x: 20, y: 20, width: w - 40, height: h - 40,
         stroke: stroke, strokeWidth: 2,
         name: 'field-bg',
         listening: false
     });
     this.layer.add(border);
     
     // Center line
     const center = new Konva.Line({
         points: [w/2, 20, w/2, h - 20],
         stroke: stroke, strokeWidth: 2,
         name: 'field-bg',
         listening: false
     });
     this.layer.add(center);
     
     // Center Circle
      const circle = new Konva.Circle({
         x: w/2, y: h/2, radius: 50,
         stroke: stroke, strokeWidth: 2,
         name: 'field-bg',
         listening: false
     });
     this.layer.add(circle);
  }

  handleCanvasClick(pos: {x: number, y: number} | null) {
      if (!pos) return;

      switch(this.selectedTool()) {
          case DrawingTool.Player:
              this.addPlayer(pos);
              break;
          case DrawingTool.Ball:
              this.addBall(pos);
              break;
          case DrawingTool.Cone:
              this.addCone(pos);
              break;
          // Add more tools
      }
      
      // Reset to select after placing (optional UX choice)
      // this.selectedTool.set(DrawingTool.Select);
  }

  addPlayer(pos: {x: number, y: number}) {
      const group = new Konva.Group({
          x: pos.x, y: pos.y, draggable: true,
          name: 'element-player'
      });
      
      const circle = new Konva.Circle({
          radius: 15,
          fill: this.currentColor(),
          stroke: '#fff',
          strokeWidth: 2,
          shadowColor: 'black',
          shadowBlur: 10,
          shadowOpacity: 0.5
      });
      
      const text = new Konva.Text({
          text: '1',
          fontSize: 12,
          fontFamily: 'Inter',
          fill: '#fff',
          align: 'center',
          verticalAlign: 'middle',
          width: 30,
          height: 30,
          offsetX: 15,
          offsetY: 15
      });
      
      group.add(circle);
      group.add(text);
      
      // Events to auto-select
      group.on('dragstart', () => {
          this.transformer.nodes([group]);
      });

      this.layer.add(group);
      this.layer.draw();
  }
  
  addBall(pos: {x: number, y: number}) {
      const ball = new Konva.Circle({
          x: pos.x, y: pos.y,
          radius: 8,
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 1,
          draggable: true,
          name: 'element-ball'
      });
      
      ball.on('dragstart', () => this.transformer.nodes([ball]));
      
      this.layer.add(ball);
      this.layer.draw();
  }

  addCone(pos: {x: number, y: number}) {
       const cone = new Konva.RegularPolygon({
          x: pos.x, y: pos.y,
          sides: 3,
          radius: 12,
          fill: '#FF6B00',
          draggable: true,
          name: 'element-cone'
      });
      cone.on('dragstart', () => this.transformer.nodes([cone]));
      this.layer.add(cone);
      this.layer.draw();
  }

  // -- Scene Management --

  captureCurrentScene() {
      // Save current elements state to the current scene index
      const json = this.layer.toJSON();
      // extracting nodes logic required here
      // simplified: we'll iterate draggable nodes
      
      const elements: BoardElement[] = [];
      
      this.layer.getChildren().forEach(node => {
         if (node.name().startsWith('element-')) {
            elements.push({
                id: node.id() || Math.random().toString(36),
                type: this.mapKonvaToType(node),
                position: { x: node.x(), y: node.y() },
                properties: { color: (node as any).fill?.() || 'white' } // Simplify props extraction
            });
         }
      });
      
      // Update current scene
      this.scenes.update(s => {
          const newS = [...s];
          newS[this.currentSceneIndex()] = {
              ...newS[this.currentSceneIndex()],
              elements: elements
          };
          return newS;
      });
  }
  
  loadScene(index: number) {
      if (index < 0 || index >= this.scenes().length) return;
      this.currentSceneIndex.set(index);
      
      const scene = this.scenes()[index];
      
      // Clear movable items
      const items = this.layer.getChildren(node => node.name().startsWith('element-'));
      items.forEach(i => i.destroy());
      
      // Recreate items
      scene.elements.forEach(el => {
          if (el.type === ElementType.Player) this.addPlayer(el.position);
          else if (el.type === ElementType.Ball) this.addBall(el.position);
          else if (el.type === ElementType.Cone) this.addCone(el.position);
      });
      
      this.layer.batchDraw();
  }
  
  addNewScene() {
      this.captureCurrentScene(); // Save current state first
      
      const newIndex = this.scenes().length;
      // Copy last scene elements for continuity
      const lastSceneElements = JSON.parse(JSON.stringify(this.scenes()[newIndex - 1].elements));
      
      this.scenes.update(s => [...s, {
          index: newIndex,
          duration: 2000,
          elements: lastSceneElements
      }]);
      
      this.currentSceneIndex.set(newIndex);
      // No need to redraw as it's same positions
  }
  
  playAnimation() {
      this.isPlaying.set(true);
      // Logic for tweening between scenes
      // Placeholder
      setTimeout(() => this.isPlaying.set(false), 2000);
  }

  // -- Persistence --

  saveBoard() {
      this.captureCurrentScene(); // Ensure latest state is saved
      this.isSaving.set(true);
      
      const boardData: BoardData = {
          field: {
              type: this.selectedFieldType(),
              width: this.stage.width(),
              height: this.stage.height(),
              showGrid: false,
              backgroundColor: '#121212'
          },
          frames: this.scenes()
      };
      
      const dto = {
          name: this.boardName(),
          description: this.boardDescription(),
          boardData: boardData,
          type: TacticalBoardType.Animated,
          fieldType: this.selectedFieldType(),
          exerciseId: this.exerciseId() || undefined,
          frameCount: this.scenes().length,
          isPublic: false
      };
      
      const req = this.boardId() 
          ? this.tacticalBoardService.update(this.boardId()!, dto as UpdateTacticalBoardDto)
          : this.tacticalBoardService.create(dto as CreateTacticalBoardDto);
          
      req.subscribe({
          next: (res) => {
              this.isSaving.set(false);
              if (!this.boardId()) {
                  this.boardId.set(res.id);
                   // Navigate to update URL without reload
                  window.history.replaceState({}, '', `/dashboard/whiteboard-v2/${res.id}`);
              }
              // Toast success
          },
          error: (e) => {
              console.error(e);
              this.isSaving.set(false);
          }
      });
  }

  // Helpers
  mapKonvaToType(node: Konva.Node): ElementType {
      if (node.name().includes('player')) return ElementType.Player;
      if (node.name().includes('ball')) return ElementType.Ball;
      if (node.name().includes('cone')) return ElementType.Cone;
      return ElementType.Circle;
  }
  
  goBack() {
      if (this.exerciseId()) {
          this.router.navigate(['/dashboard/master-user/exercises']);
      } else {
          this.router.navigate(['/dashboard']);
      }
  }
}
