import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
    @Input() sidebarCollapsed = false;
    @Output() toggleSidebar = new EventEmitter<void>();
}
