import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalPriority, ScoredConceptDto, ConceptTag } from '../../models/proposal.models';

@Component({
    selector: 'app-concept-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './concept-card.component.html',
    styleUrls: ['./concept-card.component.css']
})
export class ConceptCardComponent {
    @Input() scoredConcept!: ScoredConceptDto;

    get priorityClass(): string {
        switch (this.scoredConcept.priority) {
            case ProposalPriority.Essential: return 'border-l-4 border-l-secondary';
            case ProposalPriority.Recommended: return 'border-l-4 border-l-primary';
            case ProposalPriority.Progressive: return 'border-l-4 border-l-blue-400';
            case ProposalPriority.Optional: return 'border-l-4 border-l-gray-600';
            default: return '';
        }
    }

    get tagLabel(): string {
        switch (this.scoredConcept.tag) {
            case ConceptTag.Own: return 'TU NIVEL';
            case ConceptTag.Inherited: return 'BASE';
            case ConceptTag.Reinforcement: return 'REFUERZO';
            case ConceptTag.Aspirational: return 'RETO';
            default: return '';
        }
    }

    get tagClass(): string {
        switch (this.scoredConcept.tag) {
            case ConceptTag.Own: return 'bg-secondary text-black';
            case ConceptTag.Inherited: return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
            case ConceptTag.Reinforcement: return 'bg-orange-500 text-white animate-pulse';
            case ConceptTag.Aspirational: return 'bg-yellow-500 text-black font-black shadow-[0_0_10px_rgba(234,179,8,0.5)]';
            default: return 'bg-gray-700 text-gray-400';
        }
    }

    get priorityLabel(): string {
        switch (this.scoredConcept.priority) {
            case ProposalPriority.Essential: return 'Esencial';
            case ProposalPriority.Recommended: return 'Recomendado';
            case ProposalPriority.Progressive: return 'Progresivo';
            case ProposalPriority.Optional: return 'Opcional';
            default: return 'Desconocido';
        }
    }

    get scorePercentage(): number {
        return Math.round(this.scoredConcept.score * 100);
    }

    get scoreColor(): string {
        const score = this.scoredConcept.score;
        if (score >= 0.8) return 'text-secondary';
        if (score >= 0.6) return 'text-primary';
        if (score >= 0.4) return 'text-blue-400';
        return 'text-gray-500';
    }
}
