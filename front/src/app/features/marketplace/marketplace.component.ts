import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { LookupService, TeamCategory } from '../../services/lookup.service';
import { MethodologicalItinerary, MarketplaceFilter } from '../../core/models/planning-template.model';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RatingStarsComponent],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.css'
})
export class MarketplaceComponent implements OnInit {
  itineraries = signal<MethodologicalItinerary[]>([]);
  categories = signal<TeamCategory[]>([]);
  loading = signal<boolean>(false);
  
  filter: MarketplaceFilter = {
    searchTerm: '',
    teamCategoryId: undefined
  };

  constructor(
    private marketplaceService: MarketplaceService,
    private lookupService: LookupService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.search();
  }

  loadCategories(): void {
    this.lookupService.getTeamCategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }

  search(): void {
    this.loading.set(true);
    this.marketplaceService.search(this.filter).subscribe({
      next: (results) => {
        this.itineraries.set(results);
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.error('Error', 'Error al cargar el marketplace');
        this.loading.set(false);
      }
    });
  }

  download(itinerary: MethodologicalItinerary): void {
    this.marketplaceService.download(itinerary.id).subscribe({
      next: () => {
        this.notificationService.success('Completado', `Itinerario "${itinerary.name}" y sus plantillas añadido a tus plantillas`);
      },
      error: (err) => {
        this.notificationService.error('Error', 'No se pudo añadir el itinerario');
      }
    });
  }

  onRate(itineraryId: number, rating: number): void {
    this.marketplaceService.rate({ itineraryId, rating }).subscribe({
      next: () => {
        this.notificationService.success('Voto registrado', '¡Gracias por tu valoración!');
        this.search(); // Reload to update averages
      },
      error: () => {
        this.notificationService.error('Error', 'No se pudo registrar tu valoración');
      }
    });
  }
}
