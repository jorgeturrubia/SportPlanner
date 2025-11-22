import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Sport {
    id: number;
    name: string;
    description?: string;
}

export interface SubscriptionPlan {
    id: number;
    name: string;
    description?: string;
    price: number;
    billingPeriod: string;
    maxTeams?: number;
    maxPlayers?: number;
}

export interface Subscription {
    id: number;
    userSupabaseId?: string;
    organizationId?: number;
    planId: number;
    sportId: number;
    status: string;
    isActive: boolean;
    startDate: string;
    endDate?: string;
    plan?: SubscriptionPlan;
    sport?: Sport;
}

export interface CreateSubscriptionDto {
    planId: number;
    sportId: number;
    userSupabaseId?: string;
    organizationId?: number;
}

@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
    constructor(private http: HttpClient) { }

    getMySubscriptions(): Observable<Subscription[]> {
        return this.http.get<Subscription[]>(`${environment.apiUrl}/subscriptions/my-subscriptions`);
    }

    createSubscription(dto: CreateSubscriptionDto): Observable<Subscription> {
        return this.http.post<Subscription>(`${environment.apiUrl}/subscriptions`, dto);
    }

    getSports(): Observable<Sport[]> {
        return this.http.get<Sport[]>(`${environment.apiUrl}/lookups/sports`);
    }

    getSubscriptionPlans(): Observable<SubscriptionPlan[]> {
        return this.http.get<SubscriptionPlan[]>(`${environment.apiUrl}/lookups/subscription-plans`);
    }
}
