import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { of, throwError } from 'rxjs';

import { TeamModalComponent, TeamModalData } from './team-modal.component';
import { TeamService } from '../../services/team.service';
import { NotificationService } from '../../services/notification.service';
import { ModalRef } from '../../services/modal.service';
import { Team, Gender, TeamLevel } from '../../models/team.model';

describe('TeamModalComponent', () => {
  let component: TeamModalComponent;
  let fixture: ComponentFixture<TeamModalComponent>;
  let mockTeamService: jasmine.SpyObj<TeamService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockModalRef: jasmine.SpyObj<ModalRef>;

  const mockTeam: Team = {
    id: '1',
    name: 'Test Team',
    sport: 'basketball',
    category: 'senior',
    gender: Gender.MALE,
    level: TeamLevel.A,
    description: 'Test description',
    createdBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    isVisible: true,
    memberCount: 10
  };

  beforeEach(async () => {
    const teamServiceSpy = jasmine.createSpyObj('TeamService', ['createTeam', 'updateTeam']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
    const modalRefSpy = jasmine.createSpyObj('ModalRef', ['close', 'dismiss']);

    await TestBed.configureTestingModule({
      imports: [TeamModalComponent, ReactiveFormsModule, NgIcon],
      providers: [
        { provide: TeamService, useValue: teamServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        provideIcons({ heroXMark })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamModalComponent);
    component = fixture.componentInstance;
    mockTeamService = TestBed.inject(TeamService) as jasmine.SpyObj<TeamService>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    mockModalRef = modalRefSpy;

    component.modalRef = mockModalRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values for create mode', () => {
      component.data = { mode: 'create' };
      component.ngOnInit();

      expect(component.teamForm.get('name')?.value).toBe('');
      expect(component.teamForm.get('sport')?.value).toBe('');
      expect(component.teamForm.get('category')?.value).toBe('');
      expect(component.teamForm.get('gender')?.value).toBe('');
      expect(component.teamForm.get('level')?.value).toBe('');
      expect(component.teamForm.get('description')?.value).toBe('');
    });

    it('should initialize form with team values for edit mode', () => {
      component.data = { mode: 'edit', team: mockTeam };
      component.ngOnInit();

      expect(component.teamForm.get('name')?.value).toBe(mockTeam.name);
      expect(component.teamForm.get('sport')?.value).toBe(mockTeam.sport);
      expect(component.teamForm.get('category')?.value).toBe(mockTeam.category);
      expect(component.teamForm.get('gender')?.value).toBe(mockTeam.gender);
      expect(component.teamForm.get('level')?.value).toBe(mockTeam.level);
      expect(component.teamForm.get('description')?.value).toBe(mockTeam.description);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.data = { mode: 'create' };
      component.ngOnInit();
    });

    it('should require team name', () => {
      const nameControl = component.teamForm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      expect(nameControl?.invalid).toBeTruthy();
      expect(nameControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate team name length', () => {
      const nameControl = component.teamForm.get('name');
      
      // Test minimum length
      nameControl?.setValue('A');
      expect(nameControl?.errors?.['minlength']).toBeTruthy();

      // Test maximum length
      nameControl?.setValue('A'.repeat(51));
      expect(nameControl?.errors?.['maxlength']).toBeTruthy();

      // Test valid length
      nameControl?.setValue('Valid Team Name');
      expect(nameControl?.errors).toBeNull();
    });

    it('should require sport selection', () => {
      const sportControl = component.teamForm.get('sport');
      sportControl?.setValue('');
      sportControl?.markAsTouched();

      expect(sportControl?.invalid).toBeTruthy();
      expect(sportControl?.errors?.['required']).toBeTruthy();
    });

    it('should require category selection', () => {
      const categoryControl = component.teamForm.get('category');
      categoryControl?.setValue('');
      categoryControl?.markAsTouched();

      expect(categoryControl?.invalid).toBeTruthy();
      expect(categoryControl?.errors?.['required']).toBeTruthy();
    });

    it('should require gender selection', () => {
      const genderControl = component.teamForm.get('gender');
      genderControl?.setValue('');
      genderControl?.markAsTouched();

      expect(genderControl?.invalid).toBeTruthy();
      expect(genderControl?.errors?.['required']).toBeTruthy();
    });

    it('should require level selection', () => {
      const levelControl = component.teamForm.get('level');
      levelControl?.setValue('');
      levelControl?.markAsTouched();

      expect(levelControl?.invalid).toBeTruthy();
      expect(levelControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate description length', () => {
      const descriptionControl = component.teamForm.get('description');
      descriptionControl?.setValue('A'.repeat(501));

      expect(descriptionControl?.errors?.['maxlength']).toBeTruthy();
    });

    it('should be valid with all required fields filled', () => {
      component.teamForm.patchValue({
        name: 'Test Team',
        sport: 'basketball',
        category: 'senior',
        gender: Gender.MALE,
        level: TeamLevel.A,
        description: 'Test description'
      });

      expect(component.teamForm.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.data = { mode: 'create' };
      component.ngOnInit();
      
      // Fill form with valid data
      component.teamForm.patchValue({
        name: 'Test Team',
        sport: 'basketball',
        category: 'senior',
        gender: Gender.MALE,
        level: TeamLevel.A,
        description: 'Test description'
      });
    });

    it('should create team when in create mode', () => {
      mockTeamService.createTeam.and.returnValue(of(mockTeam));

      component.onSubmit();

      expect(mockTeamService.createTeam).toHaveBeenCalledWith({
        name: 'Test Team',
        sport: 'basketball',
        category: 'senior',
        gender: Gender.MALE,
        level: TeamLevel.A,
        description: 'Test description'
      });
      expect(mockNotificationService.showSuccess).toHaveBeenCalled();
      expect(mockModalRef.close).toHaveBeenCalledWith(mockTeam);
    });

    it('should update team when in edit mode', () => {
      component.data = { mode: 'edit', team: mockTeam };
      component.ngOnInit();
      
      component.teamForm.patchValue({
        name: 'Updated Team',
        sport: 'football',
        category: 'youth',
        gender: Gender.FEMALE,
        level: TeamLevel.B,
        description: 'Updated description'
      });

      const updatedTeam = { ...mockTeam, name: 'Updated Team' };
      mockTeamService.updateTeam.and.returnValue(of(updatedTeam));

      component.onSubmit();

      expect(mockTeamService.updateTeam).toHaveBeenCalledWith(mockTeam.id, {
        name: 'Updated Team',
        sport: 'football',
        category: 'youth',
        gender: Gender.FEMALE,
        level: TeamLevel.B,
        description: 'Updated description'
      });
      expect(mockNotificationService.showSuccess).toHaveBeenCalled();
      expect(mockModalRef.close).toHaveBeenCalledWith(updatedTeam);
    });

    it('should not submit if form is invalid', () => {
      component.teamForm.patchValue({
        name: '', // Invalid - required
        sport: 'basketball',
        category: 'senior',
        gender: Gender.MALE,
        level: TeamLevel.A
      });

      component.onSubmit();

      expect(mockTeamService.createTeam).not.toHaveBeenCalled();
      expect(mockTeamService.updateTeam).not.toHaveBeenCalled();
    });

    it('should handle create team error', () => {
      const error = { status: 409, error: { message: 'Team already exists' } };
      mockTeamService.createTeam.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Error al crear equipo',
        'Ya existe un equipo con ese nombre'
      );
    });

    it('should handle update team error', () => {
      component.data = { mode: 'edit', team: mockTeam };
      component.ngOnInit();
      
      const error = { status: 500 };
      mockTeamService.updateTeam.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Error al actualizar equipo',
        'Error del servidor. Intenta nuevamente más tarde'
      );
    });

    it('should set loading state during submission', () => {
      mockTeamService.createTeam.and.returnValue(of(mockTeam));

      expect(component.isSubmitting()).toBeFalsy();

      component.onSubmit();

      // Loading state should be set during submission
      expect(component.isSubmitting()).toBeTruthy();
    });
  });

  describe('Modal Actions', () => {
    beforeEach(() => {
      component.data = { mode: 'create' };
      component.ngOnInit();
    });

    it('should close modal with result', () => {
      const result = { test: 'data' };
      component.close(result);

      expect(mockModalRef.close).toHaveBeenCalledWith(result);
    });

    it('should dismiss modal with reason', () => {
      const reason = 'cancelled';
      component.dismiss(reason);

      expect(mockModalRef.dismiss).toHaveBeenCalledWith(reason);
    });
  });

  describe('Computed Properties', () => {
    it('should correctly identify edit mode', () => {
      component.data = { mode: 'edit', team: mockTeam };
      expect(component.isEditMode()).toBeTruthy();

      component.data = { mode: 'create' };
      expect(component.isEditMode()).toBeFalsy();
    });

    it('should return current team in edit mode', () => {
      component.data = { mode: 'edit', team: mockTeam };
      expect(component.currentTeam()).toBe(mockTeam);

      component.data = { mode: 'create' };
      expect(component.currentTeam()).toBeUndefined();
    });
  });

  describe('Field Validation Helper', () => {
    beforeEach(() => {
      component.data = { mode: 'create' };
      component.ngOnInit();
    });

    it('should return true for invalid touched field', () => {
      const nameControl = component.teamForm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      expect(component.isFieldInvalid('name')).toBeTruthy();
    });

    it('should return false for valid field', () => {
      const nameControl = component.teamForm.get('name');
      nameControl?.setValue('Valid Name');

      expect(component.isFieldInvalid('name')).toBeFalsy();
    });

    it('should return false for invalid untouched field', () => {
      const nameControl = component.teamForm.get('name');
      nameControl?.setValue('');
      // Don't mark as touched

      expect(component.isFieldInvalid('name')).toBeFalsy();
    });
  });
});