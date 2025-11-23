import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService } from '../../../../services/planning.service';
import { NotificationService } from '../../../../services/notification.service';
import { Planning, PlanConcept } from '../../../../core/models/planning.model';

interface SubcategoryGroup {
    name: string;
    concepts: PlanConcept[];
}

interface CategoryGroup {
    name: string;
    subcategories: SubcategoryGroup[];
}

@Component({
    selector: 'app-planning-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './planning-details.component.html'
})
export class PlanningDetailsComponent implements OnInit {
    planningId: number = 0;
    planning = signal<Planning | null>(null);
    isLoading = signal(true);
    weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    groupedConcepts = computed(() => {
        const p = this.planning();
        if (!p || !p.planConcepts) return [];

        const groups: CategoryGroup[] = [];

        p.planConcepts.forEach(pc => {
            const concept = pc.sportConcept;
            if (!concept) return;

            let categoryName = 'Sin Categoría';
            let subcategoryName = 'General';

            if (concept.conceptCategory) {
                if (concept.conceptCategory.parent) {
                    categoryName = concept.conceptCategory.parent.name;
                    subcategoryName = concept.conceptCategory.name;
                } else {
                    categoryName = concept.conceptCategory.name;
                }
            }

            let categoryGroup = groups.find(g => g.name === categoryName);
            if (!categoryGroup) {
                categoryGroup = { name: categoryName, subcategories: [] };
                groups.push(categoryGroup);
            }

            let subcategoryGroup = categoryGroup.subcategories.find(s => s.name === subcategoryName);
            if (!subcategoryGroup) {
                subcategoryGroup = { name: subcategoryName, concepts: [] };
                categoryGroup.subcategories.push(subcategoryGroup);
            }

            subcategoryGroup.concepts.push(pc);
        });

        // Sort categories and subcategories if needed (optional, alphabetical)
        groups.sort((a, b) => a.name.localeCompare(b.name));
        groups.forEach(g => g.subcategories.sort((a, b) => a.name.localeCompare(b.name)));

        return groups;
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private planningService: PlanningService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.planningId = +params['id'];
                this.loadPlanning();
            }
        });
    }

    loadPlanning() {
        this.isLoading.set(true);
        this.planningService.getPlanning(this.planningId).subscribe({
            next: (data) => {
                console.log('Planning loaded:', data);
                this.planning.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading planning', err);
                this.notificationService.error('Error', 'No se pudo cargar la planificación.');
                this.isLoading.set(false);
                this.router.navigate(['/dashboard/plannings']);
            }
        });
    }

    getDayName(day: number): string {
        return this.weekDays[day] || '';
    }

    editPlanning() {
        const p = this.planning();
        if (p && p.team) {
            this.router.navigate(['/dashboard/teams/planning', p.team.id, 'edit', p.id]);
        }
    }

    goBack() {
        this.router.navigate(['/dashboard/plannings']);
    }
}
