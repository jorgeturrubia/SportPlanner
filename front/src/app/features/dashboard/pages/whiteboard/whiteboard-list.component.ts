import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TacticalBoardService } from '../../../../services/tactical-board.service';
import {
  TacticalBoard,
  TacticalBoardType,
  FieldType,
} from '../../../../core/models/tactical-board.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-whiteboard-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-[#121212] p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">
              {{ 'WHITEBOARD.TITLE' | translate }}
            </h1>
            <p class="text-gray-400">
              {{ 'WHITEBOARD.SUBTITLE' | translate }}
            </p>
          </div>
          <button
            (click)="createNewBoard()"
            class="btn-primary flex items-center gap-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {{ 'WHITEBOARD.NEW_BOARD' | translate }}
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="isLoading()" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>

        <!-- Empty State -->
        <div
          *ngIf="!isLoading() && boards().length === 0"
          class="text-center py-16"
        >
          <svg
            class="w-24 h-24 mx-auto text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
          <h3 class="text-xl font-semibold text-white mb-2">
            {{ 'WHITEBOARD.NO_BOARDS' | translate }}
          </h3>
          <p class="text-gray-400 mb-6">
            {{ 'WHITEBOARD.NO_BOARDS_DESC' | translate }}
          </p>
          <button (click)="createNewBoard()" class="btn-primary">
            {{ 'WHITEBOARD.CREATE_FIRST' | translate }}
          </button>
        </div>

        <!-- Boards Grid -->
        <div
          *ngIf="!isLoading() && boards().length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            *ngFor="let board of boards()"
            (click)="openBoard(board.id)"
            class="card-bold cursor-pointer hover:border-primary transition-all duration-200 hover:scale-105"
          >
            <!-- Thumbnail -->
            <div class="aspect-video bg-[#1A1A1A] rounded-lg mb-3 overflow-hidden relative">
              <img
                *ngIf="board.thumbnailUrl"
                [src]="board.thumbnailUrl"
                [alt]="board.name"
                class="w-full h-full object-cover"
              />
              <div
                *ngIf="!board.thumbnailUrl"
                class="w-full h-full flex items-center justify-center"
              >
                <svg
                  class="w-12 h-12 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <!-- Type Badge -->
              <div class="absolute top-2 right-2">
                <span
                  [class]="
                    board.type === TacticalBoardType.Animated
                      ? 'bg-secondary text-black'
                      : 'bg-gray-700 text-white'
                  "
                  class="px-2 py-1 rounded text-xs font-semibold"
                >
                  {{
                    board.type === TacticalBoardType.Animated
                      ? 'WHITEBOARD.ANIMATED'
                      : 'WHITEBOARD.STATIC' | translate
                  }}
                </span>
              </div>
            </div>

            <!-- Info -->
            <h3 class="text-white font-semibold mb-1 truncate">{{ board.name }}</h3>
            <p *ngIf="board.description" class="text-gray-400 text-sm mb-2 line-clamp-2">
              {{ board.description }}
            </p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ getFieldTypeName(board.fieldType) }}</span>
              <span>{{ board.updatedAt | date: 'short' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class WhiteboardListComponent implements OnInit {
  boards = signal<TacticalBoard[]>([]);
  isLoading = signal(false);
  TacticalBoardType = TacticalBoardType;

  constructor(
    private tacticalBoardService: TacticalBoardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBoards();
  }

  loadBoards() {
    this.isLoading.set(true);
    this.tacticalBoardService.getAll().subscribe({
      next: (boards) => {
        this.boards.set(boards);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading boards:', err);
        this.isLoading.set(false);
      },
    });
  }

  createNewBoard() {
    this.router.navigate(['/dashboard/whiteboard/new']);
  }

  openBoard(id: number) {
    this.router.navigate(['/dashboard/whiteboard', id]);
  }

  getFieldTypeName(type: FieldType): string {
    const names = {
      [FieldType.Basketball]: 'Basketball',
      [FieldType.Football]: 'Football',
      [FieldType.Handball]: 'Handball',
      [FieldType.Futsal]: 'Futsal',
      [FieldType.Volleyball]: 'Volleyball',
      [FieldType.Generic]: 'Generic',
    };
    return names[type] || 'Generic';
  }
}
