import { Component, OnInit, signal, OnDestroy, computed } from '@angular/core'; // Trigger rebuild
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { LookupService, TeamCategory } from '../../services/lookup.service';
import { MarketplaceItem, MarketplaceFilter, ItineraryDetail, TemplateDetail } from '../../core/models/planning-template.model';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RatingStarsComponent],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.css'
})
export class MarketplaceComponent implements OnInit, OnDestroy {
  items = signal<MarketplaceItem[]>([]);
  categories = signal<TeamCategory[]>([]);
  conceptCategories = signal<any[]>([]); // To hold all categories for hierarchy
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
    { value: 'template', label: 'Planificaciones' },
    { value: 'concept', label: 'Conceptos' },
    { value: 'exercise', label: 'Ejercicios' }
  ];

  private searchSubscription?: Subscription;

  constructor(
    private marketplaceService: MarketplaceService,
    private lookupService: LookupService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.search();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
        this.searchSubscription.unsubscribe();
    }
  }

  loadCategories(): void {
    this.lookupService.getTeamCategories().subscribe(cats => {
      this.categories.set(cats);
    });

    // Load all concept categories to build hierarchy
    this.lookupService.getConceptCategories().subscribe(cats => {
      this.conceptCategories.set(cats);
    });
  }

  search(): void {
    if (this.searchSubscription) {
        this.searchSubscription.unsubscribe();
    }
    
    this.loading.set(true);
    // Clear items immediately to avoid showing stale data while loading
    // this.items.set([]); // Optional: depends on UX preference. Keeping old items is usually better unless type changes.
    // If type changed, we might want to clear.
    // Let's rely on loading spinner overlay or checking type.
    
    this.searchSubscription = this.marketplaceService.search(this.filter).subscribe({
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
    this.items.set([]); // Clear items on tab change to give immediate feedback of context switch
    this.search();
  }

  downloadingItems = signal<Set<number>>(new Set());

  isDownloading(id: number): boolean {
    return this.downloadingItems().has(id);
  }

  // Hierarchical Concepts logic
  nestedConcepts = computed(() => {
    if (this.filter.itemType !== 'concept') return [];
    
    const concepts = this.items();
    const categories = this.conceptCategories();
    
    if (concepts.length === 0 || categories.length === 0) return [];

    const categoryMap = new Map<number, any>();
    categories.forEach(c => categoryMap.set(c.id, { ...c, items: [], subcategories: [], expanded: true }));

    // Add concepts to their categories
    concepts.forEach(item => {
      if (item.categoryId && categoryMap.has(item.categoryId)) {
        categoryMap.get(item.categoryId).items.push(item);
      }
    });

    // Build tree
    const roots: any[] = [];
    categoryMap.forEach(node => {
      if (node.parentId && categoryMap.has(node.parentId)) {
        categoryMap.get(node.parentId).subcategories.push(node);
      } else {
        roots.push(node);
      }
    });

    // Filter out branches that don't have concepts or subcategories with concepts
    const filterEmpty = (nodes: any[]): any[] => {
      return nodes.filter(n => {
        n.subcategories = filterEmpty(n.subcategories);
        return n.items.length > 0 || n.subcategories.length > 0;
      });
    };

    return filterEmpty(roots);
  });

  toggleCategory(cat: any) {
    cat.expanded = !cat.expanded;
  }

  download(item: MarketplaceItem): void {
    if (item.isDownloaded || this.isDownloading(item.id)) return;

    this.downloadingItems.update(set => {
      const newSet = new Set(set);
      newSet.add(item.id);
      return newSet;
    });

    let request;
    if (item.itemType === 'itinerary') {
        request = this.marketplaceService.download(item.id);
    } else if (item.itemType === 'template') {
        request = this.marketplaceService.cloneTemplate(item.id);
    } else if (item.itemType === 'concept') {
        request = this.marketplaceService.cloneConcept(item.id);
    } else {
        // Fallback or handle assumption that it's a category/exercise
        // For now, based on itemTypes, 'exercise' is an option but we don't have cloneExercise yet?
        // The plan didn't explicitly mention cloneExercise, but 'Exercise' was in the list.
        // Assuming concept for now or ignore. 
        // Wait, spec said 'Conceptos, Categorías, Itinerarios, Templates y Ejercicios'.
        // My service update only added cloneConcept, cloneCategory, cloneTemplate.
        // I will assume exercise is not yet fully supported or handled as concept?
        // Let's stick to what I added. If itemType is 'concept' I use cloneConcept.
        // If 'exercise' I might need to skip or handle. Let's assume concept for now.
        // The itemTypes array has: itinerary, template, concept, exercise.
        if (item.itemType === 'exercise') {
             request = this.marketplaceService.cloneExercise(item.id);
        } else {
             request = this.marketplaceService.cloneConcept(item.id);
        }
    }

    if (request) {
        (request as any).subscribe({
            next: () => {
                this.notificationService.success('Completado', `"${item.name}" añadido a tus recursos`);
                // Update local state
                this.items.update(currentItems => 
                    currentItems.map(i => i.id === item.id ? { ...i, isDownloaded: true } : i)
                );
                
                // Also update selected item if it's the one open
                if (this.selectedItem()?.id === item.id) {
                    this.selectedItem.update(i => i ? { ...i, isDownloaded: true } : null);
                }

                this.downloadingItems.update(set => {
                    const newSet = new Set(set);
                    newSet.delete(item.id);
                    return newSet;
                });
            },
            error: (err: any) => {
                this.notificationService.error('Error', 'No se pudo descargar el recurso');
                this.downloadingItems.update(set => {
                    const newSet = new Set(set);
                    newSet.delete(item.id);
                    return newSet;
                });
            }
        });
    }
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
                this.notificationService.error('Error', 'No se pudieron cargar los detalles de la planificación');
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

  getItemTypeLabel(value: string): string {
    return this.itemTypes.find(t => t.value === value)?.label || value;
  }
}
