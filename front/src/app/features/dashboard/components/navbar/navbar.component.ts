import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { SeasonSelectorComponent } from '../../../../components/season-selector/season-selector.component';
import { SupabaseService } from '../../../../services/supabase.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, SeasonSelectorComponent],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
    @Input() sidebarCollapsed = false;
    @Output() toggleSidebar = new EventEmitter<void>();

    private supabase = inject(SupabaseService);
    private user = toSignal(this.supabase.user$);

    public isAdmin = computed(() => {
        const user = this.user();
        const role = user?.app_metadata?.['role'];
        return role === 'AdminOwner';
    });
}
