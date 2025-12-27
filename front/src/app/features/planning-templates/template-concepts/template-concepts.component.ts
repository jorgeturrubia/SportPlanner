import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlanningTemplateService } from '../../../services/planning-template.service';
import { SportConceptsService } from '../../../services/sport-concepts.service';
import { NotificationService } from '../../../services/notification.service';
import { PlanningTemplate, PlanningTemplateConcept } from '../../../core/models/planning-template.model';
import { SportConcept } from '../../../core/models/sport-concept.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-template-concepts',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink],
  templateUrl: './template-concepts.component.html',
  styleUrl: './template-concepts.component.css'
})
export class TemplateConceptsComponent implements OnInit {
  template = signal<PlanningTemplate | null>(null);
  currentConcepts = signal<PlanningTemplateConcept[]>([]);
  availableConcepts = signal<SportConcept[]>([]);
  loading = signal<boolean>(false);
  showAddModal = signal<boolean>(false);
  
  // Search/Filter for Modal
  searchTerm = signal<string>('');
  selectedConcepts = signal<Set<number>>(new Set<number>());

  // Filtered available concepts
  filteredConcepts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.availableConcepts().filter(c => 
      c.name.toLowerCase().includes(term) && 
      !this.currentConcepts().some(existing => existing.sportConceptId === c.id)
    );
  });

  constructor(
    private planningTemplateService: PlanningTemplateService,
    private sportConceptsService: SportConceptsService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTemplate(+id);
      this.loadAvailableConcepts();
    }
  }

  loadTemplate(id: number): void {
    this.loading.set(true);
    this.planningTemplateService.getById(id).subscribe({
      next: (data) => {
        this.template.set(data);
        // Sort concepts by order
        const sorted = (data.templateConcepts || []).sort((a, b) => a.order - b.order);
        this.currentConcepts.set(sorted);
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error', 'No se pudo cargar la plantilla');
        this.router.navigate(['/dashboard/my-templates']);
      }
    });
  }

  loadAvailableConcepts(): void {
    this.sportConceptsService.getConcepts().subscribe({
      next: (concepts) => {
        this.availableConcepts.set(concepts);
      }
    });
  }

  openAddModal(): void {
    this.selectedConcepts.set(new Set<number>());
    this.searchTerm.set('');
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  toggleSelection(conceptId: number): void {
    const current = this.selectedConcepts();
    if (current.has(conceptId)) {
      current.delete(conceptId);
    } else {
      current.add(conceptId);
    }
    this.selectedConcepts.set(new Set(current));
  }

  addSelectedConcepts(): void {
    const conceptsToAdd = this.availableConcepts().filter(c => this.selectedConcepts().has(c.id));
    const currentMaxOrder = this.currentConcepts().length > 0 
      ? Math.max(...this.currentConcepts().map(c => c.order)) 
      : 0;

    const newConcepts: PlanningTemplateConcept[] = conceptsToAdd.map((c, index) => ({
      id: 0,
      planningTemplateId: this.template()!.id,
      sportConceptId: c.id,
      sportConcept: c,
      order: currentMaxOrder + index + 1
    }));

    this.currentConcepts.update(prev => [...prev, ...newConcepts]);
    this.closeAddModal();
    this.saveChanges();
  }

  removeConcept(index: number): void {
    this.currentConcepts.update(prev => prev.filter((_, i) => i !== index));
    this.saveChanges(); // Auto-save on remove? Or explicit save button?
    // Let's auto-save for now as per "Add" behavior, or maybe add a global save button.
    // Given the complexity, let's auto-save to keep state synced.
  }

  moveConcept(index: number, direction: 'up' | 'down'): void {
    const concepts = [...this.currentConcepts()];
    if (direction === 'up' && index > 0) {
      [concepts[index], concepts[index - 1]] = [concepts[index - 1], concepts[index]];
    } else if (direction === 'down' && index < concepts.length - 1) {
      [concepts[index], concepts[index + 1]] = [concepts[index + 1], concepts[index]];
    }
    
    // Reassign orders
    concepts.forEach((c, i) => c.order = i + 1);
    
    this.currentConcepts.set(concepts);
    this.saveChanges();
  }

  saveChanges(): void {
    if (!this.template()) return;

    this.planningTemplateService.updateConcepts(this.template()!.id, this.currentConcepts()).subscribe({
      next: () => {
        this.notificationService.success('Guardado', 'Cambios guardados correctamente');
      },
      error: () => {
        this.notificationService.error('Error', 'Error al guardar los cambios');
      }
    });
  }
}
