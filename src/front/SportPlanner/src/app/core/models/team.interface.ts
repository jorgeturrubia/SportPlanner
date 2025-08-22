export interface Team {
  id: string;
  name: string;
  sport: string;
  category: string;
  gender: 'male' | 'female' | 'mixed';
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  playersCount: number;
  membersCount: number;
  coachName?: string;
  status: 'active' | 'inactive' | 'suspended';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeamRequest {
  name: string;
  sport: string;
  category: string;
  gender: 'male' | 'female' | 'mixed';
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  playersCount: number;
  description?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  sport?: string;
  category?: string;
  gender?: 'male' | 'female' | 'mixed';
  level?: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  playersCount?: number;
  description?: string;
}