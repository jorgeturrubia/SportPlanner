import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';

import { Team, CreateTeamRequest, UpdateTeamRequest } from '../../../../core/models/team.interface';

@Component({
  selector: 'app-team-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIconComponent],
  providers: [
    provideIcons({
      heroXMark
    })
  ],
  templateUrl: './team-modal.component.html',
  styleUrls: ['./team-modal.component.css']
})
export class TeamModalComponent {
  isOpen = input(false);
  team = input<Team | null>(null);
  isLoading = input(false);
  mode = input<'create' | 'edit'>('create');
  
  close = output<void>();
  save = output<CreateTeamRequest | UpdateTeamRequest>();

  teamForm: FormGroup;
  isEditMode = signal(false);

  constructor(private fb: FormBuilder) {
    this.teamForm = this.createForm();
  }

  ngOnChanges() {
    if (this.team()) {
      this.isEditMode.set(true);
      this.populateForm(this.team()!);
    } else {
      this.isEditMode.set(false);
      this.resetForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sport: ['', Validators.required],
      category: ['', Validators.required],
      playersCount: [0, [Validators.required, Validators.min(1)]],
      coachName: [''],
      description: ['']
    });
  }

  private populateForm(team: Team): void {
    this.teamForm.patchValue({
      name: team.name,
      sport: team.sport,
      category: team.category,
      playersCount: team.playersCount,
      coachName: team.coachName || '',
      description: team.description || ''
    });
  }

  private resetForm(): void {
    this.teamForm.reset({
      name: '',
      sport: '',
      category: '',
      playersCount: 0,
      coachName: '',
      description: ''
    });
  }

  onSubmit(): void {
    if (this.teamForm.valid && !this.isLoading()) {
      const formValue = this.teamForm.value;
      
      if (this.isEditMode()) {
        const updateRequest: UpdateTeamRequest = {
          ...formValue,
          playersCount: Number(formValue.playersCount)
        };
        this.save.emit(updateRequest);
      } else {
        const createRequest: CreateTeamRequest = {
          ...formValue,
          playersCount: Number(formValue.playersCount)
        };
        this.save.emit(createRequest);
      }
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  // Helper methods for template
  getFieldError(fieldName: string): string {
    const field = this.teamForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nombre del equipo',
      sport: 'Deporte',
      category: 'Categoría',
      playersCount: 'Número de jugadores',
      coachName: 'Nombre del entrenador',
      description: 'Descripción'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.teamForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}