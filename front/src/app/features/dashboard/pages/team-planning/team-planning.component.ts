import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingScheduleService, ConceptProposal } from '../../../../services/training-schedule.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
    selector: 'app-team-planning',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './team-planning.component.html'
})
export class TeamPlanningComponent implements OnInit {
    teamId: number = 0;
    scheduleId: number | null = null;
    step = signal(1);
    planForm: FormGroup;
    isLoading = signal(false);
    isLoadingConcepts = signal(false);
    concepts = signal<ConceptProposal[]>([]);
    selectedConceptIds = signal<number[]>([]);

    weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    weekDaysEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private planningService: TrainingScheduleService,
        private notificationService: NotificationService
    ) {
        this.planForm = this.fb.group({
            name: [''],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            days: this.fb.array([])
        });

        // Initialize days
        this.weekDays.forEach(() => {
            this.daysFormArray.push(this.fb.group({
                selected: [false],
                startTime: ['18:00'],
                endTime: ['20:00']
            }));
        });
    }

    get daysFormArray() {
        return this.planForm.get('days') as FormArray;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['teamId']) {
                this.teamId = +params['teamId'];
            }
            if (params['scheduleId']) {
                this.scheduleId = +params['scheduleId'];
                this.loadSchedule(this.scheduleId);
            }
        });
    }

    loadSchedule(id: number) {
        this.isLoading.set(true);
        this.planningService.getScheduleById(id).subscribe({
            next: (schedule) => {
                // Populate form
                this.planForm.patchValue({
                    name: schedule.name,
                    startDate: schedule.startDate.split('T')[0],
                    endDate: schedule.endDate.split('T')[0]
                });

                // Populate days
                if (schedule.scheduleDays) {
                    schedule.scheduleDays.forEach((day: any) => {
                        const index = this.weekDaysEn.indexOf(day.dayOfWeek);
                        if (index !== -1) {
                            const dayGroup = this.daysFormArray.at(index);
                            dayGroup.patchValue({
                                selected: true,
                                startTime: day.startTime.substring(0, 5),
                                endTime: day.endTime ? day.endTime.substring(0, 5) : '20:00'
                            });
                        }
                    });
                }

                // Populate concepts
                if (schedule.planConcepts) {
                    this.selectedConceptIds.set(schedule.planConcepts.map((pc: any) => pc.sportConceptId));
                }

                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading schedule', err);
                this.notificationService.error('Error', 'No se pudo cargar la planificación.');
                this.isLoading.set(false);
            }
        });
    }

    isStep1Valid(): boolean {
        const datesValid = this.planForm.get('startDate')?.valid && this.planForm.get('endDate')?.valid;
        const daysSelected = this.daysFormArray.controls.some(c => c.get('selected')?.value);
        return !!(datesValid && daysSelected);
    }

    nextStep() {
        if (this.step() === 1 && this.isStep1Valid()) {
            this.step.set(2);
            this.loadConcepts();
        }
    }

    prevStep() {
        this.step.set(1);
    }

    loadConcepts() {
        this.isLoadingConcepts.set(true);
        this.planningService.getProposedConcepts(this.teamId).subscribe({
            next: (data) => {
                this.concepts.set(data);
                // If creating new, pre-select suggested. If editing, keep existing selection unless empty?
                // Actually, if editing, we already have selectedConceptIds set from loadSchedule.
                // But we might want to merge or just keep what we have.
                // If selectedConceptIds is empty (new schedule), select suggested.
                if (this.selectedConceptIds().length === 0 && !this.scheduleId) {
                    const suggestedIds = data.filter(p => p.isSuggested).map(p => p.concept.id);
                    this.selectedConceptIds.set(suggestedIds);
                }
                this.isLoadingConcepts.set(false);
            },
            error: (err) => {
                console.error('Error loading concepts', err);
                this.notificationService.error('Error', 'No se pudieron cargar los conceptos propuestos.');
                this.isLoadingConcepts.set(false);
            }
        });
    }

    isConceptSelected(id: number): boolean {
        return this.selectedConceptIds().includes(id);
    }

    toggleConcept(id: number) {
        const current = this.selectedConceptIds();
        if (current.includes(id)) {
            this.selectedConceptIds.set(current.filter(c => c !== id));
        } else {
            this.selectedConceptIds.set([...current, id]);
        }
    }

    onSubmit() {
        if (this.step() === 2) {
            this.isLoading.set(true);

            const formVal = this.planForm.value;
            const scheduleDays = formVal.days
                .map((d: any, i: number) => ({ ...d, dayOfWeek: this.weekDaysEn[i] }))
                .filter((d: any) => d.selected)
                .map((d: any) => ({
                    dayOfWeek: d.dayOfWeek,
                    startTime: d.startTime,
                    endTime: d.endTime
                }));

            const payload = {
                name: formVal.name,
                startDate: formVal.startDate,
                endDate: formVal.endDate,
                scheduleDays: scheduleDays,
                planConceptIds: this.selectedConceptIds()
            };

            if (this.scheduleId) {
                this.planningService.updateSchedule(this.scheduleId, payload).subscribe({
                    next: () => {
                        this.notificationService.success('Planificación actualizada', 'Se ha actualizado la planificación correctamente.');
                        this.router.navigate(['/dashboard/plannings']);
                    },
                    error: (err) => {
                        console.error('Error updating schedule', err);
                        this.notificationService.error('Error', 'No se pudo actualizar la planificación.');
                        this.isLoading.set(false);
                    }
                });
            } else {
                this.planningService.createSchedule(this.teamId, payload).subscribe({
                    next: () => {
                        this.notificationService.success('Planificación creada', 'Se ha generado la planificación correctamente.');
                        this.router.navigate(['/dashboard/plannings']);
                    },
                    error: (err) => {
                        console.error('Error creating schedule', err);
                        this.notificationService.error('Error', 'No se pudo guardar la planificación.');
                        this.isLoading.set(false);
                    }
                });
            }
        }
    }
}
