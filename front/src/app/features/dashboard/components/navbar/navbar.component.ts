import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeasonSelectorComponent } from '../../../../components/season-selector/season-selector.component';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, SeasonSelectorComponent],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
    @Input() sidebarCollapsed = false;
    @Output() toggleSidebar = new EventEmitter<void>();
}
