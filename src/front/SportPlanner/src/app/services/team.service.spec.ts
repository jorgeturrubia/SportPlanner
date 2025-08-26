import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeamService } from './team.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';
import { ErrorHandlerService } from './error-handler.service';
import { Team, CreateTeamRequest, UpdateTeamRequest, Gender, TeamLevel } from '../models/team.model';
import { environment } from '../../environments/environment';

describe('TeamService', () => {
  let service: TeamService;
  let httpMock: HttpTestingController;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let errorHandlerService: jasmine.SpyObj<ErrorHandlerService>;

  const mockTeam: Team = {
    id: '1',
    name: 'Test Team',
    description: 'Test Description',
    sport: 'Football',
    category: 'Senior',
    gender: Gender.MALE,
    level: TeamLevel.A,
    organizationId: 'org1',
    createdBy: 'user1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
    isVisible: true,
    memberCount: 15
  };

  const mockCreateRequest: CreateTeamRequest = {
    name: 'New Team',
    sport: 'Basketball',
    category: 'Junior',
    gender: Gender.FEMALE,
    level: TeamLevel.B,
    description: 'New team description'
  };

  beforeEach(() => {
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
    const errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', ['handleHttpError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TeamService,
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy }
      ]
    });

    service = TestBed.inject(TeamService);
    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    errorHandlerService = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getTeams', () => {
    it('should fetch teams successfully', () => {
      const mockTeams = [mockTeam];

      service.getTeams().subscribe(teams => {
        expect(teams).toEqual(mockTeams);
        expect(teams[0].createdAt).toBeInstanceOf(Date);
        expect(teams[0].updatedAt).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/teams`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTeams);

      expect(loadingService.show).toHaveBeenCalled();
      expect(loadingService.hide).toHaveBeenCalled();
    });

    it('should use cache when available and not expired', () => {
      const mockTeams = [mockTeam];

      // First call - should make HTTP request
      service.getTeams().subscribe();
      const req1 = httpMock.expectOne(`${environment.apiUrl}/api/teams`);
      req1.flush(mockTeams);

      // Second call within cache duration - should not make HTTP request
      service.getTeams().subscribe(teams => {
        expect(teams).toEqual(mockTeams);
      });

      httpMock.expectNone(`${environment.apiUrl}/api/teams`);
    });

    it('should force refresh when requested', () => {
      const mockTeams = [mockTeam];

      // First call
      service.getTeams().subscribe();
      const req1 = httpMock.expectOne(`${environment.apiUrl}/api/teams`);
      req1.flush(mockTeams);

      // Force refresh - should make new HTTP request
      service.getTeams(true).subscribe();
      const req2 = httpMock.expectOne(`${environment.apiUrl}/api/teams`);
      req2.flush(mockTeams);
    });

    it('should handle errors', () => {
      service.getTeams().subscribe({
        error: (error) => {
          expect(error).toBeDefined();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/teams`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(errorHandlerService.handleHttpError).toHaveBeenCalled();
    });
  });

  describe('getTeam', () => {
    it('should fetch a specific team', () => {
      const teamId = '1';

      service.getTeam(teamId).subscribe(team => {
        expect(team).toEqual(mockTeam);
        expect(team.createdAt).toBeInstanceOf(Date);
        expect(team.updatedAt).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/teams/${teamId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTeam);
    });
  });

  describe('createTeam', () => {
    it('should create a team successfully', () => {
      service.createTeam(mockCreateRequest).subscribe(team => {
        expect(team).toEqual(mockTeam);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/teams`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockTeam);

      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Equipo creado',
        `El equipo "${mockTeam.name}" ha sido creado exitosamente`
      );
    });

    it('should handle creation errors', () => {
      service.createTeam(mockCreateRequest).subscribe({
        error: (error) => {
          expect(error).toBeDefined();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/teams`);
      req.flush('Error', { status: 409, statusText: 'Conflict' });

      expect(errorHandlerService.handleHttpError).toHaveBeenCalled();
    });
  });

  describe('updateTeam', () => {
    it('should update a team successfully', () => {
      const teamId = '1';
      const updateRequest: UpdateTeamRequest = { ...mockCreateRequest };

      service.updateTeam(teamId, updateRequest).subscribe(team => {
        expect(team).toEqual(mockTeam);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/teams/${teamId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateRequest);
      req.flush(mockTeam);

      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Equipo actualizado',
        `El equipo "${mockTeam.name}" ha sido actualizado exitosamente`
      );
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team successfully', () => {
      const teamId = '1';

      service.deleteTeam(teamId).subscribe(result => {
        expect(result).toBeUndefined();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/teams/${teamId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Equipo eliminado',
        'El equipo ha sido eliminado'
      );
    });
  });

  describe('searchTeams', () => {
    beforeEach(() => {
      // Setup cache with mock teams
      service.getTeams().subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/api/teams`);
      req.flush([mockTeam]);
    });

    it('should search teams by name', () => {
      const results = service.searchTeams('Test');
      expect(results).toEqual([mockTeam]);
    });

    it('should search teams by sport', () => {
      const results = service.searchTeams('Football');
      expect(results).toEqual([mockTeam]);
    });

    it('should return all teams for empty query', () => {
      const results = service.searchTeams('');
      expect(results).toEqual([mockTeam]);
    });

    it('should return empty array for no matches', () => {
      const results = service.searchTeams('NonExistent');
      expect(results).toEqual([]);
    });
  });

  describe('filterTeams', () => {
    beforeEach(() => {
      // Setup cache with mock teams
      service.getTeams().subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/api/teams`);
      req.flush([mockTeam]);
    });

    it('should filter teams by sport', () => {
      const results = service.filterTeams({ sport: 'Football' });
      expect(results).toEqual([mockTeam]);
    });

    it('should filter teams by multiple criteria', () => {
      const results = service.filterTeams({ 
        sport: 'Football', 
        gender: Gender.MALE,
        isActive: true 
      });
      expect(results).toEqual([mockTeam]);
    });

    it('should return empty array when no teams match criteria', () => {
      const results = service.filterTeams({ sport: 'Tennis' });
      expect(results).toEqual([]);
    });
  });

  describe('getTeamStats', () => {
    beforeEach(() => {
      const mockTeams = [
        mockTeam,
        { ...mockTeam, id: '2', sport: 'Basketball', level: TeamLevel.B, isActive: false }
      ];
      
      service.getTeams().subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/api/teams`);
      req.flush(mockTeams);
    });

    it('should calculate team statistics correctly', () => {
      const stats = service.getTeamStats();
      
      expect(stats.total).toBe(2);
      expect(stats.active).toBe(1);
      expect(stats.inactive).toBe(1);
      expect(stats.bySport['Football']).toBe(1);
      expect(stats.bySport['Basketball']).toBe(1);
      expect(stats.byLevel[TeamLevel.A]).toBe(1);
      expect(stats.byLevel[TeamLevel.B]).toBe(1);
    });
  });

  describe('optimistic updates', () => {
    beforeEach(() => {
      service.getTeams().subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/api/teams`);
      req.flush([mockTeam]);
    });

    it('should perform optimistic update', () => {
      const updates = { name: 'Updated Team' };
      
      service.optimisticUpdate('1', updates);
      
      service.getTeamsObservable().subscribe(teams => {
        expect(teams[0].name).toBe('Updated Team');
      });
    });

    it('should revert optimistic update', () => {
      const updates = { name: 'Updated Team' };
      
      service.optimisticUpdate('1', updates);
      service.revertOptimisticUpdate(mockTeam);
      
      service.getTeamsObservable().subscribe(teams => {
        expect(teams[0].name).toBe('Test Team');
      });
    });
  });
});