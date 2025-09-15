/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes recent versions of Safari, Chrome (including
 * Opera), Edge on the desktop, and iOS and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */

// Patch Zone.js to handle NavigatorLockAcquireTimeoutError
(window as any).__zone_symbol__UNPATCHED_EVENTS = ['error', 'unhandledrejection'];

// Override Zone.js error handling before it's loaded
const originalConsoleError = console.error;
console.error = function(...args: any[]) {
  const message = args.join(' ');
  if (message.includes('NavigatorLockAcquireTimeoutError') || 
      message.includes('lock:sb-') ||
      args.some(arg => arg?.name === 'NavigatorLockAcquireTimeoutError')) {
    console.warn('⚠️ NavigatorLockAcquireTimeoutError suppressed:', message);
    return;
  }
  originalConsoleError.apply(console, args);
};

// Patch Zone.js onUnhandledError before Zone.js loads
(window as any).__zone_symbol__onUnhandledError = function(error: any) {
  if (error?.name === 'NavigatorLockAcquireTimeoutError' ||
      error?.message?.includes('NavigatorLockAcquireTimeoutError') ||
      error?.rejection?.name === 'NavigatorLockAcquireTimeoutError') {
    console.warn('⚠️ NavigatorLockAcquireTimeoutError suppressed at Zone.js level');
    return false; // Suppress the error
  }
  return true; // Let other errors through
};

// Additional global error suppression for NavigatorLockAcquireTimeoutError
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.name === 'NavigatorLockAcquireTimeoutError' ||
      event.reason?.message?.includes('NavigatorLockAcquireTimeoutError')) {
    console.warn('⚠️ NavigatorLockAcquireTimeoutError suppressed at window level:', event.reason?.message || event.reason);
    event.preventDefault(); // Prevent the error from being logged
    return;
  }
});

window.addEventListener('error', (event) => {
  if (event.error?.name === 'NavigatorLockAcquireTimeoutError' ||
      event.message?.includes('NavigatorLockAcquireTimeoutError')) {
    console.warn('⚠️ NavigatorLockAcquireTimeoutError suppressed at error level:', event.message || event.error);
    event.preventDefault();
    return;
  }
});

import 'zone.js';  // Included with Angular CLI.