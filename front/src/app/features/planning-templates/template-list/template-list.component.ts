import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningTemplateService } from '../../../services/planning-template.service';
import { PlanningTemplate } from '../../../core/models/planning-template.model';
import { NotificationService } from '../../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, RatingStarsComponent],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.css'
})
export class PlanningTemplateListComponent implements OnInit {
  templates = signal<PlanningTemplate[]>([]);
  loading = signal<boolean>(false);

  constructor(
    private planningTemplateService: PlanningTemplateService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.loading.set(true);
    this.planningTemplateService.getMyTemplates().subscribe({
      next: (results) => {
        this.templates.set(results);
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error', 'No se pudieron cargar tus plantillas');
        this.loading.set(false);
      }
    });
  }

  deleteTemplate(template: PlanningTemplate): void {
    if (confirm(`¿Estás seguro de que quieres eliminar/desvincular "${template.name}"?`)) {
      this.planningTemplateService.delete(template.id).subscribe({
        next: () => {
          this.notificationService.success('Eliminado', 'Plantilla eliminada correctamente');
          this.loadTemplates();
        },
        error: () => {
          this.notificationService.error('Error', 'No se pudo eliminar la plantilla');
        }
      });
    }
  }
}
