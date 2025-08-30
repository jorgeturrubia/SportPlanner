import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

console.log('🚀 Starting Angular application...');

bootstrapApplication(App, appConfig)
  .then(() => {
    console.log('✅ Angular application bootstrapped successfully');
  })
  .catch((err) => {
    console.error('❌ Error bootstrapping Angular application:', err);
  });
