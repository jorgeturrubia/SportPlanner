import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="sobre-nosotros" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir PlanSport?
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos la plataforma líder en gestión deportiva, diseñada por atletas y entrenadores 
            para revolucionar la forma en que se entrena y compite en el deporte moderno.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          @for (feature of features(); track feature.title) {
            <div class="group bg-gray-50 rounded-xl p-8 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg">
              <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-6 group-hover:bg-blue-700 transition-colors">
                <div [innerHTML]="feature.icon"></div>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ feature.title }}</h3>
              <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
            </div>
          }
        </div>

        <!-- Stats Section -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 lg:p-12">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
            @for (stat of stats(); track stat.label) {
              <div class="text-center">
                <div class="text-3xl lg:text-4xl font-bold text-white mb-2">{{ stat.value }}</div>
                <div class="text-blue-100 text-sm lg:text-base">{{ stat.label }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Mission Statement -->
        <div class="mt-16 bg-gray-50 rounded-2xl p-8 lg:p-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Nuestra Misión
              </h3>
              <p class="text-lg text-gray-600 mb-6">
                Democratizar el acceso a herramientas de entrenamiento profesional, 
                permitiendo que cualquier atleta, independientemente de su nivel o recursos, 
                pueda entrenar con la metodología y tecnología que usan los mejores del mundo.
              </p>
              <p class="text-lg text-gray-600 mb-8">
                Creemos que cada atleta tiene potencial ilimitado, y nuestra plataforma 
                está diseñada para ayudarles a descubrirlo y desarrollarlo al máximo.
              </p>
              <div class="flex flex-wrap gap-4">
                @for (value of values(); track value) {
                  <span class="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    {{ value }}
                  </span>
                }
              </div>
            </div>
            <div class="order-first lg:order-last">
              <div class="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6">
                <!-- Team Illustration -->
                <div class="grid grid-cols-3 gap-4 mb-6">
                  @for (member of teamMembers(); track member.name) {
                    <div class="text-center">
                      <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span class="text-white font-bold text-lg">{{ member.initial }}</span>
                      </div>
                      <div class="text-sm font-medium text-gray-700">{{ member.name }}</div>
                      <div class="text-xs text-gray-500">{{ member.role }}</div>
                    </div>
                  }
                </div>
                <div class="text-center bg-white rounded-lg p-4">
                  <div class="text-sm text-gray-600">Equipo fundador</div>
                  <div class="text-lg font-semibold text-gray-900">Ex-atletas olímpicos y tecnólogos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AboutComponent {
  protected readonly features = signal<Feature[]>([
    {
      icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      title: 'Planes Personalizados',
      description: 'Entrenamientos adaptados a tu nivel, objetivos y disponibilidad. IA que aprende de tu progreso.'
    },
    {
      icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>',
      title: 'Analytics Avanzado',
      description: 'Métricas detalladas de rendimiento, análisis de tendencias y predicciones basadas en datos.'
    },
    {
      icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path d="M9 15v3H7v-3H5a2 2 0 01-2-2V8a2 2 0 012-2h10a2 2 0 012 2v5a2 2 0 01-2 2h-2v3h-2v-3H9z" /></svg>',
      title: 'Entrenadores Expertos',
      description: 'Acceso a profesionales certificados que te guían y motivan hacia tus objetivos.'
    },
    {
      icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg>',
      title: 'Comunidad Activa',
      description: 'Únete a miles de atletas, comparte logros y encuentra motivación en nuestra comunidad.'
    },
    {
      icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>',
      title: 'Multiplataforma',
      description: 'Disponible en web, iOS y Android. Sincronización automática en todos tus dispositivos.'
    },
    {
      icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>',
      title: 'Seguridad Total',
      description: 'Tus datos están protegidos con encriptación de nivel bancario y cumplimiento GDPR.'
    }
  ]);

  protected readonly stats = signal([
    { value: '15K+', label: 'Atletas activos' },
    { value: '500+', label: 'Entrenadores' },
    { value: '95%', label: 'Satisfacción' },
    { value: '24/7', label: 'Soporte' }
  ]);

  protected readonly values = signal([
    'Excelencia',
    'Innovación',
    'Comunidad',
    'Transparencia',
    'Resultados'
  ]);

  protected readonly teamMembers = signal([
    { name: 'Ana García', role: 'CEO', initial: 'A' },
    { name: 'Miguel Torres', role: 'CTO', initial: 'M' },
    { name: 'Julia Ruiz', role: 'Head Coach', initial: 'J' }
  ]);
}