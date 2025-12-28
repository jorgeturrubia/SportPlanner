
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanningTemplateDto } from '../../models/proposal.models';

@Component({
    selector: 'app-template-tuner',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="bg-dark-surface border-b border-dark-border py-4 px-6 flex items-center justify-between shadow-2xl z-20">
      
      <!-- Left: Template Selection -->
      <div class="flex items-center gap-6 w-full">
        <div class="flex flex-col">
            <span class="text-secondary tracking-[0.2em] uppercase text-[10px] font-black">Metodología SportPlanner</span>
            <div class="flex items-center gap-4 mt-1">
                <!-- Template Dropdown -->
                <div class="relative group">
                    <select [ngModel]="activeTemplateId" (ngModelChange)="onTemplateChange($event)"
                        class="w-full bg-neutral-800 text-white text-lg font-bold uppercase tracking-tight rounded border border-neutral-700 p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer pr-10 transition-all">
                        <option *ngIf="templates.length > 0" [ngValue]="null" class="bg-neutral-800 text-white">Automático ({{ defaultTemplateName || 'Nivel Equipo' }})</option>
                        <option [ngValue]="-1" class="bg-neutral-800 text-white">
                            {{ templates.length > 0 ? 'Sin plantilla (Manual)' : 'Planificación Customizada' }}
                        </option>
                        <option *ngFor="let temp of templates" [ngValue]="temp.id" class="bg-neutral-800 text-white">
                            {{ temp.name }}
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

        <div class="h-10 w-[2px] bg-dark-border mx-2"></div>

        <!-- Create Concept Button -->
         <button type="button" (click)="onCreateClick()" 
            class="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded font-bold uppercase text-xs tracking-wider transition-colors border border-primary/30">
            <span class="material-icons text-sm">add</span>
            Nuevo Concepto
        </button>
      </div>

    </div>
  `,
    styles: []
})
export class TemplateTunerComponent implements OnChanges {
    @Input() templates: PlanningTemplateDto[] = [];
    @Input() activeTemplateId: number | null = null;
    @Input() teamCategoryName: string = ''; // Fallback for auto mode
    @Input() defaultTemplateName: string = '';

    @Output() templateChange = new EventEmitter<number>();
    @Output() createConcept = new EventEmitter<void>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['templates']) {
            console.log('TemplateTuner: Templates updated (Input):', this.templates);
        }
        if (changes['activeTemplateId']) {
            console.log('TemplateTuner: activeTemplateId updated (Input):', this.activeTemplateId);
        }
    }

    onTemplateChange(newId: number) {
        this.templateChange.emit(newId);
    }
    
    onCreateClick() {
        this.createConcept.emit();
    }

    getActiveLevelLabel(): string {
        if (this.activeTemplateId) {
            const selected = this.templates.find(i => i.id == this.activeTemplateId);
            return selected ? `Nivel ${selected.level}` : 'Personalizado';
        }
        return 'Automático';
    }
}
