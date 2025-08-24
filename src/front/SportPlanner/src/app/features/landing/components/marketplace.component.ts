import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MarketplaceItem {
  id: number;
  title: string;
  description: string;
  price: string;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  coach: {
    name: string;
    credentials: string;
    avatar: string;
  };
}

interface Category {
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="marketplace" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Marketplace de Entrenamientos
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Accede a planes de entrenamiento creados por los mejores entrenadores del mundo. 
            Desde principiantes hasta atletas de élite, encuentra el plan perfecto para ti.
          </p>
        </div>

        <!-- Categories -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          @for (category of categories(); track category.name) {
            <button
              type="button"
              [class]="'group flex flex-col items-center p-4 rounded-xl border-2 transition-all hover:border-blue-500 hover:bg-blue-50 ' + 
                      (selectedCategory() === category.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white')"
              (click)="selectCategory(category.name)"
            >
              <div class="w-12 h-12 mb-3 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <div [innerHTML]="category.icon"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 text-center">{{ category.name }}</span>
              <span class="text-xs text-gray-500">{{ category.count }} planes</span>
            </button>
          }
        </div>

        <!-- Featured Plans -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          @for (item of featuredItems(); track item.id) {
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <!-- Plan Image -->
              <div class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                <div class="absolute inset-0 bg-black/20"></div>
                <div class="absolute top-4 left-4">
                  <span class="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                    {{ item.category }}
                  </span>
                </div>
                <div class="absolute bottom-4 left-4 text-white">
                  <h3 class="text-lg font-bold">{{ item.title }}</h3>
                </div>
              </div>

              <!-- Plan Content -->
              <div class="p-6">
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ item.description }}</p>
                
                <!-- Rating -->
                <div class="flex items-center gap-2 mb-4">
                  <div class="flex">
                    @for (star of getStars(item.rating); track $index) {
                      <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    }
                  </div>
                  <span class="text-sm text-gray-600">{{ item.rating }} ({{ item.reviews }} reseñas)</span>
                </div>

                <!-- Coach Info -->
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">{{ item.coach.avatar }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ item.coach.name }}</div>
                    <div class="text-xs text-gray-500">{{ item.coach.credentials }}</div>
                  </div>
                </div>

                <!-- Price and Action -->
                <div class="flex items-center justify-between">
                  <div class="text-2xl font-bold text-blue-600">{{ item.price }}</div>
                  <button
                    type="button"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Ver Plan
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Marketplace Stats -->
        <div class="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 lg:p-12">
          <div class="text-center mb-8">
            <h3 class="text-2xl lg:text-3xl font-bold text-white mb-4">
              El Marketplace más Grande de Entrenamientos Deportivos
            </h3>
            <p class="text-gray-300 max-w-2xl mx-auto">
              Miles de planes creados por entrenadores certificados y atletas profesionales de todo el mundo.
            </p>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            @for (stat of marketplaceStats(); track stat.label) {
              <div class="text-center">
                <div class="text-3xl lg:text-4xl font-bold text-white mb-2">{{ stat.value }}</div>
                <div class="text-gray-300 text-sm lg:text-base">{{ stat.label }}</div>
              </div>
            }
          </div>

          <!-- CTA -->
          <div class="text-center">
            <button
              type="button"
              class="bg-yellow-400 text-yellow-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Explorar Marketplace
            </button>
          </div>
        </div>

        <!-- Creator Program -->
        <div class="mt-12 bg-blue-50 rounded-2xl p-8 lg:p-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                ¿Eres Entrenador? Únete a Nuestro Programa
              </h3>
              <p class="text-lg text-gray-600 mb-6">
                Monetiza tu experiencia creando y vendiendo planes de entrenamiento. 
                Gana ingresos pasivos mientras ayudas a atletas de todo el mundo.
              </p>
              <div class="space-y-4 mb-8">
                @for (benefit of creatorBenefits(); track benefit) {
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <span class="text-gray-700">{{ benefit }}</span>
                  </div>
                }
              </div>
              <button
                type="button"
                class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Aplicar como Creador
              </button>
            </div>
            <div class="order-first lg:order-last">
              <div class="bg-white rounded-xl p-6 shadow-lg">
                <h4 class="font-semibold text-gray-900 mb-4">Ejemplo de Ganancias</h4>
                <div class="space-y-3">
                  @for (earning of earningsExample(); track earning.metric) {
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">{{ earning.metric }}</span>
                      <span class="font-semibold text-gray-900">{{ earning.value }}</span>
                    </div>
                  }
                  <div class="border-t pt-3">
                    <div class="flex justify-between items-center">
                      <span class="font-semibold text-gray-900">Ingreso mensual estimado</span>
                      <span class="text-2xl font-bold text-green-600">€2,840</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class MarketplaceComponent {
  protected readonly selectedCategory = signal('Running');

  protected readonly categories = signal<Category[]>([
    { name: 'Running', icon: '<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L13 14l-3-3-3 3 3-12z" /></svg>', count: 156 },
    { name: 'Ciclismo', icon: '<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><circle cx="6" cy="14" r="4" /><circle cx="14" cy="14" r="4" /><path d="M14 2l2 8H8l2-8h4z" /></svg>', count: 89 },
    { name: 'Natación', icon: '<svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 14c1-1 2-1 3 0s2 1 3 0 2-1 3 0 2 1 3 0 2-1 3 0v2c-1-1-2-1-3 0s-2 1-3 0-2-1-3 0-2 1-3 0-2-1-3 0v-2z" /></svg>', count: 72 },
    { name: 'Fuerza', icon: '<svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 8h2V6a2 2 0 014 0v2h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2z" /></svg>', count: 124 },
    { name: 'Funcional', icon: '<svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>', count: 93 },
    { name: 'Yoga', icon: '<svg class="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 14l-2-2 1.5-1.5L10 13l4.5-4.5L16 10l-6 6z" /></svg>', count: 67 }
  ]);

  protected readonly featuredItems = signal<MarketplaceItem[]>([
    {
      id: 1,
      title: 'Programa 10K en 8 Semanas',
      description: 'Plan completo para correr tu primera carrera de 10K con confianza y técnica perfecta.',
      price: '€29.99',
      rating: 4.9,
      reviews: 234,
      category: 'Running',
      image: '/assets/plan1.jpg',
      coach: {
        name: 'María González',
        credentials: 'Entrenadora Nacional',
        avatar: 'MG'
      }
    },
    {
      id: 2,
      title: 'Fuerza Explosiva para Deportistas',
      description: 'Desarrolla potencia y velocidad con este programa de entrenamiento de fuerza específico.',
      price: '€39.99',
      rating: 4.8,
      reviews: 189,
      category: 'Fuerza',
      image: '/assets/plan2.jpg',
      coach: {
        name: 'Carlos Ruiz',
        credentials: 'Ex-atleta olímpico',
        avatar: 'CR'
      }
    },
    {
      id: 3,
      title: 'Natación Técnica Avanzada',
      description: 'Perfecciona tu técnica en los 4 estilos y mejora tu eficiencia en el agua.',
      price: '€34.99',
      rating: 4.9,
      reviews: 156,
      category: 'Natación',
      image: '/assets/plan3.jpg',
      coach: {
        name: 'Ana Torres',
        credentials: 'Campeona mundial masters',
        avatar: 'AT'
      }
    }
  ]);

  protected readonly marketplaceStats = signal([
    { value: '2,500+', label: 'Planes disponibles' },
    { value: '800+', label: 'Entrenadores certificados' },
    { value: '25K+', label: 'Atletas entrenando' },
    { value: '4.8★', label: 'Valoración promedio' }
  ]);

  protected readonly creatorBenefits = signal([
    'Comisión del 70% por cada venta',
    'Herramientas de creación avanzadas',
    'Marketing automático de tu contenido',
    'Anályticas detalladas de rendimiento',
    'Soporte dedicado para creadores',
    'Pagos automáticos mensuales'
  ]);

  protected readonly earningsExample = signal([
    { metric: 'Planes vendidos (mes)', value: '142' },
    { metric: 'Precio promedio', value: '€28.50' },
    { metric: 'Comisión (70%)', value: '€2,839' },
    { metric: 'Ingresos totales', value: '€4,056' }
  ]);

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  protected getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}