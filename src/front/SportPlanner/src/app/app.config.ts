import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor, authErrorInterceptor } from './interceptors/auth.interceptor';
import { provideIcons } from '@ng-icons/core';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { 
  heroHome,
  heroUsers,
  heroCog6Tooth,
  heroArrowRightOnRectangle,
  heroUser,
  heroBars3,
  heroXMark,
  heroChevronDown,
  heroChevronLeft,
  heroChevronRight,
  heroEye,
  heroEyeSlash,
  heroExclamationTriangle,
  heroCheckCircle,
  heroInformationCircle,
  heroAcademicCap,
  heroCalendarDays,
  heroPencil,
  heroTrash,
  heroArrowPath,
  heroMagnifyingGlass,
  heroLockClosed,
  heroKey,
  heroServerStack
} from '@ng-icons/heroicons/outline';
import {
  heroCheckCircleSolid,
  heroExclamationTriangleSolid,
  heroInformationCircleSolid,
  heroXCircleSolid,
  heroXMarkSolid
} from '@ng-icons/heroicons/solid';



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, authErrorInterceptor])),
    provideClientHydration(withEventReplay()),
    // Icons needed for navbar and notifications
    provideIcons({
      heroHome,
      heroUsers,
      heroCog6Tooth,
      heroArrowRightOnRectangle,
      heroUser,
      heroBars3,
      heroXMark,
      heroChevronDown,
      heroChevronLeft,
      heroChevronRight,
      heroEye,
      heroEyeSlash,
      heroExclamationTriangle,
      heroCheckCircle,
      heroInformationCircle,
      heroAcademicCap,
      heroCalendarDays,
      heroPencil,
      heroTrash,
      heroArrowPath,
      heroMagnifyingGlass,
      heroLockClosed,
      heroKey,
      heroServerStack
    }),
  ]
};
