import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  UserSubscriptionStatus, 
  AvailableSubscription, 
  SportTypeResponse,
  UserSubscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest
} from '../models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/api/subscription`;
  
  // Signals for reactive state management
  private subscriptionStatusSignal = signal<UserSubscriptionStatus | null>(null);
  private availableSubscriptionsSignal = signal<AvailableSubscription[]>([]);
  private sportTypesSignal = signal<SportTypeResponse[]>([]);
  private userSubscriptionsSignal = signal<UserSubscription[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  public subscriptionStatus = computed(() => this.subscriptionStatusSignal());
  public availableSubscriptions = computed(() => this.availableSubscriptionsSignal());
  public sportTypes = computed(() => this.sportTypesSignal());
  public userSubscriptions = computed(() => this.userSubscriptionsSignal());
  public loading = computed(() => this.loadingSignal());
  public error = computed(() => this.errorSignal());
  public hasActiveSubscription = computed(() => 
    this.subscriptionStatusSignal()?.hasActiveSubscription || false
  );
  public activeSubscription = computed(() => 
    this.subscriptionStatusSignal()?.activeSubscription
  );

  constructor(private http: HttpClient) {}

  // Get user subscription status
  getSubscriptionStatus(): Observable<UserSubscriptionStatus> {
    console.log('📡 SubscriptionService: Getting subscription status...');
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<UserSubscriptionStatus>(`${this.apiUrl}/status`).pipe(
      tap(status => {
        console.log('📡 SubscriptionService: Status received:', status);
        this.subscriptionStatusSignal.set(status);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        console.error('📡 SubscriptionService: Error getting subscription status:', error);
        this.handleError(error, 'Error al obtener estado de suscripción');
        return of({
          hasActiveSubscription: false,
          allSubscriptions: []
        } as UserSubscriptionStatus);
      })
    );
  }

  // Get available subscriptions
  getAvailableSubscriptions(): Observable<AvailableSubscription[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.get<AvailableSubscription[]>(`${this.apiUrl}/available`).pipe(
      tap(subscriptions => {
        this.availableSubscriptionsSignal.set(subscriptions);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.handleError(error, 'Error al obtener suscripciones disponibles');
        return of([]);
      })
    );
  }

  // Get sport types
  getSportTypes(): Observable<SportTypeResponse[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.get<SportTypeResponse[]>(`${this.apiUrl}/sport-types`).pipe(
      tap(sportTypes => {
        this.sportTypesSignal.set(sportTypes);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.handleError(error, 'Error al obtener tipos de deportes');
        return of([]);
      })
    );
  }

  // Get user subscriptions
  getUserSubscriptions(): Observable<UserSubscription[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.get<UserSubscription[]>(this.apiUrl).pipe(
      tap(subscriptions => {
        this.userSubscriptionsSignal.set(subscriptions);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.handleError(error, 'Error al obtener suscripciones del usuario');
        return of([]);
      })
    );
  }

  // Get subscription by ID
  getSubscriptionById(subscriptionId: string): Observable<UserSubscription | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.get<UserSubscription>(`${this.apiUrl}/${subscriptionId}`).pipe(
      tap(() => this.loadingSignal.set(false)),
      catchError(error => {
        this.handleError(error, 'Error al obtener suscripción');
        return of(null);
      })
    );
  }

  // Create new subscription
  createSubscription(request: CreateSubscriptionRequest): Observable<UserSubscription> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.post<UserSubscription>(this.apiUrl, request).pipe(
      tap(subscription => {
        // Refresh subscription status after creating new subscription
        this.getSubscriptionStatus().subscribe();
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.handleError(error, 'Error al crear suscripción');
        throw error;
      })
    );
  }

  // Update subscription
  updateSubscription(subscriptionId: string, request: UpdateSubscriptionRequest): Observable<UserSubscription> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.put<UserSubscription>(`${this.apiUrl}/${subscriptionId}`, request).pipe(
      tap(subscription => {
        // Refresh subscription status after updating
        this.getSubscriptionStatus().subscribe();
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.handleError(error, 'Error al actualizar suscripción');
        throw error;
      })
    );
  }

  // Cancel subscription
  cancelSubscription(subscriptionId: string): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.post<void>(`${this.apiUrl}/${subscriptionId}/cancel`, {}).pipe(
      tap(() => {
        // Refresh subscription status after canceling
        this.getSubscriptionStatus().subscribe();
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.handleError(error, 'Error al cancelar suscripción');
        throw error;
      })
    );
  }

  // Check if user can access dashboard
  canAccessDashboard(): Observable<boolean> {
    console.log('📡 SubscriptionService: Checking dashboard access...');

    return this.http.get<boolean>(`${this.apiUrl}/can-access-dashboard`).pipe(
      tap(canAccess => {
        console.log('📡 SubscriptionService: Dashboard access result:', canAccess);
      }),
      catchError(error => {
        console.error('📡 SubscriptionService: Error checking dashboard access:', error);
        this.handleError(error, 'Error al verificar acceso al dashboard');
        return of(false);
      })
    );
  }

  // Load all subscription data
  loadSubscriptionData(): void {
    this.getSubscriptionStatus().subscribe();
    this.getAvailableSubscriptions().subscribe();
    this.getSportTypes().subscribe();
  }

  // Get sport type name
  getSportTypeName(sportType: number): string {
    const sportTypeMap: { [key: number]: string } = {
      [0]: 'Fútbol',
      [1]: 'Baloncesto',
      [2]: 'Tenis',
      [3]: 'Voleibol',
      [4]: 'Rugby',
      [5]: 'Balonmano',
      [6]: 'Hockey',
      [7]: 'Béisbol',
      [8]: 'Natación',
      [9]: 'Atletismo',
      [10]: 'Otro'
    };
    
    return sportTypeMap[sportType] || 'Desconocido';
  }

  // Get subscription type name
  getSubscriptionTypeName(subscriptionType: number): string {
    const subscriptionTypeMap: { [key: number]: string } = {
      [0]: 'Gratuita',
      [1]: 'Entrenador',
      [2]: 'Club'
    };
    
    return subscriptionTypeMap[subscriptionType] || 'Desconocido';
  }

  // Clear state
  clearState(): void {
    this.subscriptionStatusSignal.set(null);
    this.availableSubscriptionsSignal.set([]);
    this.sportTypesSignal.set([]);
    this.userSubscriptionsSignal.set([]);
    this.errorSignal.set(null);
    this.loadingSignal.set(false);
  }

  // Error handling
  private handleError(error: any, defaultMessage: string): void {
    console.error(error);
    const errorMessage = error.error?.message || error.message || defaultMessage;
    this.errorSignal.set(errorMessage);
    this.loadingSignal.set(false);
  }
}
