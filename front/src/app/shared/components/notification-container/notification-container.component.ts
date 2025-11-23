import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationService } from '../../../services/notification.service';
import { Notification, NotificationType } from '../../../core/models/notification.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-notification-container',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notification-container.component.html',
    styleUrls: ['./notification-container.component.css'],
    animations: [
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class NotificationContainerComponent implements OnInit {
    notifications$!: Observable<Notification[]>;
    NotificationType = NotificationType;

    constructor(
        private notificationService: NotificationService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        this.notifications$ = this.notificationService.getNotifications();
    }

    dismiss(id: string): void {
        this.notificationService.dismiss(id);
    }

    dismissAll(): void {
        this.notificationService.dismissAll();
    }

    getIcon(type: NotificationType): SafeHtml {
        switch (type) {
            case NotificationType.SUCCESS:
                return this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`);
            case NotificationType.ERROR:
                return this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`);
            case NotificationType.WARNING:
                return this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`);
            case NotificationType.INFO:
                return this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`);
            default:
                return '';
        }
    }

    executeAction(notification: Notification): void {
        if (notification.action) {
            notification.action.callback();
            this.dismiss(notification.id);
        }
    }

    trackByFn(index: number, notification: Notification): string {
        return notification.id;
    }
}
