import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MethodologicalItineraryService } from '../../../../../services/methodological-itinerary.service';
import { PlanningTemplateService } from '../../../../../services/planning-template.service';
import { NotificationService } from '../../../../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';
import { PlanningTemplate } from '../../../../../core/models/planning-template.model';

@Component({
  selector: 'app-itinerary-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterLink, FormsModule],
  templateUrl: './itinerary-form.component.html'
})
export class ItineraryFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = signal<boolean>(false);
  loading = signal<boolean>(false);
  itineraryId: number | null = null;

  availableTemplates = signal<PlanningTemplate[]>([]);
  selectedTemplates = signal<PlanningTemplate[]>([]);
  searchTerm = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private itineraryService: MethodologicalItineraryService,
    private planningTemplateService: PlanningTemplateService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadAvailableTemplates();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.itineraryId = +id;
      this.isEditMode.set(true);
      this.loadItinerary(this.itineraryId);
    }
  }

  loadAvailableTemplates(): void {
    this.planningTemplateService.getMyTemplates().subscribe({
      next: (templates) => {
        this.availableTemplates.set(templates);
      },
      error: () => this.notificationService.error('Error', 'Error al cargar plantillas')
    });
  }

  loadItinerary(id: number): void {
    this.loading.set(true);
    this.itineraryService.getById(id).subscribe({
      next: (itinerary) => {
        this.form.patchValue({
          name: itinerary.name,
          description: itinerary.description,
          sportId: itinerary.sportId,
          isActive: itinerary.isActive
        });
        
        if (itinerary.planningTemplates) {
          this.selectedTemplates.set(itinerary.planningTemplates);
        }
        
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error', 'No se pudo cargar el itinerario');
        this.router.navigate(['/dashboard/itineraries']);
      }
    });
  }

  get filteredAvailableTemplates() {
    const search = this.searchTerm().toLowerCase();
    const selectedIds = new Set(this.selectedTemplates().map(t => t.id));
    return this.availableTemplates().filter(t => 
      !selectedIds.has(t.id) && 
      (t.name.toLowerCase().includes(search) || (t.code && t.code.toLowerCase().includes(search)))
    );
  }

  addTemplate(template: PlanningTemplate): void {
    this.selectedTemplates.update(current => [...current, template]);
  }

  removeTemplate(index: number): void {
    this.selectedTemplates.update(current => {
      const updated = [...current];
      updated.splice(index, 1);
      return updated;
    });
  }

  moveTemplate(index: number, direction: 'up' | 'down'): void {
    this.selectedTemplates.update(current => {
      const updated = [...current];
      if (direction === 'up' && index > 0) {
        [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
      } else if (direction === 'down' && index < updated.length - 1) {
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      }
      return updated;
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    const formValue = this.form.value;
    
    const payload: any = {
      ...formValue,
      sportId: 0, // Set to 0 to trigger backend auto-inference
      planningTemplates: this.selectedTemplates()
    };
    
    if (this.isEditMode() && this.itineraryId) {
      const updateData = { ...payload, id: this.itineraryId };
      this.itineraryService.update(this.itineraryId, updateData).subscribe({
        next: () => {
          this.notificationService.success('Éxito', 'Itinerario actualizado correctamente');
          this.router.navigate(['/dashboard/itineraries']);
        },
        error: () => {
          this.notificationService.error('Error', 'Error al actualizar el itinerario');
          this.loading.set(false);
        }
      });
    } else {
      this.itineraryService.create(payload).subscribe({
        next: () => {
          this.notificationService.success('Éxito', 'Itinerario creado correctamente');
          this.router.navigate(['/dashboard/itineraries']);
        },
        error: () => {
          this.notificationService.error('Error', 'Error al crear el itinerario');
          this.loading.set(false);
        }
      });
    }
  }
}
