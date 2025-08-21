import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../../core/models/team.interface';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})
export class TeamCardComponent {
  team = input.required<Team>();
  
  edit = output<Team>();
  delete = output<Team>();

  onEdit() {
    this.edit.emit(this.team());
  }

  onDelete() {
    this.delete.emit(this.team());
  }
}