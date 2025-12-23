import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonService } from '../../services/season.service';
import { Season } from '../../models/season.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-season-selector',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './season-selector.component.html',
    styleUrls: ['./season-selector.component.css']
})
export class SeasonSelectorComponent implements OnInit {
    private seasonService = inject(SeasonService);

    availableSeasons = signal<Season[]>([]);
    selectedSeasonId = signal<number | null>(null);

    // We expose the current season to the template if needed
    currentSeason = this.seasonService.currentSeason;

    ngOnInit() {
        this.loadSeasons();

        // Subscribe to refresh events from service
        this.seasonService.seasonsRefreshed$.subscribe(() => {
            this.loadSeasons();
        });

        // Subscribe to internal state changes to sync dropdown
        const current = this.seasonService.currentSeason();
        if (current) {
            this.selectedSeasonId.set(current.id);
        }
    }

    loadSeasons() {
        // TODO: Get organization ID from AuthService or select "Global" seasons
        // For now, load all valid seasons
        this.seasonService.getSeasons().subscribe({
            next: (seasons) => {
                this.availableSeasons.set(seasons);

                // Auto-select latest active if none selected
                if (!this.selectedSeasonId() && seasons.length > 0) {
                    // Find active or first
                    const active = seasons.find(s => s.isActive);
                    if (active) {
                        this.onSeasonChange(active.id);
                    } else {
                        this.onSeasonChange(seasons[0].id);
                    }
                }
            },
            error: (err) => console.error('Error loading seasons', err)
        });
    }

    onSeasonChange(seasonId: number) {
        if (!seasonId) {
            this.seasonService.setSeason(null);
            this.selectedSeasonId.set(null);
            return;
        }

        const season = this.availableSeasons().find(s => s.id == seasonId);
        if (season) {
            this.seasonService.setSeason(season);
            this.selectedSeasonId.set(season.id);
        }
    }
}
