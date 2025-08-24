import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TrainingFeature {
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="entrenamientos" class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Entrenamientos Inteligentes
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre cómo nuestras herramientas de entrenamiento avanzadas 
            transforman la manera en que planificas, ejecutas y mides tu progreso deportivo.
          </p>
        </div>

        <!-- Main Feature Showcase -->
        <div class="bg-white rounded-2xl shadow-xl p-8 lg:p-12 mb-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                IA que Aprende Contigo
              </h3>
              <p class="text-lg text-gray-600 mb-6">
                Nuestro sistema de inteligencia artificial analiza tu rendimiento, 
                patrones de entrenamiento y recuperación para crear planes personalizados 
                que evolucionan contigo.
              </p>
              <div class="space-y-4 mb-8">
                @for (aiFeature of aiFeatures(); track aiFeature) {
                  <div class="flex items-start gap-3">
                    <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <span class="text-gray-700">{{ aiFeature }}</span>
                  </div>
                }
              </div>
              <button
                type="button"
                class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Prueba la IA Gratis
              </button>
            </div>

            <!-- AI Dashboard Mockup -->
            <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6">
              <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <!-- AI Dashboard Header -->
                <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-semibold">Asistente IA</h4>
                      <p class="text-xs text-white/80">Analizando tu progreso...</p>
                    </div>
                  </div>
                </div>
                
                <!-- AI Recommendations -->
                <div class="p-4 space-y-3">
                  @for (recommendation of aiRecommendations(); track recommendation.title) {
                    <div class="bg-gray-50 rounded-lg p-3">
                      <div class="flex items-center gap-2 mb-1">
                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span class="text-sm font-medium text-gray-900">{{ recommendation.title }}</span>
                      </div>
                      <p class="text-xs text-gray-600">{{ recommendation.description }}</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Training Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          @for (feature of trainingFeatures(); track feature.title) {
            <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div class="inline-flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 rounded-xl mb-6">
                <div [innerHTML]="feature.icon"></div>
              </div>
              
              <h3 class="text-xl font-bold text-gray-900 mb-4">{{ feature.title }}</h3>
              <p class="text-gray-600 mb-6">{{ feature.description }}</p>
              
              <div class="space-y-2">
                @for (benefit of feature.benefits; track benefit) {
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm text-gray-700">{{ benefit }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Integration Banner -->
        <div class="mt-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-center">
          <h3 class="text-2xl font-bold text-white mb-4">
            Conecta con tus Dispositivos Favoritos
          </h3>
          <p class="text-green-100 mb-8 max-w-2xl mx-auto">
            Sincroniza automáticamente con más de 50 dispositivos y apps de fitness. 
            Desde relojes inteligentes hasta medidores de potencia.
          </p>
          
          <!-- Device Icons -->
          <div class="flex flex-wrap justify-center gap-6 mb-8">
            @for (device of connectedDevices(); track device.name) {
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center gap-2">
                <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div [innerHTML]="device.icon"></div>
                </div>
                <span class="text-xs text-white/90">{{ device.name }}</span>
              </div>
            }
          </div>
          
          <button
            type="button"
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Ver Todas las Integraciones
          </button>
        </div>
      </div>
    </section>
  `
})
export class FeaturesComponent {
  protected readonly aiFeatures = signal([
    'Análisis predictivo del rendimiento',
    'Ajuste automático de intensidad',
    'Detección de signos de sobreentrenamiento',
    'Recomendaciones de recuperación personalizadas',
    'Optimización de días de descanso'
  ]);

  protected readonly aiRecommendations = signal([
    {
      title: 'Aumentar intensidad',
      description: 'Tu cuerpo está preparado para el siguiente nivel'
    },
    {
      title: 'Descanso recomendado',
      description: 'Planifica 1 día de recuperación activa'
    },
    {
      title: 'Trabajar velocidad',
      description: 'Focus en sprints cortos esta semana'
    }
  ]);

  protected readonly trainingFeatures = signal<TrainingFeature[]>([
    {
      title: 'Planes Periodizados',
      description: 'Entrenamientos estructurados que siguen principios de periodización deportiva científicamente probados.',
      icon: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM6 7a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zM6 11a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zM6 15a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" /></svg>',
      benefits: [
        'Periodización por macrociclos',
        'Progresión automática de cargas',
        'Tapering inteligente pre-competencia',
        'Adaptación según tu calendario'
      ]
    },
    {
      title: 'Análisis Biomecánico',
      description: 'Tecnología avanzada para analizar tu técnica y optimizar cada movimiento.',
      icon: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      benefits: [
        'Análisis de video en cámara lenta',
        'Detección de errores técnicos',
        'Comparación con atletas élite',
        'Ejercicios correctivos personalizados'
      ]
    },
    {
      title: 'Seguimiento Nutricional',
      description: 'Planes nutricionales integrados que complementan tu entrenamiento físico.',
      icon: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd" /></svg>',
      benefits: [
        'Macros adaptados a tu deporte',
        'Timing de nutrientes pre/post entreno',
        'Recetas personalizadas',
        'Tracking de hidratación'
      ]
    },
    {
      title: 'Recovery & Wellness',
      description: 'Herramientas completas para optimizar tu recuperación y bienestar general.',
      icon: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414L10.414 14a1 1 0 01-1.414 0l-3.293-3.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',
      benefits: [
        'Monitoreo de sueño integrado',
        'Escalas de percepción de esfuerzo',
        'Protocolos de recuperación activa',
        'Métricas de variabilidad cardíaca'
      ]
    }
  ]);

  protected readonly connectedDevices = signal([
    { 
      name: 'Garmin',
      icon: '<div class="w-4 h-4 bg-blue-600 rounded-sm"></div>'
    },
    { 
      name: 'Fitbit',
      icon: '<div class="w-4 h-4 bg-green-500 rounded-sm"></div>'
    },
    { 
      name: 'Polar',
      icon: '<div class="w-4 h-4 bg-red-500 rounded-sm"></div>'
    },
    { 
      name: 'Strava',
      icon: '<div class="w-4 h-4 bg-orange-500 rounded-sm"></div>'
    },
    { 
      name: 'Apple Watch',
      icon: '<div class="w-4 h-4 bg-gray-800 rounded-sm"></div>'
    },
    { 
      name: 'Wahoo',
      icon: '<div class="w-4 h-4 bg-blue-400 rounded-sm"></div>'
    }
  ]);
}