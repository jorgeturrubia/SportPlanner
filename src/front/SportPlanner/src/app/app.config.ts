import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideIcons } from '@ng-icons/core';
import { 
  heroHome,
  heroUsers,
  heroCog6Tooth,
  heroArrowRightOnRectangle,
  heroUser,
  heroBars3,
  heroXMark,
  heroChevronDown,
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

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideClientHydration(withEventReplay()),
    provideIcons({
      heroHome,
      heroUsers,
      heroCog6Tooth,
      heroArrowRightOnRectangle,
      heroUser,
      heroBars3,
      heroXMark,
      heroChevronDown,
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
    // Global error handler
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    }  
  ]
};
