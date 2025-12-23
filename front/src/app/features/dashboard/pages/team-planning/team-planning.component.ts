import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService } from '../../../../services/planning.service';
import { NotificationService } from '../../../../services/notification.service';
import { Planning, PlanConcept, PlaningScheduleDay } from '../../../../core/models/planning.model';
import { SportConcept } from '../../../../core/models/sport-concept.model';
import { SportConceptService } from '../../../../services/sport-concept.service';
import { TeamsService } from '../../../../services/teams.service';
import { ProposalManagerComponent } from '../../../proposals/pages/proposal-manager/proposal-manager.component';
import { ViewChild } from '@angular/core';

@Component({
    selector: 'app-team-planning',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ProposalManagerComponent],
    templateUrl: './team-planning.component.html'
})
export class TeamPlanningComponent implements OnInit {
    teamId: number = 0;
    team = signal<any>(null);
    planningId: number | null = null;
    step = signal(1);
    planForm: FormGroup;
    isLoading = signal(false);
    selectedConceptIds = signal<number[]>([]);

    @ViewChild(ProposalManagerComponent) proposalManager!: ProposalManagerComponent;

    weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private planningService: PlanningService,
        private sportConceptService: SportConceptService,
        private notificationService: NotificationService,
        private teamsService: TeamsService
    ) {
        this.planForm = this.fb.group({
            name: ['', [Validators.required]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
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
                this.loadTeam(this.teamId);
            }
            if (params['planningId']) {
                this.planningId = +params['planningId'];
                this.loadPlanning(this.planningId);
            }
        });
    }

    loadTeam(id: number) {
        this.teamsService.getTeam(id).subscribe({
            next: (team) => this.team.set(team),
            error: (err) => console.error('Error loading team', err)
        });
    }

    loadPlanning(id: number) {
        this.isLoading.set(true);
        this.planningService.getPlanning(id).subscribe({
            next: (planning) => {
                // Populate form
                this.planForm.patchValue({
                    name: planning.name,
                    startDate: planning.startDate.split('T')[0],
                    endDate: planning.endDate.split('T')[0]
                });

                // Populate days
                if (planning.scheduleDays) {
                    planning.scheduleDays.forEach((day: PlaningScheduleDay) => {
                        const index = day.dayOfWeek;
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
                if (planning.planConcepts) {
                    this.selectedConceptIds.set(planning.planConcepts.map((pc: PlanConcept) => pc.sportConcept.id));
                }

                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading planning', err);
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
        // Handled by ProposalManagerComponent
    }

    // Methods removed as they are now handled by ProposalManagerComponent

    toggleDay(index: number) {
        const dayControl = this.daysFormArray.at(index);
        if (dayControl) {
            const currentVal = dayControl.get('selected')?.value;
            dayControl.get('selected')?.setValue(!currentVal);
        }
    }

    isDaySelected(index: number): boolean {
        return this.daysFormArray.at(index)?.get('selected')?.value;
    }

    get selectedDaysIndices(): number[] {
        return this.daysFormArray.controls
            .map((control, index) => ({ selected: control.get('selected')?.value, index }))
            .filter(item => item.selected)
            .map(item => item.index);
    }

    onSubmit() {
        if (this.step() === 2) {
            this.isLoading.set(true);

            const formVal = this.planForm.value;
            const scheduleDays = formVal.days
                .map((d: any, i: number) => ({ ...d, dayOfWeek: i }))
                .filter((d: any) => d.selected)
                .map((d: any) => ({
                    dayOfWeek: d.dayOfWeek,
                    startTime: d.startTime,
                    endTime: d.endTime
                }));

            const selectedIds = this.proposalManager
                ? this.proposalManager.getSelectedConceptIds()
                : this.selectedConceptIds();

            const planConcepts: PlanConcept[] = selectedIds.map((id, index) => ({
                id: 0,
                planningId: 0,
                sportConcept: null,
                sportConceptId: id,
                order: index
            }));

            if (this.planningId) {
                const payload = {
                    name: formVal.name,
                    startDate: formVal.startDate,
                    endDate: formVal.endDate,
                    scheduleDays: scheduleDays,
                    planConcepts: planConcepts
                };
                this.planningService.updatePlanning(this.planningId, payload).subscribe({
                    next: () => {
                        this.notificationService.success('Planificación actualizada', 'Se ha actualizado la planificación correctamente.');
                        this.router.navigate(['/dashboard/plannings']);
                    },
                    error: (err) => {
                        console.error('Error updating planning', err);
                        this.notificationService.error('Error', 'No se pudo actualizar la planificación.');
                        this.isLoading.set(false);
                    }
                });
            } else {
                const payload = {
                    name: formVal.name,
                    teamId: this.teamId,
                    startDate: formVal.startDate,
                    endDate: formVal.endDate,
                    scheduleDays: scheduleDays,
                    planConcepts: planConcepts
                };
                this.planningService.createPlanning(payload).subscribe({
                    next: () => {
                        this.notificationService.success('Planificación creada', 'Se ha generado la planificación correctamente.');
                        this.router.navigate(['/dashboard/plannings']);
                    },
                    error: (err) => {
                        console.error('Error creating planning', err);
                        this.notificationService.error('Error', 'No se pudo guardar la planificación.');
                        this.isLoading.set(false);
                    }
                });
            }
        }
    }
}
