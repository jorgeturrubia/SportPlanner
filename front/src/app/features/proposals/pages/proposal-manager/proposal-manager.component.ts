import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ItineraryTunerComponent } from '../../components/itinerary-tuner/itinerary-tuner.component';
import { ProposalsService } from '../../services/proposals.service';
import { TeamsService } from '../../../../services/teams.service';
import { ConceptProposalResponseDto, ScoredConceptDto, ConceptTag, ConceptProposalGroupDto } from '../../models/proposal.models';

// --- New Hierarchical Interfaces ---
interface SubCategoryRow {
    name: string;
    categoryId: number; // Unique ID for the subcategory bucket
    activeConcepts: ScoredConceptDto[]; // Level X (Own)
    futureConcepts: ScoredConceptDto[]; // Level > X (Aspirational)
    pastConcepts: ScoredConceptDto[];   // Level < X (Inherited/Reinforcement)

    // Drag & Drop List IDs
    activeListId: string;
    futureListId: string;
    pastListId: string;
}

interface CategoryGroup {
    name: string;
    subCategories: SubCategoryRow[];
}

interface MethodologicalSection {
    name: string; // "Ataque" | "Defensa"
    categories: CategoryGroup[];
}

@Component({
    selector: 'app-proposal-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, DragDropModule, ItineraryTunerComponent],
    templateUrl: './proposal-manager.component.html',
    styleUrls: ['./proposal-manager.component.css']
})
export class ProposalManagerComponent implements OnChanges {
    @Input() response: ConceptProposalResponseDto | null = null;
    @Input() selectedTeamId: number | null = null;

    // Local state
    teams: any[] = [];
    loading: boolean = false;
    currentLevelOffset: number = 0;

    // The main data structure for the view
    methodologicalSections: MethodologicalSection[] = [];

    // All connected drop lists for drag & drop
    allListIds: string[] = [];

    constructor(
        private proposalsService: ProposalsService,
        private teamsService: TeamsService
    ) {
        this.loadTeams();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['response'] && this.response) {
            this.processResponseIntoHierarchy();
        }
    }

    loadTeams() {
        this.teamsService.getMyTeams().subscribe({
            next: (res) => this.teams = res,
            error: (err) => console.error('Error loading teams', err)
        });
    }

    onTeamChange() {
        this.currentLevelOffset = 0;
        this.methodologicalSections = [];
        this.allListIds = [];
        // If selectedTeamId changes, we expect the parent or a separate call to trigger generateProposals
        if (this.selectedTeamId) {
            this.generateProposals();
        } else {
            this.response = null;
        }
    }

    generateProposals() {
        if (!this.selectedTeamId) return;

        this.loading = true;
        this.response = null;
        this.methodologicalSections = [];
        this.allListIds = [];

        this.proposalsService.generateProposals({
            teamId: this.selectedTeamId,
            levelOffset: this.currentLevelOffset
        }).subscribe({
            next: (res) => {
                this.response = res;
                this.processResponseIntoHierarchy();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error generating proposals', err);
                this.loading = false;
            }
        });
    }

    onLevelOffsetChange(newOffset: number) {
        this.currentLevelOffset = newOffset;
        this.generateProposals();
    }

    /**
     * Core logic: Transforms flat proposal groups into a distinct 
     * Section > Category > Subcategory hierarchy
     */
    private processResponseIntoHierarchy() {
        if (!this.response) return;

        const allGroups = [...this.response.suggestedGroups, ...this.response.optionalGroups];
        const sectionsMap = new Map<string, Map<string, SubCategoryRow>>();

        // 1. Iterate all groups to build the structure
        allGroups.forEach(group => {
            // Unpack hierarchy from categoryName string (e.g., "Ataque > Técnica Individual > Finalizaciones")
            const pathParts = group.categoryName.split(' > ');

            // Heuristic for Hierarchy:
            // Section: explicitly on group.section OR 1st part of path
            const sectionName = group.section || (pathParts.length > 0 ? pathParts[0] : 'General');

            // Category: 2nd part OR Section if missing
            const categoryName = pathParts.length > 1 ? pathParts[1] : sectionName;

            // Subcategory: 3rd part OR Category if missing
            // If the group has displaySubCategoryName set by backend logic (unlikely if strictly string), we use path
            const subCategoryName = pathParts.length > 2 ? pathParts[2] : (pathParts.length > 1 ? pathParts[1] : categoryName);

            // --- Ensure Section Exists ---
            if (!sectionsMap.has(sectionName)) {
                sectionsMap.set(sectionName, new Map<string, SubCategoryRow>());
            }
            const sectionCategories = sectionsMap.get(sectionName)!;

            // --- Ensure Subcategory Row Exists ---
            // Key by subCategoryName + Category to avoid collisions across categories
            const rowKey = `${categoryName}|${subCategoryName}`;

            if (!sectionCategories.has(rowKey)) {
                sectionCategories.set(rowKey, {
                    name: subCategoryName,
                    categoryId: group.categoryId,
                    activeConcepts: [],
                    futureConcepts: [],
                    pastConcepts: [],
                    activeListId: `active-${group.categoryId}`,
                    futureListId: `future-${group.categoryId}`,
                    pastListId: `past-${group.categoryId}` // Same numeric ID for the row, different prefix
                });
            }

            const row = sectionCategories.get(rowKey)!;

            // --- Distribute Concepts by Tag ---
            group.concepts.forEach(concept => {
                if (concept.tag === ConceptTag.Own) {
                    row.activeConcepts.push(concept);
                } else if (concept.tag === ConceptTag.Aspirational) {
                    row.futureConcepts.push(concept);
                } else {
                    // Inherited (2) or Reinforcement (3)
                    row.pastConcepts.push(concept);
                }
            });
        });

        // 2. Convert Map to Array Structure
        this.methodologicalSections = [];
        this.allListIds = [];

        sectionsMap.forEach((subCatsMap, sectName) => {
            // Group subcategories by their parent Category
            const categoriesMap = new Map<string, SubCategoryRow[]>();

            subCatsMap.forEach((row, rowKey) => {
                const catName = rowKey.split('|')[0];
                if (!categoriesMap.has(catName)) {
                    categoriesMap.set(catName, []);
                }

                // Only add row if it has content in at least one bucket
                if (row.activeConcepts.length > 0 || row.futureConcepts.length > 0 || row.pastConcepts.length > 0) {
                    categoriesMap.get(catName)!.push(row);
                    // Collect IDs for drag & drop connections
                    this.allListIds.push(row.activeListId, row.futureListId, row.pastListId);
                }
            });

            const categories: CategoryGroup[] = [];
            categoriesMap.forEach((rows, catName) => {
                if (rows.length > 0) {
                    categories.push({
                        name: catName,
                        subCategories: rows.sort((a, b) => a.name.localeCompare(b.name))
                    });
                }
            });

            if (categories.length > 0) {
                this.methodologicalSections.push({
                    name: sectName,
                    categories: categories.sort((a, b) => a.name.localeCompare(b.name))
                });
            }
        });

        // Sort sections (Specific sorting preference: Ataque, Defensa, Físico...)
        const sectionOrder = ['Ataque', 'Defensa', 'Físico', 'Psicología'];
        this.methodologicalSections.sort((a, b) => {
            const idxA = sectionOrder.indexOf(a.name);
            const idxB = sectionOrder.indexOf(b.name);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.name.localeCompare(b.name);
        });
    }

    /**
     * Handle drag & drop events strictly within permissible logic
     */
    drop(event: CdkDragDrop<ScoredConceptDto[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            // --- Logic for moving between pools (Active / Future / Past) ---
            const targetId = event.container.id;
            // Extract type from ID (e.g., "active-102" -> "active")
            const targetType = targetId.split('-')[0];

            // Deep validation could go here (check if section matches, etc.)
            // But visually user can only drag to connected lists.

            const concept = event.previousContainer.data[event.previousIndex];

            // Update tag immediately for UI feedback
            if (targetType === 'active') {
                concept.tag = ConceptTag.Own;
            } else if (targetType === 'future') {
                concept.tag = ConceptTag.Aspirational;
            } else if (targetType === 'past') {
                concept.tag = ConceptTag.Inherited; // Simplified
            }

            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }
    }
}
