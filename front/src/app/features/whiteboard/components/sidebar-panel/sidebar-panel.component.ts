import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhiteboardService } from '../../services/whiteboard.service';

@Component({
  selector: 'app-sidebar-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex flex-col p-4 bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
      <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-lg text-gray-800 dark:text-white">Escenas</h3>
          <span class="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{{ (slides$ | async)?.length || 0 }}</span>
      </div>
      
      <div class="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        <div *ngFor="let slide of slides$ | async; let i = index" 
            class="group p-3 bg-white/50 dark:bg-white/5 rounded-xl cursor-pointer border border-transparent hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all relative"
            (click)="loadSlide(slide)">
          
          <div class="aspect-video bg-gray-200 dark:bg-gray-800 mb-2 rounded-lg overflow-hidden flex items-center justify-center relative">
             <!-- Thumbnail Placeholder (Could be real screenshot later) -->
             <div class="text-xs text-gray-400 font-mono">FRAME {{i + 1}}</div>
             
             <!-- Hover Overlay -->
             <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-gray-700 dark:text-gray-200">Escena {{i + 1}}</span>
            <button class="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      <button (click)="addSlide()" class="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Nueva Escena
      </button>
    </div>
  
  `
})
export class SidebarPanelComponent {
  slides$;

  constructor(private whiteboardService: WhiteboardService) {
    this.slides$ = this.whiteboardService.slides$;
  }

  addSlide() {
    this.whiteboardService.requestCapture();
  }

  loadSlide(json: string) {
    this.whiteboardService.loadSlide(json);
  }
}
