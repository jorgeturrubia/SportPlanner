import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { TeamsPageComponent } from './teams-page.component';
import { TeamsService } from '../../core/services/teams.service';
import { Team, TeamsListResponse, Sport, TeamStatus, TeamMemberRole, TeamMemberStatus } from '../../core/models/team.interface';

describe('TeamsPageComponent', () => {
  let component: TeamsPageComponent;
  let fixture: ComponentFixture<TeamsPageComponent>;
  let mockTeamsService: jasmine.SpyObj<TeamsService>;

  const mockSport: Sport = {
    id: '1',
    name: 'Fútbol',
    category: 'Deportes de Equipo',
    defaultMaxPlayers: 25
  };

  const mockTeams: Team[] = [
    {
      id: '1',
      name: 'Real Madrid',
      sport: mockSport,
      category: 'Profesional',
      gender: 'Masculino',
      level: 'Profesional',
      playersCount: 25,
      coachesCount: 2,
      totalMembersCount: 27,
      maxPlayers: 25,
      status: TeamStatus.Active,
      description: 'Equipo profesional de fútbol',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      members: []
    },
    {
      id: '2',
      name: 'Barcelona FC',
      sport: mockSport,
      category: 'Profesional',
      gender: 'Masculino',
      level: 'Profesional',
      playersCount: 23,
      coachesCount: 2,
      totalMembersCount: 25,
      maxPlayers: 25,
      status: TeamStatus.Active,
      description: 'Equipo profesional de fútbol',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      members: []
    }
  ];

  const mockTeamsResponse: TeamsListResponse = {
    teams: mockTeams,
    totalCount: mockTeams.length,
    page: 1
  };

  beforeEach(async () => {
    mockTeamsService = jasmine.createSpyObj('TeamsService', [
      'getTeams',
      'createTeam',
      'updateTeam',
      'deleteTeam'
    ], {
      loading: jasmine.createSpy().and.returnValue(of(false)),
      error: jasmine.createSpy().and.returnValue(of(null))
    });

    await TestBed.configureTestingModule({
      imports: [
        TeamsPageComponent,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TeamsService, useValue: mockTeamsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamsPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with empty teams array', () => {
      expect(component.teams()).toEqual([]);
    });

    it('should have correct page title', () => {
      expect(component.pageTitle).toBe('Gestión de Equipos');
    });

    it('should initialize loading state as false', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should initialize error state as null', () => {
      expect(component.error()).toBe(null);
    });

    it('should initialize modal states as closed', () => {
      expect(component.showCreateModal()).toBe(false);
      expect(component.showEditModal()).toBe(false);
      expect(component.showDeleteModal()).toBe(false);
    });
  });

  describe('Teams Loading', () => {
    it('should load teams on init', () => {
      mockTeamsService.getTeams.and.returnValue(of(mockTeamsResponse));
      
      component.ngOnInit();
      
      expect(mockTeamsService.getTeams).toHaveBeenCalled();
      expect(component.teams()).toEqual(mockTeams);
    });

    it('should handle loading state during teams fetch', () => {
      mockTeamsService.getTeams.and.returnValue(of(mockTeamsResponse));
      
      component.loadTeams();
      
      expect(mockTeamsService.getTeams).toHaveBeenCalled();
    });

    it('should handle error when loading teams fails', () => {
      const errorMessage = 'Error loading teams';
      mockTeamsService.getTeams.and.returnValue(throwError(() => new Error(errorMessage)));
      
      component.loadTeams();
      
      expect(component.error()).toBe(errorMessage);
    });
  });

  describe('Modal Management', () => {
    it('should open create modal', () => {
      component.openCreateModal();
      
      expect(component.showCreateModal()).toBe(true);
      expect(component.selectedTeam()).toBe(null);
    });

    it('should open edit modal with selected team', () => {
      const team = mockTeams[0];
      
      component.openEditModal(team);
      
      expect(component.showEditModal()).toBe(true);
      expect(component.selectedTeam()).toBe(team);
    });

    it('should open delete modal with selected team', () => {
      const team = mockTeams[0];
      
      component.openDeleteModal(team);
      
      expect(component.showDeleteModal()).toBe(true);
      expect(component.selectedTeam()).toBe(team);
    });

    it('should close all modals', () => {
      component.openCreateModal();
      component.closeModals();
      
      expect(component.showCreateModal()).toBe(false);
      expect(component.showEditModal()).toBe(false);
      expect(component.showDeleteModal()).toBe(false);
      expect(component.selectedTeam()).toBe(null);
    });
  });

  describe('Team Operations', () => {
    it('should handle team creation', () => {
      const newTeam = mockTeams[0];
      const createRequest = {
        name: newTeam.name,
        sportId: newTeam.sport.id,
        category: newTeam.category,
        gender: newTeam.gender,
        level: newTeam.level,
        description: newTeam.description,
        maxPlayers: newTeam.maxPlayers
      };
      const newTeamsResponse = { ...mockTeamsResponse, teams: [newTeam] };
      mockTeamsService.createTeam.and.returnValue(of(newTeam));
      mockTeamsService.getTeams.and.returnValue(of(newTeamsResponse));
      
      component.onTeamCreated(createRequest);
      
      expect(mockTeamsService.createTeam).toHaveBeenCalledWith(createRequest);
      expect(component.showCreateModal()).toBe(false);
    });

    it('should handle team update', () => {
      const updatedTeam = { ...mockTeams[0], name: 'Updated Team' };
      const updateRequest = { name: 'Updated Team' };
      const updatedTeamsResponse = { ...mockTeamsResponse, teams: [updatedTeam] };
      mockTeamsService.updateTeam.and.returnValue(of(updatedTeam));
      mockTeamsService.getTeams.and.returnValue(of(updatedTeamsResponse));
      component.selectedTeam.set(mockTeams[0]);
      
      component.onTeamUpdated(updateRequest);
      
      expect(mockTeamsService.updateTeam).toHaveBeenCalledWith(mockTeams[0].id, updateRequest);
      expect(component.showEditModal()).toBe(false);
    });

    it('should handle team deletion', () => {
      const teamToDelete = mockTeams[0];
      const emptyTeamsResponse = { ...mockTeamsResponse, teams: [], totalCount: 0 };
      mockTeamsService.deleteTeam.and.returnValue(of(void 0));
      mockTeamsService.getTeams.and.returnValue(of(emptyTeamsResponse));
      component.selectedTeam.set(teamToDelete);
      
      component.onTeamDeleted();
      
      expect(mockTeamsService.deleteTeam).toHaveBeenCalledWith(teamToDelete.id);
      expect(component.showDeleteModal()).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      mockTeamsService.getTeams.and.returnValue(of(mockTeamsResponse));
      component.teams.set(mockTeams);
      fixture.detectChanges();
    });

    it('should display page title', () => {
      const titleElement = fixture.debugElement.query(By.css('h1'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('Gestión de Equipos');
    });

    it('should display create team button', () => {
      const createButton = fixture.debugElement.query(By.css('[data-testid="create-team-btn"]'));
      expect(createButton).toBeTruthy();
    });

    it('should display teams grid when teams exist', () => {
      const teamsGrid = fixture.debugElement.query(By.css('[data-testid="teams-grid"]'));
      expect(teamsGrid).toBeTruthy();
    });

    it('should display team cards for each team', () => {
      const teamCards = fixture.debugElement.queryAll(By.css('app-team-card'));
      expect(teamCards.length).toBe(mockTeams.length);
    });

    it('should display empty state when no teams exist', () => {
      component.teams.set([]);
      fixture.detectChanges();
      
      const emptyState = fixture.debugElement.query(By.css('[data-testid="empty-state"]'));
      expect(emptyState).toBeTruthy();
    });

    it('should display loading state when loading', () => {
      component.isLoading.set(true);
      fixture.detectChanges();
      
      const loadingState = fixture.debugElement.query(By.css('[data-testid="loading-state"]'));
      expect(loadingState).toBeTruthy();
    });

    it('should display error message when error exists', () => {
      const errorMessage = 'Test error';
      component.error.set(errorMessage);
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('[data-testid="error-message"]'));
      expect(errorElement.nativeElement.textContent).toContain(errorMessage);
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle mobile layout', () => {
      // Test mobile-specific behavior
      component.teams.set(mockTeams);
      fixture.detectChanges();
      
      const teamsGrid = fixture.debugElement.query(By.css('[data-testid="teams-grid"]'));
      expect(teamsGrid.nativeElement.classList).toContain('grid-cols-1');
    });
  });
});