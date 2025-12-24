
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MethodologicalItineraryDto } from '../../models/proposal.models';

@Component({
    selector: 'app-itinerary-tuner',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="bg-dark-surface border-b border-dark-border py-4 px-6 flex items-center justify-between shadow-2xl z-20">
      
      <!-- Left: Itinerary Selection -->
      <div class="flex items-center gap-6 w-full">
        <div class="flex flex-col">
            <span class="text-secondary tracking-[0.2em] uppercase text-[10px] font-black">Metodología SportPlanner</span>
            <div class="flex items-center gap-4 mt-1">
                <!-- Itinerary Dropdown -->
                <div class="relative group">
                    <select [ngModel]="activeItineraryId" (ngModelChange)="onItineraryChange($event)"
                        class="w-full bg-neutral-800 text-white text-lg font-bold uppercase tracking-tight rounded border border-neutral-700 p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer pr-10 transition-all">
                        <option [ngValue]="null" class="bg-neutral-800 text-white">Automático ({{ defaultItineraryName || 'Nivel Equipo' }})</option>
                        <option *ngFor="let itin of itineraries" [ngValue]="itin.id" class="bg-neutral-800 text-white">
                            {{ itin.name }}
                        </option>
                    </select>
                    <span class="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-primary transition-colors">expand_more</span>
                </div>
            </div>
        </div>

        <div class="h-10 w-[2px] bg-dark-border mx-2"></div>

        <div class="flex flex-col">
            <span class="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Nivel Fase</span>
            <span class="font-black text-sm uppercase tracking-tight text-secondary">
                {{ getActiveLevelLabel() }}
            </span>
        </div>
      </div>

    </div>
  `,
    styles: []
})
export class ItineraryTunerComponent implements OnChanges {
    @Input() itineraries: MethodologicalItineraryDto[] = [];
    @Input() activeItineraryId: number | null = null;
    @Input() teamCategoryName: string = ''; // Fallback for auto mode
    @Input() defaultItineraryName: string = '';

    @Output() itineraryChange = new EventEmitter<number>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itineraries']) {
            console.log('ItineraryTuner: Itineraries updated (Input):', this.itineraries);
        }
        if (changes['activeItineraryId']) {
            console.log('ItineraryTuner: activeItineraryId updated (Input):', this.activeItineraryId);
        }
    }

    onItineraryChange(newId: number) {
        this.itineraryChange.emit(newId);
    }

    getActiveLevelLabel(): string {
        if (this.activeItineraryId) {
            const selected = this.itineraries.find(i => i.id == this.activeItineraryId);
            return selected ? `Nivel ${selected.level}` : 'Personalizado';
        }
        return 'Automático';
    }
}
