import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ConceptProposalRequestDto, ConceptProposalResponseDto } from '../models/proposal.models';

@Injectable({
    providedIn: 'root'
})
export class ProposalsService {
    private apiUrl = `${environment.apiUrl}/ConceptProposals`;

    constructor(private http: HttpClient) { }

    generateProposals(request: ConceptProposalRequestDto): Observable<ConceptProposalResponseDto> {
        return this.http.post<ConceptProposalResponseDto>(`${this.apiUrl}/generate`, request);
    }

    getProposalsForTeam(teamId: number, durationDays?: number, seasonId?: number): Observable<ConceptProposalResponseDto> {
        let url = `${this.apiUrl}/team/${teamId}?`;
        if (durationDays) {
            url += `durationDays=${durationDays}&`;
        }
        if (seasonId) {
            url += `seasonId=${seasonId}&`;
        }
        return this.http.get<ConceptProposalResponseDto>(url);
    }
}
