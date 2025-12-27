import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MethodologicalItineraryService, MethodologicalItinerary } from '../../../../../services/methodological-itinerary.service';
import { NotificationService } from '../../../../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-itinerary-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './itinerary-list.component.html',
  styleUrl: './itinerary-list.component.css'
})
export class ItineraryListComponent implements OnInit {
  itineraries = signal<MethodologicalItinerary[]>([]);
  loading = signal<boolean>(false);

  constructor(
    private itineraryService: MethodologicalItineraryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadItineraries();
  }

  loadItineraries(): void {
    this.loading.set(true);
    this.itineraryService.getMyItineraries().subscribe({
      next: (results) => {
        this.itineraries.set(results);
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error', 'No se pudieron cargar tus itinerarios');
        this.loading.set(false);
      }
    });
  }

  deleteItinerary(itinerary: MethodologicalItinerary): void {
    if (confirm(`¿Estás seguro de que quieres eliminar "${itinerary.name}"?`)) {
      this.itineraryService.delete(itinerary.id).subscribe({
        next: () => {
          this.notificationService.success('Eliminado', 'Itinerario eliminado correctamente');
          this.loadItineraries();
        },
        error: () => {
          this.notificationService.error('Error', 'No se pudo eliminar el itinerario');
        }
      });
    }
  }
}
