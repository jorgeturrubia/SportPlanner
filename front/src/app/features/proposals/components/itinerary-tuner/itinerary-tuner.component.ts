
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-itinerary-tuner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-dark-surface border-b border-dark-border py-4 px-6 flex items-center justify-between shadow-2xl z-20">
      
      <!-- Left: Itinerary Selection -->
      <div class="flex items-center gap-6">
        <div class="flex flex-col">
            <span class="text-secondary tracking-[0.2em] uppercase text-[10px] font-black">Metodología SportPlanner</span>
            <h2 class="text-white font-black text-2xl tracking-tighter">
                {{ getLevelName(currentLevel + offset) }}
            </h2>
        </div>

        <div class="h-10 w-[2px] bg-dark-border mx-2"></div>

        <div class="flex flex-col">
            <span class="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Enfoque Actual</span>
            <span class="font-black text-sm uppercase tracking-tight" [ngClass]="getOffsetColor()">{{ getOffsetLabel() }}</span>
        </div>
      </div>

      <!-- Center: The Tuner Bar -->
      <div class="flex-1 max-w-xl px-12 relative group">
        <div class="flex justify-between text-[9px] uppercase font-bold tracking-widest text-gray-600 mb-2 px-1">
            <span>Iniciación</span>
            <span>Avanzado</span>
        </div>
        <div class="h-1.5 bg-dark-bg rounded-full border border-dark-border overflow-hidden relative">
            <!-- Window of influence -->
            <div class="absolute h-full bg-primary/20 transition-all duration-500 ease-out"
                [style.left.%]="getWindowLeft()"
                [style.width.%]="getWindowWidth()">
            </div>
            <!-- Progress marker -->
            <div class="absolute h-full bg-primary shadow-[0_0_10px_rgba(249,115,22,0.8)] transition-all duration-500 ease-out font-black"
                [style.left.%]="0"
                [style.width.%]="getMarkerPosition() + 1">
            </div>
        </div>
        <!-- Markers -->
        <div class="flex justify-between mt-2 px-1">
            <div *ngFor="let i of [1,2,3,4,5,6]" 
                 class="text-[9px] font-bold transition-colors duration-300"
                 [class.text-primary]="(currentLevel + offset) === i"
                 [class.text-gray-700]="(currentLevel + offset) !== i">
                {{i}}
            </div>
        </div>
      </div>

      <!-- Right: Action Controls -->
      <div class="flex items-center gap-3 bg-dark-bg border border-dark-border p-1 rounded-none">
          <button (click)="changeOffset(-1)" [disabled]="(currentLevel + offset) <= 1"
              title="Añadir conceptos anteriores (Refuerzo)"
              class="group flex items-center gap-2 px-4 py-2 bg-dark-surface hover:bg-dark-border transition-all disabled:opacity-20 disabled:grayscale cursor-pointer">
              <span class="text-lg font-black text-gray-400 group-hover:text-white">−</span>
              <span class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-300">Reiniciar</span>
          </button>
          
          <div class="w-[1px] h-6 bg-dark-border"></div>

          <button (click)="changeOffset(1)" [disabled]="(currentLevel + offset) >= 6"
              title="Añadir retos de nivel superior"
              class="group flex items-center gap-2 px-4 py-2 bg-dark-surface hover:bg-dark-border transition-all disabled:opacity-20 disabled:grayscale cursor-pointer">
              <span class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-300">Reto</span>
              <span class="text-lg font-black text-primary group-hover:text-white">+</span>
          </button>
      </div>

    </div>
  `,
    styles: []
})
export class ItineraryTunerComponent {
    @Input() currentLevel: number = 3; // Default Alevin (3)
    @Input() minLevel: number = 1;
    @Input() maxLevel: number = 6;
    @Input() offset: number = 0;

    @Output() offsetChange = new EventEmitter<number>();

    changeOffset(delta: number) {
        const newOffset = this.offset + delta;
        // Bounds check relative to absolute levels (1-6)
        if ((this.currentLevel + newOffset) < 1 || (this.currentLevel + newOffset) > 6) return;

        this.offsetChange.emit(newOffset);
    }

    getLevelName(level: number): string {
        switch (level) {
            case 1: return 'ESCUELA / INICIACIÓN';
            case 2: return 'PRE-MINI (U10)';
            case 3: return 'ALEVÍN (U12)';
            case 4: return 'INFANTIL (U14)';
            case 5: return 'CADETE (U16)';
            case 6: return 'JUNIOR / SENIOR';
            default: return 'GENÉRICO';
        }
    }

    getOffsetLabel(): string {
        if (this.offset === 0) return 'Itinerario Base';
        if (this.offset < 0) return 'Refuerzo Metodológico';
        return 'Enfoque Ambicioso';
    }

    getOffsetColor(): string {
        if (this.offset === 0) return 'text-secondary';
        if (this.offset < 0) return 'text-orange-400';
        return 'text-yellow-400';
    }

    // Visual calculations for the "tuner" bar (1-6 scale)
    getMarkerPosition(): number {
        const absoluteLevel = this.currentLevel + this.offset;
        return ((absoluteLevel - 1) / 5) * 100;
    }

    getWindowLeft(): number {
        const start = Math.max(1, (this.currentLevel + this.offset) - 1);
        return ((start - 1) / 5) * 100;
    }

    getWindowWidth(): number {
        // Assuming window is ~3 levels wide (current - 1 to current + 1)
        // Width of 1 unit in % is 100/5 = 20%
        // Window covers 2 units usually (from -1 to +1) => 40%
        return 40;
    }
}
