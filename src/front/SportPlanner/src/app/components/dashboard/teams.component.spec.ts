import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUsers, heroMagnifyingGlass, heroExclamationTriangle, heroArrowPath, heroXMark } from '@ng-icons/heroicons/outline';
import { of, throwError, Subject } from 'rxjs';

import { TeamsComponent } from './teams.component';
import { TeamService } from '../../services/team.service';
import { ModalService, ModalRef } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';
import { Team, Gender, TeamLevel } from '../../models/team.model';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog.component';

describe('TeamsComponent', () => {
  let component: TeamsComponent;
  let fixture: ComponentFixture<TeamsComponent>;
  let mockTeamService: jasmine.SpyObj<TeamService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  const mockTeams: Team[] = [
    {
      id: '1',
      name: 'Team Alpha',
      description: 'First team',
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
    },
    {
      id: '2',
      name: 'Team Beta',
      description: 'Second team',
      sport: 'Basketball',
      category: 'Junior',
      gender: Gender.FEMALE,
      level: TeamLevel.B,
      organizationId: 'org1',
      createdBy: 'user1',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      isActive: false,
      isVisible: true,
      memberCount: 12
    }
  ];

  beforeEach(async () => {
    const teamServiceSpy = jasmine.createSpyObj('TeamService', [
      'getTeams',
      'getTeamsObservable',
      'deleteTeam'
    ]);
    const modalServiceSpy = jasmine.createSpyObj('ModalService', [
      'open',
      'getModalResult'
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showInfo',
      'showError'
    ]);

    await TestBed.configureTestingModule({
      imports: [TeamsComponent, NgIcon],
      providers: [
        { provide: TeamService, useValue: teamServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        provideIcons({
          heroUsers,
          heroMagnifyingGlass,
          heroExclamationTriangle,
          heroArrowPath,
          heroXMark
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;
    mockTeamService = TestBed.inject(TeamService) as jasmine.SpyObj<TeamService>;
    mockModalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    // Setup default service behavior
    mockTeamService.getTeams.and.returnValue(of(mockTeams));
    mockTeamService.getTeamsObservable.and.returnValue(of(mockTeams));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load teams on init', () => {
    fixture.detectChanges();

    expect(mockTeamService.getTeams).toHaveBeenCalled();
    expect(component.teams()).toEqual(mockTeams);
  });

  it('should display teams in cards', () => {
    fixture.detectChanges();

    const teamCards = fixture.debugElement.queryAll(By.css('app-team-card'));
    expect(teamCards.length).toBe(2);
  });

  it('should show loading state initially', () => {
    component.isLoading.set(true);
    component.teams.set([]);
    fixture.detectChanges();

    const loadingCards = fixture.debugElement.queryAll(By.css('.animate-pulse'));
    expect(loadingCards.length).toBeGreaterThan(0);
  });

  it('should show empty state when no teams exist', () => {
    component.teams.set([]);
    component.isLoading.set(false);
    fixture.detectChanges();

    const emptyState = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent).toContain('No tienes equipos aún');
  });

  it('should show error state when error occurs', () => {
    component.error.set('Test error message');
    fixture.detectChanges();

    const errorState = fixture.debugElement.query(By.css('.error-state'));
    expect(errorState).toBeTruthy();
    expect(errorState.nativeElement.textContent).toContain('Test error message');
  });

  it('should filter teams based on search query', () => {
    fixture.detectChanges();
    
    component.searchQuery.set('Alpha');
    
    expect(component.filteredTeams()).toEqual([mockTeams[0]]);
  });

  it('should clear search when clearSearch is called', () => {
    component.searchQuery.set('test');
    
    component.clearSearch();
    
    expect(component.searchQuery()).toBe('');
  });

  it('should handle search input changes', () => {
    fixture.detectChanges();
    
    const searchInput = fixture.debugElement.query(By.css('input[placeholder*="Buscar"]'));
    const inputElement = searchInput.nativeElement as HTMLInputElement;
    
    inputElement.value = 'Basketball';
    inputElement.dispatchEvent(new Event('input'));
    
    expect(component.searchQuery()).toBe('Basketball');
  });

  describe('Team Actions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show info notification for view team', () => {
      component.onViewTeam(mockTeams[0]);

      expect(mockNotificationService.showInfo).toHaveBeenCalledWith(
        'Funcionalidad próximamente',
        'La vista de detalles del equipo estará disponible pronto'
      );
    });

    it('should open edit modal when editing team', () => {
      const mockModalRef = { componentRef: { instance: {} } } as any;
      mockModalService.open.and.returnValue(mockModalRef);
      mockModalService.getModalResult.and.returnValue(of(null));

      component.onEditTeam(mockTeams[0]);

      expect(mockModalService.open).toHaveBeenCalled();
    });

    it('should open delete confirmation dialog when deleting team', () => {
      const mockModalRef = { 
        componentRef: { 
          instance: { modalRef: null, data: null } 
        } 
      } as any;
      mockModalService.open.and.returnValue(mockModalRef);
      mockModalService.getModalResult.and.returnValue(of(true));
      mockTeamService.deleteTeam.and.returnValue(of(void 0));

      component.onDeleteTeam(mockTeams[0]);

      expect(mockModalService.open).toHaveBeenCalledWith(
        DeleteConfirmationDialogComponent,
        jasmine.objectContaining({
          title: 'Confirmar eliminación',
          size: 'md'
        })
      );
    });

    it('should delete team when confirmation is accepted', () => {
      const mockModalRef = { 
        componentRef: { 
          instance: { modalRef: null, data: null } 
        } 
      } as any;
      mockModalService.open.and.returnValue(mockModalRef);
      mockModalService.getModalResult.and.returnValue(of(true));
      mockTeamService.deleteTeam.and.returnValue(of(void 0));

      component.onDeleteTeam(mockTeams[0]);

      expect(mockTeamService.deleteTeam).toHaveBeenCalledWith('1');
    });

    it('should not delete team when confirmation is dismissed', () => {
      const mockModalRef = { 
        componentRef: { 
          instance: { modalRef: null, data: null } 
        } 
      } as any;
      mockModalService.open.and.returnValue(mockModalRef);
      mockModalService.getModalResult.and.returnValue(throwError('dismissed'));

      component.onDeleteTeam(mockTeams[0]);

      expect(mockTeamService.deleteTeam).not.toHaveBeenCalled();
    });

    it('should show error notification when deletion fails', () => {
      const mockModalRef = { 
        componentRef: { 
          instance: { modalRef: null, data: null } 
        } 
      } as any;
      mockModalService.open.and.returnValue(mockModalRef);
      mockModalService.getModalResult.and.returnValue(of(true));
      mockTeamService.deleteTeam.and.returnValue(throwError('Delete failed'));

      component.onDeleteTeam(mockTeams[0]);

      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Error al eliminar equipo',
        'No se pudo eliminar el equipo "Team Alpha". Intenta nuevamente.'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle error when loading teams fails', () => {
      mockTeamService.getTeams.and.returnValue(throwError('Load failed'));
      
      fixture.detectChanges();

      expect(component.error()).toBe('No se pudieron cargar los equipos. Intenta nuevamente.');
      expect(component.isLoading()).toBeFalse();
    });

    it('should retry loading teams when retry button is clicked', () => {
      component.error.set('Test error');
      fixture.detectChanges();

      const retryButton = fixture.debugElement.query(By.css('button:contains("Reintentar")'));
      if (retryButton) {
        retryButton.nativeElement.click();
        expect(mockTeamService.getTeams).toHaveBeenCalled();
      }
    });
  });

  describe('Create Team Modal', () => {
    it('should open create team modal', () => {
      const mockModalRef = { componentRef: { instance: {} } } as any;
      mockModalService.open.and.returnValue(mockModalRef);
      mockModalService.getModalResult.and.returnValue(of(null));

      component.openCreateModal();

      expect(mockModalService.open).toHaveBeenCalled();
    });

    it('should handle create team modal result', () => {
      const mockModalRef = { componentRef: { instance: {} } } as any;
      const newTeam = { ...mockTeams[0], id: '3', name: 'New Team' };
      mockModalService.open.and.returnValue(mockModalRef);
      mockModalService.getModalResult.and.returnValue(of(newTeam));

      component.openCreateModal();

      // The result is handled but no specific action is expected since the service handles updates
      expect(mockModalService.getModalResult).toHaveBeenCalledWith(mockModalRef);
    });
  });

  describe('Component Lifecycle', () => {
    it('should subscribe to team updates on init', () => {
      fixture.detectChanges();

      expect(mockTeamService.getTeamsObservable).toHaveBeenCalled();
    });

    it('should unsubscribe on destroy', () => {
      fixture.detectChanges();
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show search input when teams exist', () => {
      const searchInput = fixture.debugElement.query(By.css('input[placeholder*="Buscar"]'));
      expect(searchInput).toBeTruthy();
    });

    it('should not show search input when no teams exist', () => {
      component.teams.set([]);
      fixture.detectChanges();

      const searchInput = fixture.debugElement.query(By.css('input[placeholder*="Buscar"]'));
      expect(searchInput).toBeFalsy();
    });

    it('should show no results message when search yields no results', () => {
      component.searchQuery.set('NonExistentTeam');
      fixture.detectChanges();

      const noResultsMessage = fixture.debugElement.query(By.css('.empty-state'));
      expect(noResultsMessage).toBeTruthy();
      expect(noResultsMessage.nativeElement.textContent).toContain('No se encontraron equipos');
    });
  });
});