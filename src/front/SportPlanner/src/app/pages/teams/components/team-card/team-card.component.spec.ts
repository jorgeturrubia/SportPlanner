import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUsers, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';

import { TeamCardComponent } from './team-card.component';
import { Team } from '../../../../core/models/team.interface';

describe('TeamCardComponent', () => {
  let component: TeamCardComponent;
  let fixture: ComponentFixture<TeamCardComponent>;
  let compiled: HTMLElement;

  const mockTeam: Team = {
    id: '1',
    name: 'Equipo Test',
    sport: 'Fútbol',
    category: 'Senior',
    playersCount: 15,
    description: 'Descripción del equipo de prueba',
    membersCount: 15,
    coachName: 'Juan Pérez',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamCardComponent, NgIconComponent],
      providers: [
        provideIcons({
          heroUsers,
          heroPencilSquare,
          heroTrash
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamCardComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.team()).toBeNull();
      expect(component.showActions()).toBe(true);
    });

    it('should accept team input', () => {
      fixture.componentRef.setInput('team', mockTeam);
      fixture.detectChanges();

      expect(component.team()).toEqual(mockTeam);
    });

    it('should accept showActions input', () => {
      fixture.componentRef.setInput('showActions', false);
      fixture.detectChanges();

      expect(component.showActions()).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('team', mockTeam);
      fixture.detectChanges();
    });

    it('should display team name', () => {
      const nameElement = compiled.querySelector('[data-testid="team-name"]');
      expect(nameElement?.textContent?.trim()).toBe(mockTeam.name);
    });

    it('should display team sport', () => {
      const sportElement = compiled.querySelector('[data-testid="team-sport"]');
      expect(sportElement?.textContent?.trim()).toBe(mockTeam.sport);
    });

    it('should display team category', () => {
      const categoryElement = compiled.querySelector('[data-testid="team-category"]');
      expect(categoryElement?.textContent?.trim()).toBe(mockTeam.category);
    });

    it('should display team description when provided', () => {
      const descriptionElement = compiled.querySelector('[data-testid="team-description"]');
      expect(descriptionElement?.textContent?.trim()).toBe(mockTeam.description);
    });

    it('should display members count', () => {
      const membersElement = compiled.querySelector('[data-testid="team-members"]');
      expect(membersElement?.textContent).toContain(mockTeam.membersCount.toString());
    });

    it('should display coach name when provided', () => {
      const coachElement = compiled.querySelector('[data-testid="team-coach"]');
      expect(coachElement?.textContent).toContain(mockTeam.coachName);
    });

    it('should show active status badge when team is active', () => {
      const statusBadge = compiled.querySelector('[data-testid="team-status"]');
      expect(statusBadge).toBeTruthy();
      expect(statusBadge?.textContent?.trim()).toBe('Activo');
    });

    it('should show inactive status badge when team is not active', () => {
      const inactiveTeam = { ...mockTeam, status: 'inactive' };
      fixture.componentRef.setInput('team', inactiveTeam);
      fixture.detectChanges();

      const statusBadge = compiled.querySelector('[data-testid="team-status"]');
      expect(statusBadge?.textContent?.trim()).toBe('Inactivo');
    });

    it('should display action buttons when showActions is true', () => {
      fixture.componentRef.setInput('showActions', true);
      fixture.detectChanges();

      const editButton = compiled.querySelector('[data-testid="edit-button"]');
      const deleteButton = compiled.querySelector('[data-testid="delete-button"]');

      expect(editButton).toBeTruthy();
      expect(deleteButton).toBeTruthy();
    });

    it('should hide action buttons when showActions is false', () => {
      fixture.componentRef.setInput('showActions', false);
      fixture.detectChanges();

      const actionsContainer = compiled.querySelector('[data-testid="team-actions"]');
      expect(actionsContainer).toBeFalsy();
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('team', mockTeam);
      fixture.detectChanges();
    });

    it('should emit edit event when edit button is clicked', () => {
      spyOn(component.edit, 'emit');

      const editButton = compiled.querySelector('[data-testid="edit-button"]') as HTMLButtonElement;
      editButton.click();

      expect(component.edit.emit).toHaveBeenCalledWith(mockTeam);
    });

    it('should emit delete event when delete button is clicked', () => {
      spyOn(component.delete, 'emit');

      const deleteButton = compiled.querySelector('[data-testid="delete-button"]') as HTMLButtonElement;
      deleteButton.click();

      expect(component.delete.emit).toHaveBeenCalledWith(mockTeam);
    });

    it('should handle keyboard navigation on edit button', () => {
      spyOn(component.edit, 'emit');

      const editButton = compiled.querySelector('[data-testid="edit-button"]') as HTMLButtonElement;
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      editButton.dispatchEvent(enterEvent);

      expect(component.edit.emit).toHaveBeenCalledWith(mockTeam);
    });

    it('should handle keyboard navigation on delete button', () => {
      spyOn(component.delete, 'emit');

      const deleteButton = compiled.querySelector('[data-testid="delete-button"]') as HTMLButtonElement;
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      deleteButton.dispatchEvent(enterEvent);

      expect(component.delete.emit).toHaveBeenCalledWith(mockTeam);
    });
  });

  describe('Edge Cases', () => {
    it('should handle team without description', () => {
      const teamWithoutDescription = { ...mockTeam, description: undefined };
      fixture.componentRef.setInput('team', teamWithoutDescription);
      fixture.detectChanges();

      const descriptionElement = compiled.querySelector('[data-testid="team-description"]');
      expect(descriptionElement).toBeFalsy();
    });

    it('should handle team without coach', () => {
      const teamWithoutCoach = { ...mockTeam, coachName: undefined };
      fixture.componentRef.setInput('team', teamWithoutCoach);
      fixture.detectChanges();

      const coachElement = compiled.querySelector('[data-testid="team-coach"]');
      expect(coachElement?.textContent).toContain('Sin entrenador');
    });

    it('should handle zero members count', () => {
      const teamWithZeroMembers = { ...mockTeam, membersCount: 0 };
      fixture.componentRef.setInput('team', teamWithZeroMembers);
      fixture.detectChanges();

      const membersElement = compiled.querySelector('[data-testid="team-members"]');
      expect(membersElement?.textContent).toContain('0');
    });

    it('should not emit events when team is null', () => {
      fixture.componentRef.setInput('team', null);
      fixture.detectChanges();

      spyOn(component.edit, 'emit');
      spyOn(component.delete, 'emit');

      // Try to trigger events (buttons shouldn't exist)
      const editButton = compiled.querySelector('[data-testid="edit-button"]');
      const deleteButton = compiled.querySelector('[data-testid="delete-button"]');

      expect(editButton).toBeFalsy();
      expect(deleteButton).toBeFalsy();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('team', mockTeam);
      fixture.detectChanges();
    });

    it('should have proper ARIA labels on action buttons', () => {
      const editButton = compiled.querySelector('[data-testid="edit-button"]');
      const deleteButton = compiled.querySelector('[data-testid="delete-button"]');

      expect(editButton?.getAttribute('aria-label')).toContain('Editar equipo');
      expect(deleteButton?.getAttribute('aria-label')).toContain('Eliminar equipo');
    });

    it('should have proper role attributes', () => {
      const cardElement = compiled.querySelector('[data-testid="team-card"]');
      expect(cardElement?.getAttribute('role')).toBe('article');
    });

    it('should be keyboard accessible', () => {
      const editButton = compiled.querySelector('[data-testid="edit-button"]') as HTMLButtonElement;
      const deleteButton = compiled.querySelector('[data-testid="delete-button"]') as HTMLButtonElement;

      expect(editButton.tabIndex).toBe(0);
      expect(deleteButton.tabIndex).toBe(0);
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('team', mockTeam);
      fixture.detectChanges();
    });

    it('should have responsive classes', () => {
      const cardElement = compiled.querySelector('[data-testid="team-card"]');
      const classList = cardElement?.className;

      expect(classList).toContain('w-full');
      expect(classList).toContain('max-w');
    });

    it('should adapt button layout for mobile', () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      fixture.detectChanges();

      const actionsContainer = compiled.querySelector('[data-testid="team-actions"]');
      expect(actionsContainer?.className).toContain('flex');
    });
  });
});