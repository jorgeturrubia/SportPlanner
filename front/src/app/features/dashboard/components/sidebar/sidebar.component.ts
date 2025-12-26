import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
    @Input() collapsed = false;
    userName = signal<string>('');
    userEmail = signal<string>('');
    currentLang = signal<string>('es');
    coreMastersExpanded = signal<boolean>(false);
    planConfigExpanded = signal<boolean>(false);
    systemConfigExpanded = signal<boolean>(false);

    constructor(
        private authService: AuthService,
        private router: Router,
        public translate: TranslateService
    ) {
        translate.addLangs(['es', 'en']);
        translate.setDefaultLang('es');
        const browserLang = translate.getBrowserLang();
        const initialLang = browserLang?.match(/es|en/) ? browserLang : 'es';
        translate.use(initialLang);
        this.currentLang.set(initialLang);

        // Actualizar signal cuando cambia el idioma
        translate.onLangChange.subscribe(event => {
            this.currentLang.set(event.lang);
        });
    }

    async ngOnInit() {
        const user = await this.authService.getUser();
        if (user) {
            this.userName.set(user.user_metadata?.['name'] || 'Usuario');
            this.userEmail.set(user.email || '');
        }
    }

    switchLanguage(lang: string) {
        this.translate.use(lang);
    }

    async logout() {
        await this.authService.signOut();
        this.router.navigate(['/login']);
    }

    toggleCoreMasters() {
        this.coreMastersExpanded.set(!this.coreMastersExpanded());
    }

    togglePlanConfig() {
        this.planConfigExpanded.set(!this.planConfigExpanded());
    }

    toggleSystemConfig() {
        this.systemConfigExpanded.set(!this.systemConfigExpanded());
    }
}
