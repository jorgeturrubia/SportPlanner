import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PlanningTemplateService } from '../../../services/planning-template.service';
import { NotificationService } from '../../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterLink],
  templateUrl: './template-form.component.html',
  styleUrl: './template-form.component.css'
})
export class TemplateFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = signal<boolean>(false);
  loading = signal<boolean>(false);
  templateId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private planningTemplateService: PlanningTemplateService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: [''], // Optional, can be auto-generated
      level: [1, [Validators.required, Validators.min(1), Validators.max(6)]],
      description: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.templateId = +id;
      this.isEditMode.set(true);
      this.loadTemplate(this.templateId);
    }
  }

  loadTemplate(id: number): void {
    this.loading.set(true);
    this.planningTemplateService.getById(id).subscribe({
      next: (template) => {
        this.form.patchValue({
          name: template.name,
          code: template.code,
          level: template.level,
          description: template.description,
          isActive: template.isActive
        });
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error', 'No se pudo cargar la plantilla');
        this.router.navigate(['/dashboard/my-templates']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    const templateData = { ...this.form.value };
    
    // If not editing, id is typically undefined/0 for create, handled by backend
    
    if (this.isEditMode()) {
        const updateData = { ...templateData, id: this.templateId };
        this.planningTemplateService.update(updateData).subscribe({
            next: () => {
                this.notificationService.success('Éxito', 'Plantilla actualizada correctamente');
                this.router.navigate(['/dashboard/my-templates']);
            },
            error: () => {
                this.notificationService.error('Error', 'Error al actualizar la plantilla');
                this.loading.set(false);
            }
        });
    } else {
        this.planningTemplateService.create(templateData).subscribe({
            next: () => {
                this.notificationService.success('Éxito', 'Plantilla creada correctamente');
                this.router.navigate(['/dashboard/my-templates']);
            },
            error: () => {
                this.notificationService.error('Error', 'Error al crear la plantilla');
                this.loading.set(false);
            }
        });
    }
  }
}
