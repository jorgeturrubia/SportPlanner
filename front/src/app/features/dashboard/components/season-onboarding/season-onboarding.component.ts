import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeasonService } from '../../../../services/season.service';
import { Season, CreateSeasonDto } from '../../../../models/season.model';

@Component({
  selector: 'app-season-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './season-onboarding.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SeasonOnboardingComponent {
  private seasonService = inject(SeasonService);

  name = signal('');
  startDate = signal(new Date().toISOString().split('T')[0]);
  endDate = signal(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]);
  
  isSubmitting = signal(false);
  errorMessage = signal('');

  async createSeason() {
    if (!this.name() || !this.startDate() || !this.endDate()) {
      this.errorMessage.set('Por favor completa todos los campos.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const dto: CreateSeasonDto = {
      name: this.name(),
      startDate: new Date(this.startDate()).toISOString(),
      endDate: new Date(this.endDate()).toISOString()
    };

    this.seasonService.createSeason(dto).subscribe({
      next: (createdSeason: Season) => {
        // Explicitly set the new season as active (Global Context)
        this.seasonService.setSeason(createdSeason);
        
        // Refresh checks, which should clear the modal via the parent's logic
        this.seasonService.checkUserSeasons();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Error creating season', err);
        this.errorMessage.set('Error al crear la temporada. Inténtalo de nuevo.');
        this.isSubmitting.set(false);
      }
    });
  }
}
