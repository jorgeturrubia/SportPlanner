import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanningService } from '../../core/services/planning.service';
import { TeamsService } from '../../core/services/teams.service';
import { 
  Planning, 
  CreatePlanningRequest, 
  PlanningType, 
  PlanningStatus,
  TrainingSession,
  CreateSessionRequest
} from '../../core/models/planning.interface';
import { Team } from '../../core/models/team.interface';

@Component({
  selector: 'app-planning-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.css']
})
export class PlanningPageComponent implements OnInit {
  private readonly planningService = inject(PlanningService);
  private readonly teamsService = inject(TeamsService);
  private readonly fb = inject(FormBuilder);

  // State signals
  readonly plannings = signal<Planning[]>([]);
  readonly teams = signal<Team[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly selectedType = signal<PlanningType | ''>('');
  readonly selectedStatus = signal<PlanningStatus | ''>('');
  readonly selectedTeam = signal('');
  readonly currentView = signal<'list' | 'calendar' | 'detail'>('list');

  // Modal state
  readonly showCreateModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly showViewModal = signal(false);
  readonly showSessionModal = signal(false);
  readonly selectedPlanning = signal<Planning | null>(null);

  // Form state
  readonly isCreating = signal(false);
  readonly createError = signal<string | null>(null);

  // Calendar state
  readonly currentDate = signal(new Date());
  readonly selectedDate = signal<Date | null>(null);

  // Forms
  planningForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    type: ['', Validators.required],
    teamId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    objectives: [''],
    tags: [''],
    isTemplate: [false],
    templateName: ['']
  });

  sessionForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    type: ['training', Validators.required],
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    duration: [90, [Validators.required, Validators.min(15), Validators.max(300)]],
    location: [''],
    objectives: [''],
    notes: ['']
  });

  // Computed filtered plannings
  readonly filteredPlannings = computed(() => {
    const plannings = this.plannings();
    const searchTerm = this.searchTerm().toLowerCase();
    const type = this.selectedType();
    const status = this.selectedStatus();
    const teamId = this.selectedTeam();

    return plannings.filter(planning => {
      const matchesSearch = !searchTerm || 
        planning.name.toLowerCase().includes(searchTerm) ||
        planning.description.toLowerCase().includes(searchTerm) ||
        planning.tags.some(tag => tag.toLowerCase().includes(searchTerm));

      const matchesType = !type || planning.type === type;
      const matchesStatus = !status || planning.status === status;
      const matchesTeam = !teamId || planning.teamId === teamId;

      return matchesSearch && matchesType && matchesStatus && matchesTeam;
    });
  });

  // Calendar computed properties
  readonly calendarWeeks = computed(() => {
    const date = this.currentDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // Start from Monday of the week containing the first day
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - daysFromMonday);

    // End at Sunday of the week containing the last day
    const endDate = new Date(lastDay);
    const lastDayOfWeek = lastDay.getDay();
    const daysToSunday = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
    endDate.setDate(lastDay.getDate() + daysToSunday);

    const weeks = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }

    return weeks;
  });

  readonly sessionsForDate = computed(() => {
    const selectedDate = this.selectedDate();
    if (!selectedDate) return [];

    const plannings = this.filteredPlannings();
    const sessions: (TrainingSession & { planningName: string })[] = [];

    plannings.forEach(planning => {
      planning.sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        if (this.isSameDay(sessionDate, selectedDate)) {
          sessions.push({ ...session, planningName: planning.name });
        }
      });
    });

    return sessions.sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  // Options for forms
  readonly planningTypes = Object.values(PlanningType);
  readonly planningStatuses = Object.values(PlanningStatus);
  readonly sessionTypes = ['training', 'match', 'recovery', 'tactical', 'physical', 'technical'];

  ngOnInit(): void {
    this.loadPlannings();
    this.loadTeams();
  }

  // CRUD Operations
  loadPlannings(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.planningService.getPlannings().subscribe({
      next: (response) => {
        this.plannings.set(response.plannings);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set(error.message || 'Error al cargar planificaciones');
        this.isLoading.set(false);
      }
    });
  }

  loadTeams(): void {
    this.teamsService.getTeams().subscribe({
      next: (response) => {
        this.teams.set(response);
      },
      error: (error) => {
        console.error('Error loading teams:', error);
      }
    });
  }

  onCreatePlanning(): void {
    if (this.planningForm.invalid) {
      this.planningForm.markAllAsTouched();
      return;
    }

    this.isCreating.set(true);
    this.createError.set(null);

    const formValue = this.planningForm.value;
    
    const planningData: CreatePlanningRequest = {
      name: formValue.name,
      description: formValue.description,
      type: formValue.type,
      teamId: formValue.teamId,
      startDate: new Date(formValue.startDate),
      endDate: new Date(formValue.endDate),
      objectives: formValue.objectives ? formValue.objectives.split(',').map((obj: string) => obj.trim()) : [],
      tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [],
      isTemplate: formValue.isTemplate,
      templateName: formValue.templateName || undefined
    };

    this.planningService.createPlanning(planningData).subscribe({
      next: () => {
        this.loadPlannings();
        this.closeModals();
        this.isCreating.set(false);
      },
      error: (error) => {
        this.createError.set(error.message || 'Error al crear planificación');
        this.isCreating.set(false);
      }
    });
  }

  onDeletePlanning(): void {
    const planning = this.selectedPlanning();
    if (!planning) return;

    this.planningService.deletePlanning(planning.id).subscribe({
      next: () => {
        this.loadPlannings();
        this.closeModals();
      },
      error: (error) => {
        this.error.set(error.message || 'Error al eliminar planificación');
      }
    });
  }

  // Modal management
  openCreateModal(): void {
    this.planningForm.reset({
      name: '',
      description: '',
      type: '',
      teamId: '',
      startDate: '',
      endDate: '',
      objectives: '',
      tags: '',
      isTemplate: false,
      templateName: ''
    });
    this.createError.set(null);
    this.showCreateModal.set(true);
  }

  openViewModal(planning: Planning): void {
    this.selectedPlanning.set(planning);
    this.showViewModal.set(true);
  }

  openDeleteModal(planning: Planning): void {
    this.selectedPlanning.set(planning);
    this.showDeleteModal.set(true);
  }

  openSessionModal(planning: Planning): void {
    this.selectedPlanning.set(planning);
    this.sessionForm.reset({
      name: '',
      type: 'training',
      date: '',
      startTime: '',
      duration: 90,
      location: '',
      objectives: '',
      notes: ''
    });
    this.showSessionModal.set(true);
  }

  closeModals(): void {
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.showDeleteModal.set(false);
    this.showViewModal.set(false);
    this.showSessionModal.set(false);
    this.selectedPlanning.set(null);
  }

  // View management
  setView(view: 'list' | 'calendar' | 'detail'): void {
    this.currentView.set(view);
  }

  // Calendar methods
  previousMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  isCurrentMonth(date: Date): boolean {
    const current = this.currentDate();
    return date.getMonth() === current.getMonth() &&
           date.getFullYear() === current.getFullYear();
  }

  getSessionsForDate(date: Date): TrainingSession[] {
    const plannings = this.filteredPlannings();
    const sessions: TrainingSession[] = [];

    plannings.forEach(planning => {
      planning.sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        if (this.isSameDay(sessionDate, date)) {
          sessions.push(session);
        }
      });
    });

    return sessions;
  }

  // Filters and search
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedType.set(target.value as PlanningType || '');
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus.set(target.value as PlanningStatus || '');
  }

  onTeamChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedTeam.set(target.value);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedType.set('');
    this.selectedStatus.set('');
    this.selectedTeam.set('');
  }

  // Utility methods
  getTypeLabel(type: PlanningType): string {
    const labels: Record<PlanningType, string> = {
      [PlanningType.WEEKLY]: 'Semanal',
      [PlanningType.MONTHLY]: 'Mensual',
      [PlanningType.SEASONAL]: 'Temporada',
      [PlanningType.TOURNAMENT_PREP]: 'Preparación Torneo',
      [PlanningType.CUSTOM]: 'Personalizada'
    };
    return labels[type];
  }

  getStatusLabel(status: PlanningStatus): string {
    const labels: Record<PlanningStatus, string> = {
      [PlanningStatus.DRAFT]: 'Borrador',
      [PlanningStatus.ACTIVE]: 'Activa',
      [PlanningStatus.COMPLETED]: 'Completada',
      [PlanningStatus.PAUSED]: 'Pausada',
      [PlanningStatus.ARCHIVED]: 'Archivada'
    };
    return labels[status];
  }

  getStatusColor(status: PlanningStatus): string {
    const colors: Record<PlanningStatus, string> = {
      [PlanningStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [PlanningStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [PlanningStatus.COMPLETED]: 'bg-blue-100 text-blue-800',
      [PlanningStatus.PAUSED]: 'bg-yellow-100 text-yellow-800',
      [PlanningStatus.ARCHIVED]: 'bg-red-100 text-red-800'
    };
    return colors[status];
  }

  getTypeColor(type: PlanningType): string {
    const colors: Record<PlanningType, string> = {
      [PlanningType.WEEKLY]: 'bg-blue-100 text-blue-800',
      [PlanningType.MONTHLY]: 'bg-green-100 text-green-800',
      [PlanningType.SEASONAL]: 'bg-purple-100 text-purple-800',
      [PlanningType.TOURNAMENT_PREP]: 'bg-orange-100 text-orange-800',
      [PlanningType.CUSTOM]: 'bg-gray-100 text-gray-800'
    };
    return colors[type];
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  formatDateShort(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getMonthName(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(date);
  }

  getDayName(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date);
  }

  getProgress(planning: Planning): number {
    return planning.progress?.percentage || 0;
  }

  getDuration(planning: Planning): number {
    const start = new Date(planning.startDate);
    const end = new Date(planning.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getTeamName(teamId: string): string {
    const team = this.teams().find(t => t.id === teamId);
    return team?.name || 'Equipo no encontrado';
  }

  // Error handling
  clearError(): void {
    this.error.set(null);
  }

  retryLoad(): void {
    this.clearError();
    this.loadPlannings();
  }
}