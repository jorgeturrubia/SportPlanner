import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
  cta: string;
  badge?: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="suscripciones" class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Planes Diseñados Para Ti
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Desde atletas amateur hasta profesionales, tenemos el plan perfecto 
            para llevar tu entrenamiento al siguiente nivel.
          </p>
          
          <!-- Billing Toggle -->
          <div class="mt-8 flex items-center justify-center">
            <div class="bg-white p-1 rounded-lg shadow-sm border border-gray-200">
              <button
                type="button"
                [class]="'px-4 py-2 text-sm font-medium rounded-md transition-colors ' + 
                        (!isYearly() ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900')"
                (click)="setYearly(false)"
              >
                Mensual
              </button>
              <button
                type="button"
                [class]="'px-4 py-2 text-sm font-medium rounded-md transition-colors ' + 
                        (isYearly() ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900')"
                (click)="setYearly(true)"
              >
                Anual
                <span class="ml-1 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          @for (plan of pricingPlans(); track plan.id) {
            <div [class]="'relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ' + 
                          (plan.recommended ? 'ring-2 ring-blue-500 scale-105' : '')">
              
              <!-- Recommended Badge -->
              @if (plan.recommended) {
                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span class="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              }

              @if (plan.badge) {
                <div class="absolute top-4 right-4">
                  <span class="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                    {{ plan.badge }}
                  </span>
                </div>
              }

              <div class="p-8">
                <!-- Plan Header -->
                <div class="text-center mb-8">
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ plan.name }}</h3>
                  <p class="text-gray-600 mb-4">{{ plan.description }}</p>
                  
                  <div class="text-center">
                    <span class="text-4xl font-bold text-gray-900">{{ getPlanPrice(plan) }}</span>
                    <span class="text-gray-500 ml-1">{{ plan.period }}</span>
                  </div>
                  
                  @if (isYearly() && plan.id !== 'free') {
                    <div class="text-sm text-green-600 mt-1">
                      Ahorra {{ getYearlySavings(plan) }} al año
                    </div>
                  }
                </div>

                <!-- Features List -->
                <div class="space-y-4 mb-8">
                  @for (feature of plan.features; track feature) {
                    <div class="flex items-start gap-3">
                      <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <span class="text-gray-700 text-sm">{{ feature }}</span>
                    </div>
                  }
                </div>

                <!-- CTA Button -->
                <button
                  type="button"
                  [class]="'w-full py-3 px-4 rounded-lg font-semibold transition-colors ' + 
                          (plan.recommended 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200')"
                >
                  {{ plan.cta }}
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Enterprise Section -->
        <div class="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 lg:p-12 text-center">
          <h3 class="text-2xl lg:text-3xl font-bold text-white mb-4">
            ¿Necesitas algo más avanzado?
          </h3>
          <p class="text-gray-300 mb-8 max-w-2xl mx-auto">
            Soluciones enterprise para federaciones, clubs y organizaciones deportivas. 
            Gestión de equipos, análisis avanzado y herramientas de administración.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            @for (enterprise of enterpriseFeatures(); track enterprise) {
              <div class="bg-white/10 rounded-lg p-4">
                <div class="text-white font-semibold">{{ enterprise }}</div>
              </div>
            }
          </div>
          
          <button
            type="button"
            class="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contactar Ventas
          </button>
        </div>

        <!-- FAQ Section -->
        <div class="mt-16">
          <h3 class="text-2xl font-bold text-gray-900 text-center mb-12">
            Preguntas Frecuentes
          </h3>
          
          <div class="max-w-3xl mx-auto space-y-6">
            @for (faq of faqs(); track faq.question) {
              <div class="bg-white rounded-lg p-6 shadow-sm">
                <button
                  type="button"
                  class="w-full text-left flex justify-between items-center"
                  (click)="toggleFaq(faq.question)"
                >
                  <span class="font-semibold text-gray-900">{{ faq.question }}</span>
                  <svg 
                    [class]="'w-5 h-5 text-gray-500 transform transition-transform ' + 
                            (openFaq() === faq.question ? 'rotate-180' : '')"
                    fill="currentColor" viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                @if (openFaq() === faq.question) {
                  <div class="mt-4 pt-4 border-t border-gray-200">
                    <p class="text-gray-600">{{ faq.answer }}</p>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Money Back Guarantee -->
        <div class="mt-12 bg-green-50 rounded-2xl p-8 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <h4 class="text-xl font-bold text-gray-900 mb-2">Garantía de 30 Días</h4>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Prueba PlanSport sin riesgo. Si no estás completamente satisfecho en los primeros 30 días, 
            te devolvemos tu dinero, sin preguntas.
          </p>
        </div>
      </div>
    </section>
  `
})
export class PricingComponent {
  protected readonly isYearly = signal(false);
  protected readonly openFaq = signal<string | null>(null);

  protected readonly pricingPlans = signal<PricingPlan[]>([
    {
      id: 'free',
      name: 'Gratuito',
      price: '€0',
      period: '/mes',
      description: 'Perfecto para empezar tu journey fitness',
      features: [
        '3 planes básicos incluidos',
        'Tracking manual de entrenamientos',
        'Métricas básicas de progreso',
        'Comunidad de atletas',
        'Soporte por email'
      ],
      cta: 'Comenzar Gratis',
      badge: 'Popular'
    },
    {
      id: 'pro',
      name: 'Profesional',
      price: '€19',
      period: '/mes',
      description: 'Para atletas serios que buscan resultados',
      recommended: true,
      features: [
        'Planes personalizados ilimitados',
        'IA adaptativa de entrenamiento',
        'Analytics avanzado de rendimiento',
        'Integración con dispositivos',
        'Planes nutricionales',
        'Seguimiento de recuperación',
        'Soporte prioritario 24/7',
        'Acceso al marketplace completo'
      ],
      cta: 'Comenzar Prueba Gratuita'
    },
    {
      id: 'elite',
      name: 'Élite',
      price: '€39',
      period: '/mes',
      description: 'Para atletas de alto rendimiento',
      features: [
        'Todo del plan Profesional',
        'Entrenador personal asignado',
        'Análisis biomecánico avanzado',
        'Planes de competición',
        'Consultas 1:1 ilimitadas',
        'Informes médicos deportivos',
        'Acceso beta a nuevas funciones',
        'API para desarrolladores'
      ],
      cta: 'Contactar Especialista'
    }
  ]);

  protected readonly enterpriseFeatures = signal([
    'Gestión de equipos completos',
    'Dashboard de administración',
    'Análisis comparativo de rendimiento',
    'Integración con sistemas existentes',
    'Soporte técnico dedicado',
    'SLA garantizado 99.9%'
  ]);

  protected readonly faqs = signal([
    {
      question: '¿Puedo cambiar de plan en cualquier momento?',
      answer: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se reflejan inmediatamente y solo pagas la diferencia prorrateada.'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos todas las tarjetas de crédito principales (Visa, Mastercard, Amex), PayPal, y transferencias bancarias para empresas.'
    },
    {
      question: '¿Hay descuentos para estudiantes o equipos?',
      answer: 'Sí, ofrecemos 50% de descuento para estudiantes con ID válido y precios especiales para equipos de más de 10 miembros.'
    },
    {
      question: '¿Puedo cancelar mi suscripción?',
      answer: 'Por supuesto. Puedes cancelar en cualquier momento desde tu cuenta. Mantienes acceso hasta el final del período facturado.'
    },
    {
      question: '¿Los planes incluyen actualizaciones?',
      answer: 'Todas las actualizaciones y nuevas funciones están incluidas en tu suscripción sin costo adicional.'
    }
  ]);

  protected setYearly(yearly: boolean): void {
    this.isYearly.set(yearly);
  }

  protected toggleFaq(question: string): void {
    this.openFaq.update(current => current === question ? null : question);
  }

  protected getPlanPrice(plan: PricingPlan): string {
    if (plan.id === 'free') return plan.price;
    
    if (this.isYearly()) {
      const monthlyPrice = parseInt(plan.price.replace('€', ''));
      const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.8); // 20% discount
      return `€${yearlyPrice}`;
    }
    
    return plan.price;
  }

  protected getYearlySavings(plan: PricingPlan): string {
    if (plan.id === 'free') return '€0';
    
    const monthlyPrice = parseInt(plan.price.replace('€', ''));
    const savings = Math.floor(monthlyPrice * 12 * 0.2); // 20% savings
    return `€${savings}`;
  }
}