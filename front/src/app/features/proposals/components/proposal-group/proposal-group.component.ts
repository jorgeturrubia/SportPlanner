import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConceptCardComponent } from '../concept-card/concept-card.component';
import { ConceptProposalGroupDto, ScoredConceptDto } from '../../models/proposal.models';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-proposal-group',
    standalone: true,
    imports: [CommonModule, DragDropModule, ConceptCardComponent],
    templateUrl: './proposal-group.component.html',
    styleUrls: ['./proposal-group.component.css']
})
export class ProposalGroupComponent {
    @Input() group!: ConceptProposalGroupDto;
    @Input() connectedTo: string[] = [];
    @Input() idPrefix: string = '';
    @Input() displayTitle?: string;

    get listId(): string {
        return `${this.idPrefix}-${this.group.categoryId}`;
    }

    drop(event: CdkDragDrop<ScoredConceptDto[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }
    }
}
