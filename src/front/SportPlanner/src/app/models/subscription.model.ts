export enum SubscriptionType {
  Free = 0,
  Coach = 1,
  Club = 2
}

export enum SportType {
  Football = 0,
  Basketball = 1,
  Tennis = 2,
  Volleyball = 3,
  Rugby = 4,
  Handball = 5,
  Hockey = 6,
  Baseball = 7,
  Swimming = 8,
  Athletics = 9,
  Other = 10
}

export interface Subscription {
  id: number;
  name: string;
  type: SubscriptionType;
  price: number;
  description: string;
  maxTeams: number;
  maxTrainingSessions: number;
  canCreateCustomConcepts: boolean;
  canCreateItineraries: boolean;
  hasDirectorMode: boolean;
  isActive: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  subscriptionId: number;
  subscriptionType: SubscriptionType;
  subscriptionName: string;
  sport: SportType;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscriptionStatus {
  hasActiveSubscription: boolean;
  activeSubscription?: UserSubscription;
  allSubscriptions: UserSubscription[];
}

export interface AvailableSubscription {
  id: number;
  name: string;
  type: SubscriptionType;
  price: number;
  description: string;
  maxTeams: number;
  maxTrainingSessions: number;
  canCreateCustomConcepts: boolean;
  canCreateItineraries: boolean;
  hasDirectorMode: boolean;
}

export interface SportTypeResponse {
  sportType: SportType;
  name: string;
  description: string;
}

export interface CreateSubscriptionRequest {
  subscriptionId: number;
  sport: SportType;
  endDate?: string;
}

export interface UpdateSubscriptionRequest {
  subscriptionId: number;
  sport: SportType;
  endDate?: string;
  isActive: boolean;
}
