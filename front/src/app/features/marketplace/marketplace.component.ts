import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { LookupService, TeamCategory } from '../../services/lookup.service';
import { MarketplaceItem, MarketplaceFilter, ItineraryDetail, TemplateDetail } from '../../core/models/planning-template.model';
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
  items = signal<MarketplaceItem[]>([]);
  categories = signal<TeamCategory[]>([]);
  loading = signal<boolean>(false);
  
  // Viewer state
  selectedItem = signal<MarketplaceItem | null>(null);
  detail = signal<ItineraryDetail | TemplateDetail | null>(null);
  showViewer = signal<boolean>(false);
  loadingDetail = signal<boolean>(false);
  
  filter: MarketplaceFilter = {
    searchTerm: '',
    teamCategoryId: undefined,
    itemType: 'itinerary'
  };

  itemTypes = [
    { value: 'itinerary', label: 'Itinerarios' },
    { value: 'template', label: 'Templates' },
    { value: 'concept', label: 'Conceptos' },
    { value: 'exercise', label: 'Ejercicios' }
  ];

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
        this.items.set(results);
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.error('Error', 'Error al cargar el marketplace');
        this.loading.set(false);
      }
    });
  }

  onTypeChange(type: any): void {
    this.filter.itemType = type;
    this.search();
  }

  download(item: MarketplaceItem): void {
    this.marketplaceService.download(item.id).subscribe({
      next: () => {
        this.notificationService.success('Completado', `"${item.name}" añadido a tus recursos`);
      },
      error: (err) => {
        this.notificationService.error('Error', 'No se pudo descargar el recurso');
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

  viewDetail(item: MarketplaceItem): void {
    this.selectedItem.set(item);
    this.showViewer.set(true);
    this.detail.set(null);
    this.loadingDetail.set(true);
    
    if (item.itemType === 'itinerary') {
        this.marketplaceService.getDetail(item.id).subscribe({
            next: (detail) => {
                this.detail.set(detail);
                this.loadingDetail.set(false);
            },
            error: () => {
                this.notificationService.error('Error', 'No se pudieron cargar los detalles del itinerario');
                this.loadingDetail.set(false);
                this.showViewer.set(false);
            }
        });
    } else if (item.itemType === 'template') {
        this.marketplaceService.getTemplateDetail(item.id).subscribe({
            next: (detail) => {
                this.detail.set(detail);
                this.loadingDetail.set(false);
            },
            error: () => {
                this.notificationService.error('Error', 'No se pudieron cargar los detalles del template');
                this.loadingDetail.set(false);
                this.showViewer.set(false);
            }
        });
    }
  }

  closeViewer(): void {
    this.showViewer.set(false);
  }

  hasConcept(template: any, conceptName: string): boolean {
    return template.concepts.includes(conceptName);
  }
}
