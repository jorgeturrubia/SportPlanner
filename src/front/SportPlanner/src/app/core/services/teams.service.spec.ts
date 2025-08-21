import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeamsService } from './teams.service';
import { 
  Team, 
  CreateTeamRequest, 
  UpdateTeamRequest, 
  Sport, 
  TeamMember, 
  AddTeamMemberRequest, 
  UpdateTeamMemberRequest,
  TeamsListResponse,
  CanCreateTeamResponse,
  TeamStatus,
  TeamMemberRole,
  TeamMemberStatus
} from '../models/team.interface';

describe('TeamsService', () => {
  let service: TeamsService;
  let httpTestingController: HttpTestingController;
  
  const mockSport: Sport = {
    id: '1',
    name: 'Fútbol',
    category: 'Deportes de Equipo',
    defaultMaxPlayers: 25
  };

  const mockTeam: Team = {
    id: '1',
    name: 'Real Madrid',
    sport: mockSport,
    category: 'Sub-16',
    gender: 'Masculino',
    level: 'A',
    description: 'Equipo juvenil',
    maxPlayers: 20,
    status: TeamStatus.Active,
    playersCount: 15,
    coachesCount: 2,
    totalMembersCount: 17,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeamsService]
    });
    service = TestBed.inject(TeamsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTeams', () => {
    it('should fetch teams with default parameters', () => {
      const mockResponse: TeamsListResponse = {
        teams: [mockTeam],
        totalCount: 1,
        page: 1
      };

      service.getTeams().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.loading()).toBe(false);
        expect(service.error()).toBe(null);
      });

      const req = httpTestingController.expectOne('/api/teams?page=1&pageSize=10');
      expect(req.request.method).toBe('GET');
      
      // Mock response with headers
      req.flush([mockTeam], {
        headers: {
          'X-Total-Count': '1',
          'X-Page-Number': '1'
        }
      });
    });

    it('should handle errors', () => {
      service.getTeams().subscribe({
        error: () => {
          expect(service.loading()).toBe(false);
          expect(service.error()).toBeTruthy();
        }
      });

      const req = httpTestingController.expectOne('/api/teams?page=1&pageSize=10');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('createTeam', () => {
    it('should create a team', () => {
      const createRequest: CreateTeamRequest = {
        name: 'Barcelona',
        sportId: '1',
        category: 'Sub-18',
        gender: 'Masculino',
        level: 'A',
        description: 'Nuevo equipo',
        maxPlayers: 22
      };

      service.createTeam(createRequest).subscribe(team => {
        expect(team).toEqual(mockTeam);
      });

      const req = httpTestingController.expectOne('/api/teams');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(mockTeam);
    });
  });

  describe('error handling', () => {
    it('should clear error state', () => {
      service.clearError();
      expect(service.error()).toBe(null);
    });
  });
});