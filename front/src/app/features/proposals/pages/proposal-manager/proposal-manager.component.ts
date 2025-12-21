import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProposalGroupComponent } from '../../components/proposal-group/proposal-group.component';
import { ItineraryTunerComponent } from '../../components/itinerary-tuner/itinerary-tuner.component';
import { ProposalsService } from '../../services/proposals.service';
import { TeamsService } from '../../../../services/teams.service';
import { ConceptProposalResponseDto, ConceptProposalGroupDto } from '../../models/proposal.models';

@Component({
    selector: 'app-proposal-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, ProposalGroupComponent, ItineraryTunerComponent],
    templateUrl: './proposal-manager.component.html',
    styleUrls: ['./proposal-manager.component.css']
})
export class ProposalManagerComponent implements OnInit {
    teams: any[] = [];
    selectedTeamId: number | null = null;
    currentLevelOffset: number = 0;
    loading = false;
    response: ConceptProposalResponseDto | null = null;

    // Hierarchical Data Structures
    suggestedTree: ParentCategoryGroup[] = [];
    optionalTree: ParentCategoryGroup[] = [];

    // Lists for drag and drop connections
    suggestedListIds: string[] = [];
    optionalListIds: string[] = [];
    allListIds: string[] = [];

    // Collapsed state tracking (parentId -> boolean)
    collapsedState: { [key: string]: boolean } = {};

    constructor(
        private proposalsService: ProposalsService,
        private teamsService: TeamsService
    ) { }

    ngOnInit(): void {
        this.loadTeams();
    }

    loadTeams() {
        this.teamsService.getMyTeams().subscribe({
            next: (res) => this.teams = res,
            error: (err) => console.error('Error loading teams', err)
        });
    }

    onTeamChange() {
        this.currentLevelOffset = 0; // Reset offset on team change
        if (this.selectedTeamId) {
            this.generateProposals();
        } else {
            this.response = null;
            this.suggestedTree = [];
            this.optionalTree = [];
        }
    }

    onOffsetChange(newOffset: number) {
        this.currentLevelOffset = newOffset;
        this.generateProposals();
    }

    generateProposals() {
        if (!this.selectedTeamId) return;

        this.loading = true;
        this.response = null;
        this.suggestedTree = [];
        this.optionalTree = [];

        this.proposalsService.generateProposals({
            teamId: this.selectedTeamId,
            levelOffset: this.currentLevelOffset
        }).subscribe({
            next: (res) => {
                this.response = res;
                this.processResponseIntoTrees();
                this.updateDragDropConnections();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error generating proposals', err);
                this.loading = false;
            }
        });
    }

    private processResponseIntoTrees() {
        if (!this.response) return;

        this.suggestedTree = this.buildTree(this.response.suggestedGroups);
        this.optionalTree = this.buildTree(this.response.optionalGroups);
    }

    private buildTree(groups: ConceptProposalGroupDto[]): ParentCategoryGroup[] {
        const treeMap = new Map<string, ParentCategoryGroup>();

        groups.forEach(group => {
            // Assuming format "Parent > Child" or just "Parent"
            // If no separator, treat as "General" parent or self-parent
            const parts = group.categoryName.split(' > ');
            let parentName = parts.length > 1 ? parts[0] : group.categoryName;
            let subCategoryName = parts.length > 1 ? parts[1] : group.categoryName;

            // If it was just one level, parent is the category itself, and subcategory is "General" or same name
            // But user wants "Technica Individual" -> "Bote".
            // If API returns "Técnica Individual" naming convention might vary.
            // Let's assume standard "Parent > Child" is returned for subcategories.

            if (!treeMap.has(parentName)) {
                treeMap.set(parentName, {
                    parentName: parentName,
                    subGroups: [],
                    totalConcepts: 0,
                    isCollapsed: false // Default expanded
                });
            }

            const parent = treeMap.get(parentName)!;

            // Modify group name to only show subcategory part for display if needed
            // But we keep the original group dto intact, just grouping it.
            // We can add a display property to a wrapper if needed, or just use subCategoryName in template.

            parent.subGroups.push({
                ...group,
                displaySubCategoryName: subCategoryName
            });
            parent.totalConcepts += group.concepts.length;
        });

        // Convert map to array and sort if needed
        return Array.from(treeMap.values());
    }

    toggleCollapse(parentName: string) {
        // Logic to toggle collapse state if we want to persist it or use the property on object
        // Using the object property is easier for the loop
    }

    private updateDragDropConnections() {
        if (!this.response) return;

        // These IDs must match what is generated in ProposalGroupComponent
        this.suggestedListIds = this.response.suggestedGroups.map(g => `suggested-${g.categoryId}`);
        this.optionalListIds = this.response.optionalGroups.map(g => `optional-${g.categoryId}`);
        this.allListIds = [...this.suggestedListIds, ...this.optionalListIds];
    }
}

// Interface for Tree Structure
interface ParentCategoryGroup {
    parentName: string;
    subGroups: (ConceptProposalGroupDto & { displaySubCategoryName?: string })[];
    totalConcepts: number;
    isCollapsed: boolean;
}
