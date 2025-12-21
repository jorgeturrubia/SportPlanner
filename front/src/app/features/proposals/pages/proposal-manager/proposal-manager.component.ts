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

    // The Active Reference
    activeConcepts: ScoredConceptDto[]; // Level X (Own)

    // Context Buckets
    immediatePrevConcepts: ScoredConceptDto[]; // Level X-1 (Closest Past)
    immediateNextConcepts: ScoredConceptDto[]; // Level X+1 (Closest Future)
    distantPastConcepts: ScoredConceptDto[];   // Older levels (Deep Past)
    distantFutureConcepts: ScoredConceptDto[]; // Higher levels (Far Future)

    // UI State
    isExpanded: boolean; // For "View More" (distant levels) logic
    showAllLevels: boolean; // Toggle for distant levels
    isPrevExpanded: boolean; // Toggle for Immediate Previous
    isNextExpanded: boolean; // Toggle for Immediate Next

    // Drag & Drop List IDs (need one for each visible bucket to allow drops)
    activeListId: string;
    prevListId: string;
    nextListId: string;
    distantListId: string; // Maybe one shared list for distant? Or separate. Let's separate to be safe.
}

interface CategoryGroup {
    name: string;
    isCollapsed: boolean; // For Category grouping
    hasActiveContent: boolean; // If false, show "Nothing planned"
    subCategories: SubCategoryRow[];
}

interface MethodologicalSection {
    name: string; // "Ataque" | "Defensa"
    isCollapsed: boolean; // Toggle for Section visibility
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

    // UI Constants
    readonly INITIAL_VISIBLE_COUNT = 3;

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

    toggleSection(section: MethodologicalSection) {
        section.isCollapsed = !section.isCollapsed;
    }

    toggleCategory(category: CategoryGroup) {
        category.isCollapsed = !category.isCollapsed;
    }

    toggleRow(row: SubCategoryRow) {
        row.isExpanded = !row.isExpanded;
    }

    toggleShowAllLevels(row: SubCategoryRow) {
        row.showAllLevels = !row.showAllLevels;
    }

    togglePrev(row: SubCategoryRow) {
        row.isPrevExpanded = !row.isPrevExpanded;
    }

    toggleNext(row: SubCategoryRow) {
        row.isNextExpanded = !row.isNextExpanded;
    }

    getVisibleFutureConcepts(row: SubCategoryRow): ScoredConceptDto[] {
        // This method is now deprecated or needs re-evaluation based on new buckets
        // For now, returning empty or adapting to new structure
        return [];
    }

    getVisiblePastConcepts(row: SubCategoryRow): ScoredConceptDto[] {
        // This method is now deprecated or needs re-evaluation based on new buckets
        return [];
    }

    hasHiddenFutureConcepts(row: SubCategoryRow): boolean {
        // This method is now deprecated or needs re-evaluation based on new buckets
        return false;
    }

    hasHiddenPastConcepts(row: SubCategoryRow): boolean {
        // This method is now deprecated or needs re-evaluation based on new buckets
        return false;
    }

    // --- MOVEMENT LOGIC (Click-based) ---

    moveToActive(row: SubCategoryRow, conceptWrapper: ScoredConceptDto) {
        // 1. Remove from source bucket
        this.removeFromContext(row, conceptWrapper);

        // 2. Update Tag
        conceptWrapper.tag = ConceptTag.Own;

        // 3. Add to Active
        row.activeConcepts.push(conceptWrapper);
    }

    moveToContext(row: SubCategoryRow, conceptWrapper: ScoredConceptDto) {
        // 1. Remove from Active
        const idx = row.activeConcepts.indexOf(conceptWrapper);
        if (idx !== -1) {
            row.activeConcepts.splice(idx, 1);
        }

        // 2. Determine Destination & Tag properties
        // We use the first concept of immediate lists to guess the "window" levels
        // But simpler logic: 
        // If level > currentLevel -> Future (Aspirational)
        // If level <= currentLevel -> Past (Reinforcement/Inherited)

        // Note: Ideally we compare against the 'itinerary level', but strictly:
        // Future = Tag.Aspirational
        // Past = Tag.Inherited (or Reinforcement)

        // Let's rely on the concept level vs "active" logic. 
        // For simplicity, we can revert to original logic or just check level.

        // Heuristic: If it was in "Next" before, it should go back to "Next".
        // Generally, higher level = Future.

        // We need to re-evaluate where it belongs.
        // Let's use a helper to place it back.
        this.placeInContext(row, conceptWrapper);
    }

    private removeFromContext(row: SubCategoryRow, concept: ScoredConceptDto) {
        // Try removing from all possible context buckets
        let idx = row.immediatePrevConcepts.indexOf(concept);
        if (idx !== -1) { row.immediatePrevConcepts.splice(idx, 1); return; }

        idx = row.immediateNextConcepts.indexOf(concept);
        if (idx !== -1) { row.immediateNextConcepts.splice(idx, 1); return; }

        idx = row.distantFutureConcepts.indexOf(concept);
        if (idx !== -1) { row.distantFutureConcepts.splice(idx, 1); return; }

        idx = row.distantPastConcepts.indexOf(concept);
        if (idx !== -1) { row.distantPastConcepts.splice(idx, 1); return; }
    }

    private placeInContext(row: SubCategoryRow, conceptWrapper: ScoredConceptDto) {
        const level = conceptWrapper.concept.developmentLevel;

        // Identify "Next Level" value from existing list if possible, or just assume higher level is 'Reto'
        // Simpler approach: Re-run the split logic or just simple insertion?
        // Let's try to match existing buckets first.

        const prevLevel = row.immediatePrevConcepts.length > 0 ? row.immediatePrevConcepts[0].concept.developmentLevel : -1;
        const nextLevel = row.immediateNextConcepts.length > 0 ? row.immediateNextConcepts[0].concept.developmentLevel : 999;

        if (level === nextLevel) {
            conceptWrapper.tag = ConceptTag.Aspirational;
            row.immediateNextConcepts.push(conceptWrapper);
            row.immediateNextConcepts.sort((a, b) => a.concept.developmentLevel - b.concept.developmentLevel);
        } else if (level === prevLevel) {
            conceptWrapper.tag = ConceptTag.Inherited; // or Reinforcement
            row.immediatePrevConcepts.push(conceptWrapper);
            row.immediatePrevConcepts.sort((a, b) => b.concept.developmentLevel - a.concept.developmentLevel);
        } else if (level > nextLevel) {
            conceptWrapper.tag = ConceptTag.Aspirational;
            row.distantFutureConcepts.push(conceptWrapper);
            row.distantFutureConcepts.sort((a, b) => a.concept.developmentLevel - b.concept.developmentLevel);
        } else {
            // level < prevLevel or fallback
            conceptWrapper.tag = ConceptTag.Inherited;
            row.distantPastConcepts.push(conceptWrapper);
            row.distantPastConcepts.sort((a, b) => b.concept.developmentLevel - a.concept.developmentLevel);
        }
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

                    immediatePrevConcepts: [],
                    immediateNextConcepts: [],
                    distantPastConcepts: [],
                    distantFutureConcepts: [],

                    isExpanded: false, // Default collapsed view
                    showAllLevels: false, // Default to not showing all distant levels
                    isPrevExpanded: false,
                    isNextExpanded: false,

                    activeListId: `active-${group.categoryId}`,
                    prevListId: `prev-${group.categoryId}`,
                    nextListId: `next-${group.categoryId}`,
                    distantListId: `dist-${group.categoryId}` // Shared for both distant past/future if needed, or just logically grouped
                });
            }

            const row = sectionCategories.get(rowKey)!;

            // --- Distribute Concepts by Tag Initial Sweep ---
            // Temporarily store all future in distantFutureConcepts and all past in distantPastConcepts
            // These will be split into immediate/distant later.
            group.concepts.forEach(concept => {
                if (concept.tag === ConceptTag.Own) {
                    row.activeConcepts.push(concept);
                } else if (concept.tag === ConceptTag.Aspirational) {
                    // Temporarily store all future in distantFuture
                    row.distantFutureConcepts.push(concept);
                } else {
                    // Inherited (2) or Reinforcement (3)
                    // Temporarily store all past in distantPast
                    row.distantPastConcepts.push(concept);
                }
            });
        });

        // 2. Finalize Buckets (Split logic) & Convert to Array
        this.methodologicalSections = [];
        this.allListIds = [];

        sectionsMap.forEach((subCatsMap, sectName) => {
            // Group subcategories by their parent Category
            const categoriesMap = new Map<string, SubCategoryRow[]>();

            subCatsMap.forEach((row, rowKey) => {
                // --- SPLIT LOGIC ---

                // 1. Sort Future (Ascending Level)
                row.distantFutureConcepts.sort((a, b) => a.concept.developmentLevel - b.concept.developmentLevel);
                // 2. Identify "Next Level"
                // It's the lowest level present in Future list.
                if (row.distantFutureConcepts.length > 0) {
                    const nextLevel = row.distantFutureConcepts[0].concept.developmentLevel;
                    // Move all of this level to immediateNext
                    const nextCs = row.distantFutureConcepts.filter(c => c.concept.developmentLevel === nextLevel);
                    const distantCs = row.distantFutureConcepts.filter(c => c.concept.developmentLevel !== nextLevel);

                    row.immediateNextConcepts = nextCs;
                    row.distantFutureConcepts = distantCs;
                }

                // 3. Sort Past (Descending Level) - closest to current
                row.distantPastConcepts.sort((a, b) => b.concept.developmentLevel - a.concept.developmentLevel);
                // 4. Identify "Prev Level"
                // It's the highest level present in Past list.
                if (row.distantPastConcepts.length > 0) {
                    const prevLevel = row.distantPastConcepts[0].concept.developmentLevel;
                    // Move all of this level to immediatePrev
                    const prevCs = row.distantPastConcepts.filter(c => c.concept.developmentLevel === prevLevel);
                    const distantCs = row.distantPastConcepts.filter(c => c.concept.developmentLevel !== prevLevel);

                    row.immediatePrevConcepts = prevCs;
                    row.distantPastConcepts = distantCs;
                }
                // -------------------

                const catName = rowKey.split('|')[0];
                if (!categoriesMap.has(catName)) {
                    categoriesMap.set(catName, []);
                }

                // Only add row if it has content in at least one bucket
                const hasContent = row.activeConcepts.length > 0
                    || row.immediateNextConcepts.length > 0
                    || row.immediatePrevConcepts.length > 0
                    || row.distantFutureConcepts.length > 0
                    || row.distantPastConcepts.length > 0;

                if (hasContent) {
                    categoriesMap.get(catName)!.push(row);
                    // Collect IDs for drag & drop connections
                    this.allListIds.push(row.activeListId, row.prevListId, row.nextListId, row.distantListId);
                }
            });

            const categories: CategoryGroup[] = [];
            categoriesMap.forEach((rows, catName) => {
                if (rows.length > 0) {
                    const activeContent = rows.some(r => r.activeConcepts.length > 0);
                    categories.push({
                        name: catName,
                        isCollapsed: !activeContent, // Collapse if no active content
                        hasActiveContent: activeContent,
                        subCategories: rows.sort((a, b) => a.name.localeCompare(b.name))
                    });
                }
            });

            if (categories.length > 0) {
                this.methodologicalSections.push({
                    name: sectName,
                    isCollapsed: false,
                    categories: categories.sort((a, b) => a.name.localeCompare(b.name)) // Simple sort for now
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
            // --- Logic for moving between pools (Active / Immediate / Distant) ---
            const targetId = event.container.id; // active-101, prev-101, next-101, dist-101
            // Extract type from ID (e.g., "active-102" -> "active")
            const targetType = targetId.split('-')[0];

            // Deep validation could go here (check if section matches, etc.)
            // But visually user can only drag to connected lists.

            const concept = event.previousContainer.data[event.previousIndex];

            // Update tag immediately for UI feedback
            if (targetType === 'active') {
                concept.tag = ConceptTag.Own;
            } else if (targetType === 'next') {
                concept.tag = ConceptTag.Aspirational;
            } else if (targetType === 'prev') {
                concept.tag = ConceptTag.Inherited; // Simplified
            } else if (targetType === 'dist') {
                // If conceptual level > current => Future, else Past?
                // Ideally we drag to specific buckets. 
                // For "distant", we need to know if it goes to distantFuture or distantPast?
                // If the user drops in "Distant", we'll just assign based on level relative to what?
                // Or simpler: Dropping to "Distant" isn't a primary action. 
                // Primary is Active <-> Next/Prev.

                // Logic:
                if (concept.tag === ConceptTag.Own) {
                    // Leaving Active -> determine based on bucket?
                    // If dropped in "dist", maybe default to Inherited if level < current, else Aspirational?
                    // Just rely on the container.
                }
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
