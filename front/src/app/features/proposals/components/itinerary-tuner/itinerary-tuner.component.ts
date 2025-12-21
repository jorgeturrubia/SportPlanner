
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-itinerary-tuner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-dark-surface border-b border-dark-border py-4 px-6 flex flex-col gap-4">
      
      <!-- Top Row: Itinerary Name + Controls -->
      <div class="flex items-center justify-between">
        <h2 class="text-white font-bold text-lg flex items-center gap-2">
            <span class="text-secondary tracking-widest uppercase text-xs font-black">Itinerario Metodológico</span>
            <span class="text-gray-500">|</span>
            <span class="tracking-tight">{{ getLevelName(currentLevel + offset) }}</span>
        </h2>

        <div class="flex items-center bg-dark-bg rounded-lg p-1 border border-dark-border">
            <button (click)="changeOffset(-1)" [disabled]="(currentLevel + offset) <= 1"
                class="w-10 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-border/50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <span class="font-bold text-lg">−</span>
            </button>
            <div class="px-4 text-center min-w-[100px]">
                <span class="block text-xs uppercase font-bold text-gray-500 tracking-wider">Enfoque</span>
                <span class="block font-bold text-white text-sm" [ngClass]="getOffsetColor()">{{ getOffsetLabel() }}</span>
            </div>
            <button (click)="changeOffset(1)" [disabled]="(currentLevel + offset) >= 6"
                class="w-10 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-border/50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <span class="font-bold text-lg">+</span>
            </button>
        </div>
      </div>

      <!-- Bottom Row: Progress Indicator -->
      <div class="relative pt-2">
        <!-- Labels -->
        <div class="flex justify-between text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">
            <span>Nivel Base</span>
            <span [class.text-secondary]="offset === 0">Nivel Actual</span>
            <span>Retos Expertos</span>
        </div>
        
        <!-- Track -->
        <div class="h-2 bg-dark-bg rounded-full overflow-hidden relative border border-dark-border">
            <!-- Window Indicator -->
             <div class="absolute h-full bg-secondary/20 border-x border-secondary/50 transition-all duration-300 ease-out"
                  [style.left.%]="getWindowLeft()"
                  [style.width.%]="getWindowWidth()">
             </div>

             <!-- Center Marker -->
             <div class="absolute h-4 w-1 bg-secondary top-1/2 -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] z-10 transition-all duration-300 ease-out"
                  [style.left.%]="getMarkerPosition()">
             </div>
        </div>
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
        if (this.offset === 0) return 'Consolidación';
        if (this.offset < 0) return 'Refuerzo';
        return 'Aspiracional';
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
