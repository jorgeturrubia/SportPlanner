import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeasonService } from '../../../../../services/season.service';
import { Season, CreateSeasonDto } from '../../../../../models/season.model';

@Component({
    selector: 'app-seasons-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './seasons.component.html'
})
export class SeasonsComponent implements OnInit {
    private seasonService = inject(SeasonService);

    seasons = signal<Season[]>([]);

    newSeasonName = '';
    newSeasonStart = '';
    newSeasonEnd = '';

    ngOnInit() {
        this.loadSeasons();
    }

    loadSeasons() {
        this.seasonService.getSeasons().subscribe(seasons => {
            this.seasons.set(seasons);
        });
    }

    createSeason() {
        if (!this.newSeasonName || !this.newSeasonStart || !this.newSeasonEnd) return;

        const dto: CreateSeasonDto = {
            name: this.newSeasonName,
            startDate: new Date(this.newSeasonStart).toISOString(),
            endDate: new Date(this.newSeasonEnd).toISOString()
        };

        this.seasonService.createSeason(dto).subscribe(() => {
            this.loadSeasons();
            this.newSeasonName = '';
        });
    }

    deleteSeason(id: number) {
        if (!confirm('¿Seguro que quieres borrar esta temporada?')) return;
        this.seasonService.deleteSeason(id).subscribe(() => this.loadSeasons());
    }

    toggleActive(season: Season) {
        // Implement toggle active logic in service/backend if needed specific endpoint
        // season.isActive = !season.isActive;
        // this.seasonService.updateSeason(season.id, season).subscribe();
    }
}
