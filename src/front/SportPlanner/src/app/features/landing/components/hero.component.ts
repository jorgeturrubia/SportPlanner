import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Hero Content -->
          <div class="text-center lg:text-left">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Revoluciona tu
              <span class="text-blue-600">entrenamiento deportivo</span>
            </h1>
            <p class="mt-6 text-xl text-gray-600 leading-relaxed">
              La plataforma completa para atletas, entrenadores y equipos. 
              Gestiona planes de entrenamiento, analiza el rendimiento y 
              alcanza tus objetivos deportivos con tecnología avanzada.
            </p>
            
            <!-- CTA Buttons -->
            <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                type="button"
                class="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Comienza Gratis
              </button>
              <button
                type="button"
                (click)="scrollToDemo()"
                class="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Ver Demo
              </button>
            </div>

            <!-- Trust Indicators -->
            <div class="mt-12 flex flex-col sm:flex-row items-center gap-8">
              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  @for (avatar of avatars(); track $index) {
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center">
                      <span class="text-white text-xs font-semibold">{{ avatar }}</span>
                    </div>
                  }
                </div>
                <span class="text-sm text-gray-600 ml-2">+1,500 atletas activos</span>
              </div>
              
              <div class="flex items-center gap-1">
                @for (star of stars(); track $index) {
                  <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                }
                <span class="text-sm text-gray-600 ml-1">4.9/5 valoración</span>
              </div>
            </div>
          </div>

          <!-- Hero Image/Illustration -->
          <div class="relative">
            <div class="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 shadow-2xl">
              <!-- Sports Dashboard Mockup -->
              <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <!-- Dashboard Header -->
                <div class="bg-blue-600 text-white p-4">
                  <h3 class="font-semibold">Dashboard de Rendimiento</h3>
                </div>
                
                <!-- Dashboard Content -->
                <div class="p-6 space-y-4">
                  <!-- Metrics Cards -->
                  <div class="grid grid-cols-2 gap-4">
                    @for (metric of performanceMetrics(); track metric.label) {
                      <div class="bg-gray-50 rounded-lg p-4">
                        <div class="text-2xl font-bold text-blue-600">{{ metric.value }}</div>
                        <div class="text-sm text-gray-600">{{ metric.label }}</div>
                      </div>
                    }
                  </div>
                  
                  <!-- Progress Chart Mockup -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="text-sm font-medium text-gray-700 mb-2">Progreso Semanal</div>
                    <div class="flex items-end gap-2 h-12">
                      @for (bar of progressBars(); track $index) {
                        <div
                          class="bg-blue-500 rounded-t"
                          [style.height.%]="bar"
                          [style.width]="'20px'"
                        ></div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Floating Elements -->
            <div class="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
              </svg>
            </div>
            
            <div class="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HeroComponent {
  protected readonly avatars = signal(['A', 'M', 'J', 'L', 'S']);
  protected readonly stars = signal([1, 2, 3, 4, 5]);
  protected readonly performanceMetrics = signal([
    { value: '85%', label: 'Objetivo cumplido' },
    { value: '12.5', label: 'Velocidad avg (km/h)' },
    { value: '42', label: 'Sesiones completadas' },
    { value: '156', label: 'Puntos de rendimiento' }
  ]);
  protected readonly progressBars = signal([60, 80, 45, 90, 70, 85, 95]);

  protected scrollToDemo(): void {
    const element = document.getElementById('entrenamientos');
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }
}