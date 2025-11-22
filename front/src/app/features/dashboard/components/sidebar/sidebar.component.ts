import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
    @Input() collapsed = false;
    userName = signal<string>('');
    userEmail = signal<string>('');

    constructor(private authService: AuthService) { }

    async ngOnInit() {
        const user = await this.authService.getUser();
        if (user) {
            this.userName.set(user.user_metadata?.['name'] || 'Usuario');
            this.userEmail.set(user.email || '');
        }
    }
}
