import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, LOCALE_ID, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { authInterceptor, authErrorInterceptor } from './interceptors/auth.interceptor';
import { debugInterceptor } from './interceptors/debug.interceptor';
import { supabaseErrorInterceptor } from './interceptors/supabase-error.interceptor';
import { GlobalErrorHandler } from './services/error-handler.service';
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
  heroServerStack,
  heroEllipsisVertical,
  heroClock,
  heroArrowTrendingUp,
  heroWrenchScrewdriver
} from '@ng-icons/heroicons/outline';
import {
  heroCheckCircleSolid,
  heroExclamationTriangleSolid,
  heroInformationCircleSolid,
  heroXCircleSolid,
  heroXMarkSolid
} from '@ng-icons/heroicons/solid';

// Register Spanish locale
registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, debugInterceptor, authErrorInterceptor, supabaseErrorInterceptor])),
    provideClientHydration(withEventReplay()),
    // Locale configuration
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
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
      heroServerStack,
      heroEllipsisVertical,
      heroClock,
      heroArrowTrendingUp,
      heroWrenchScrewdriver,
      heroCheckCircleSolid,
      heroExclamationTriangleSolid,
      heroInformationCircleSolid,
      heroXCircleSolid,
      heroXMarkSolid
    }),
  ]
};
