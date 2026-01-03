export interface TacticalBoard {
  id: number;
  name: string;
  description?: string;
  exerciseId?: number;
  boardData: BoardData;
  type: TacticalBoardType;
  frameCount?: number;
  frameDuration?: number;
  thumbnailUrl?: string;
  exportedImageUrl?: string;
  exportedGifUrl?: string;
  fieldType: FieldType;
  ownerId?: string;
  isPublic: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTacticalBoardDto {
  name: string;
  description?: string;
  exerciseId?: number;
  boardData: BoardData;
  type: TacticalBoardType;
  frameCount?: number;
  frameDuration?: number;
  fieldType: FieldType;
  isPublic: boolean;
  tags?: string[];
}

export interface UpdateTacticalBoardDto {
  name?: string;
  description?: string;
  exerciseId?: number;
  boardData?: BoardData;
  type?: TacticalBoardType;
  frameCount?: number;
  frameDuration?: number;
  thumbnailUrl?: string;
  exportedImageUrl?: string;
  exportedGifUrl?: string;
  fieldType?: FieldType;
  isPublic?: boolean;
  isActive?: boolean;
  tags?: string[];
}

export enum TacticalBoardType {
  Static = 0,
  Animated = 1,
}

export enum FieldType {
  Basketball = 0,
  Football = 1,
  Handball = 2,
  Futsal = 3,
  Volleyball = 4,
  Generic = 5,
}

export interface BoardData {
  field: FieldConfig;
  frames: Frame[];
}

export interface FieldConfig {
  type: FieldType;
  width: number;
  height: number;
  showGrid: boolean;
  backgroundColor: string;
}

export interface Frame {
  index: number;
  duration: number; // milliseconds
  elements: BoardElement[];
}

export interface BoardElement {
  id: string;
  type: ElementType;
  position: Position;
  properties: ElementProperties;
}

export enum ElementType {
  Player = 'player',
  Ball = 'ball',
  Line = 'line',
  Arrow = 'arrow',
  Circle = 'circle',
  Rectangle = 'rectangle',
  Text = 'text',
  Cone = 'cone',
}

export interface Position {
  x: number;
  y: number;
}

export interface ElementProperties {
  // Common properties
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  rotation?: number;

  // Player specific
  number?: number;
  teamColor?: string;
  label?: string;

  // Ball specific
  ballType?: 'soccer' | 'basketball' | 'handball' | 'volleyball';

  // Line/Arrow specific
  points?: number[];
  endX?: number;
  endY?: number;
  dashed?: boolean;
  dashPattern?: number[];

  // Shape specific (circle, rectangle)
  width?: number;
  height?: number;
  radius?: number;
  fill?: string;
  stroke?: string;

  // Text specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  align?: string;
}

export enum DrawingTool {
  Select = 'select',
  Player = 'player',
  Ball = 'ball',
  Line = 'line',
  Arrow = 'arrow',
  Circle = 'circle',
  Rectangle = 'rectangle',
  Text = 'text',
  Cone = 'cone',
  Eraser = 'eraser',
}
