import { Component, OnInit, DestroyRef, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent } from '@ng-icons/core';
import {
  AvailableSubscription,
  SportTypeResponse,
  CreateSubscriptionRequest,
  SportType,
  SubscriptionType
} from '../../models/subscription.model';
import { SubscriptionService } from '../../services/subscription.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, NavbarComponent, FooterComponent],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  // Signals
  private selectedSubscriptionSignal = signal<AvailableSubscription | null>(null);
  private selectedSportSignal = signal<SportType>(SportType.Basketball); // Default to Basketball
  
  // Computed signals
  public selectedSubscription = computed(() => this.selectedSubscriptionSignal());
  public selectedSport = computed(() => this.selectedSportSignal());
  public canProceed = computed(() => 
    this.selectedSubscriptionSignal() !== null && this.selectedSportSignal() !== null
  );

  // Services
  private subscriptionService = inject(SubscriptionService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // Service signals (computed to avoid initialization issues)
  public availableSubscriptions = computed(() => this.subscriptionService.availableSubscriptions());
  public sportTypes = computed(() => this.subscriptionService.sportTypes());
  public loading = computed(() => this.subscriptionService.loading());
  public error = computed(() => this.subscriptionService.error());
  public hasActiveSubscription = computed(() => this.subscriptionService.hasActiveSubscription());
  public activeSubscription = computed(() => this.subscriptionService.activeSubscription());

  ngOnInit(): void {
    this.loadSubscriptionData();
  }

  private loadSubscriptionData(): void {
    this.subscriptionService.loadSubscriptionData();
  }

  selectSubscription(subscription: AvailableSubscription): void {
    this.selectedSubscriptionSignal.set(subscription);
  }

  selectSport(sportType: SportType): void {
    this.selectedSportSignal.set(sportType);
  }

  onSportChange(sportType: SportType): void {
    this.selectedSportSignal.set(sportType);
  }

  createSubscription(): void {
    if (!this.canProceed()) {
      this.notificationService.showError('Por favor selecciona un plan y un deporte');
      return;
    }

    const request: CreateSubscriptionRequest = {
      subscriptionId: this.selectedSubscription()!.id,
      sport: this.selectedSport()!
    };

    this.subscriptionService.createSubscription(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (subscription) => {
          this.notificationService.showSuccess(
            `¡Suscripción ${subscription.subscriptionName} creada con éxito para ${this.getSportName(subscription.sport)}!`
          );
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.notificationService.showError('Error al crear la suscripción');
          console.error('Error creating subscription:', error);
        }
      });
  }

  getSportName(sportType: SportType): string {
    return this.subscriptionService.getSportTypeName(sportType);
  }

  getSportDescription(sportType: SportType): string {
    const sportTypeMap: { [key: number]: string } = {
      [SportType.Football]: 'Deporte de equipo jugado con los pies',
      [SportType.Basketball]: 'Deporte de equipo jugado con las manos',
      [SportType.Tennis]: 'Deporte de raqueta individual o por parejas',
      [SportType.Volleyball]: 'Deporte de equipo con red',
      [SportType.Rugby]: 'Deporte de contacto con oval',
      [SportType.Handball]: 'Deporte de equipo en pista',
      [SportType.Hockey]: 'Deporte con stick y puck',
      [SportType.Baseball]: 'Deporte de bate y pelota',
      [SportType.Swimming]: 'Deporte acuático competitivo',
      [SportType.Athletics]: 'Deportes de pista y campo',
      [SportType.Other]: 'Otros deportes'
    };

    return sportTypeMap[sportType] || 'Descripción no disponible';
  }

  getSubscriptionTypeName(subscriptionType: SubscriptionType): string {
    return this.subscriptionService.getSubscriptionTypeName(subscriptionType);
  }

  getSubscriptionFeatures(subscription: AvailableSubscription): string[] {
    const features: string[] = [];
    
    if (subscription.maxTeams > 0) {
      features.push(`${subscription.maxTeams} equipo${subscription.maxTeams > 1 ? 's' : ''}`);
    } else if (subscription.maxTeams === -1) {
      features.push('Equipos ilimitados');
    }

    if (subscription.maxTrainingSessions > 0) {
      features.push(`${subscription.maxTrainingSessions} sesiones`);
    } else if (subscription.maxTrainingSessions === -1) {
      features.push('Sesiones ilimitadas');
    }

    if (subscription.canCreateCustomConcepts) {
      features.push('Conceptos personalizados');
    }

    if (subscription.canCreateItineraries) {
      features.push('Itinerarios');
    }

    if (subscription.hasDirectorMode) {
      features.push('Modo director');
    }

    return features;
  }

  getSubscriptionPrice(subscription: AvailableSubscription): string {
    if (subscription.price === 0) {
      return 'Gratis';
    }
    return `€${subscription.price.toFixed(2)}/mes`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }

  retry(): void {
    this.loadSubscriptionData();
  }

  isSelectedSubscription(subscription: AvailableSubscription): boolean {
    return this.selectedSubscription()?.id === subscription.id;
  }

  isSelectedSport(sportType: SportType): boolean {
    return this.selectedSport() === sportType;
  }

  getPopularBadge(subscription: AvailableSubscription): string {
    if (subscription.type === SubscriptionType.Coach) {
      return 'POPULAR';
    }
    return '';
  }
}
