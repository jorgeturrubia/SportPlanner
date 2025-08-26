import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { LoadingSpinnerComponent } from './loading-spinner.component';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    @if (loadingService.getLoadingSignal()()) {
      <app-loading-spinner 
        [overlay]="true" 
        message="Procesando solicitud...">
      </app-loading-spinner>
    }
  `
})
export class GlobalLoadingComponent {
  loadingService = inject(LoadingService);
}