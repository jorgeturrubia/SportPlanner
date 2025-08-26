import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgIcon } from '@ng-icons/core';
import { TeamCardComponent } from './team-card.component';
import { Team, Gender, TeamLevel } from '../../models/team.model';

describe('TeamCardComponent', () => {
  let component: TeamCardComponent;
  let fixture: ComponentFixture<TeamCardComponent>;

  const mockTeam: Team = {
    id: '1',
    name: 'Test Team',
    description: 'This is a test team description',
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamCardComponent, NgIcon]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamCardComponent);
    component = fixture.componentInstance;
    component.team = mockTeam;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display team information correctly', () => {
    const compiled = fixture.nativeElement;
    
    expect(compiled.textContent).toContain('Test Team');
    expect(compiled.textContent).toContain('Football • Senior');
    expect(compiled.textContent).toContain('This is a test team description');
    expect(compiled.textContent).toContain('Masculino');
    expect(compiled.textContent).toContain('Nivel A');
    expect(compiled.textContent).toContain('15 miembros');
  });

  it('should show active status for active teams', () => {
    const statusElement = fixture.debugElement.query(By.css('.bg-success-100'));
    expect(statusElement).toBeTruthy();
    expect(statusElement.nativeElement.textContent.trim()).toContain('Activo');
  });

  it('should show inactive status for inactive teams', () => {
    component.team = { ...mockTeam, isActive: false };
    fixture.detectChanges();

    const statusElement = fixture.debugElement.query(By.css('.bg-secondary-100'));
    expect(statusElement).toBeTruthy();
    expect(statusElement.nativeElement.textContent.trim()).toContain('Inactivo');
  });

  it('should emit view event when view button is clicked', () => {
    spyOn(component.view, 'emit');
    
    const viewButton = fixture.debugElement.query(By.css('button[aria-label*="Ver detalles"]'));
    viewButton.nativeElement.click();
    
    expect(component.view.emit).toHaveBeenCalledWith(mockTeam);
  });

  it('should emit edit event when edit button is clicked', () => {
    spyOn(component.edit, 'emit');
    
    const editButton = fixture.debugElement.query(By.css('button[aria-label*="Editar"]'));
    editButton.nativeElement.click();
    
    expect(component.edit.emit).toHaveBeenCalledWith(mockTeam);
  });

  it('should emit delete event when delete button is clicked', () => {
    spyOn(component.delete, 'emit');
    
    const deleteButton = fixture.debugElement.query(By.css('button[aria-label*="Eliminar"]'));
    deleteButton.nativeElement.click();
    
    expect(component.delete.emit).toHaveBeenCalledWith(mockTeam);
  });

  describe('getGenderLabel', () => {
    it('should return correct gender labels', () => {
      expect(component.getGenderLabel(Gender.MALE)).toBe('Masculino');
      expect(component.getGenderLabel(Gender.FEMALE)).toBe('Femenino');
      expect(component.getGenderLabel(Gender.MIXED)).toBe('Mixto');
    });
  });

  describe('getLevelLabel', () => {
    it('should return correct level labels', () => {
      expect(component.getLevelLabel(TeamLevel.A)).toBe('Avanzado');
      expect(component.getLevelLabel(TeamLevel.B)).toBe('Intermedio');
      expect(component.getLevelLabel(TeamLevel.C)).toBe('Principiante');
    });
  });

  describe('formatDate', () => {
    it('should format recent dates correctly', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(component.formatDate(yesterday)).toBe('ayer');
    });

    it('should format dates within a week correctly', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      expect(component.formatDate(threeDaysAgo)).toBe('hace 3 días');
    });

    it('should format older dates correctly', () => {
      const oldDate = new Date('2023-01-01');
      const result = component.formatDate(oldDate);
      
      expect(result).toMatch(/\d{1,2} \w{3} \d{4}/); // Format like "1 ene 2023"
    });
  });

  it('should handle team without description', () => {
    component.team = { ...mockTeam, description: undefined };
    fixture.detectChanges();
    
    const descriptionElement = fixture.debugElement.query(By.css('.line-clamp-2'));
    expect(descriptionElement).toBeFalsy();
  });

  it('should handle team without member count', () => {
    component.team = { ...mockTeam, memberCount: undefined };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).not.toContain('miembros');
  });

  it('should display singular member text for one member', () => {
    component.team = { ...mockTeam, memberCount: 1 };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('1 miembro');
  });
});