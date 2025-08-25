import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Header -->
    <header
      class="bg-white/95 backdrop-blur-sm border-b border-primary-200 sticky top-0 z-50 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <h1 class="text-2xl font-bold text-primary-600">SportPlanner</h1>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex space-x-8">
            <a
              href="#caracteristicas"
              class="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
              >Características</a
            >
            <a
              href="#entrenamientos"
              class="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
              >Entrenamientos</a
            >
            <a
              href="#marketplace"
              class="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
              >Marketplace</a
            >
            <a
              href="#suscripciones"
              class="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
              >Suscripciones</a
            >
          </nav>

          <!-- Auth Buttons -->
          <div class="hidden md:flex space-x-4">
            <a
              routerLink="/auth/login"
              class="text-primary-600 hover:text-primary-700 font-medium transition-colors px-4 py-2"
            >
              Iniciar Sesión
            </a>
            <a
              routerLink="/auth/register"
              class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Registrarse
            </a>
          </div>

          <!-- Mobile menu button -->
          <button
            (click)="toggleMobileMenu()"
            class="md:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation -->
        @if (mobileMenuOpen()) {
        <div class="md:hidden py-4 border-t border-secondary-200">
          <div class="flex flex-col space-y-4">
            <a
              href="#caracteristicas"
              (click)="closeMobileMenu()"
              class="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
              >Características</a
            >
            <a
              href="#entrenamientos"
              (click)="closeMobileMenu()"
              class="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
              >Entrenamientos</a
            >
            <a
              href="#marketplace"
              (click)="closeMobileMenu()"
              class="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
              >Marketplace</a
            >
            <a
              href="#suscripciones"
              (click)="closeMobileMenu()"
              class="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
              >Suscripciones</a
            >
            <hr class="border-secondary-200" />
            <a
              routerLink="/auth/login"
              class="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >Iniciar Sesión</a
            >
            <a
              routerLink="/auth/register"
              class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
              >Registrarse</a
            >
          </div>
        </div>
        }
      </div>
    </header>

    <!-- Hero Section -->
    <section
      class="bg-gradient-to-br from-primary-50 via-white to-primary-100 py-20 lg:py-32"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1
            class="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6 leading-tight"
          >
            Planifica tu entrenamiento
            <span class="text-primary-600 block">como un profesional</span>
          </h1>
          <p
            class="text-xl text-secondary-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            SportPlanner te ayuda a organizar tus entrenamientos, gestionar
            equipos y alcanzar tus objetivos deportivos de manera eficiente y
            profesional.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#suscripciones"
              class="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Comenzar ahora
            </a>
            <a
              href="#caracteristicas"
              class="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
            >
              Ver características
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Características Section -->
    <section id="caracteristicas" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            Características Principales
          </h2>
          <p class="text-xl text-secondary-600 max-w-3xl mx-auto">
            Descubre todas las herramientas que SportPlanner pone a tu
            disposición
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            class="bg-primary-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-200"
          >
            <div
              class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-4">
              Gestión de Equipos
            </h3>
            <p class="text-secondary-600">
              Organiza y administra tus equipos deportivos de manera eficiente
              con herramientas profesionales.
            </p>
          </div>

          <div
            class="bg-primary-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-200"
          >
            <div
              class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-4">
              Análisis de Rendimiento
            </h3>
            <p class="text-secondary-600">
              Obtén estadísticas detalladas y análisis de rendimiento para
              mejorar continuamente.
            </p>
          </div>

          <div
            class="bg-primary-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-200"
          >
            <div
              class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-4">
              Planificación Inteligente
            </h3>
            <p class="text-secondary-600">
              Planifica entrenamientos y eventos con nuestro sistema de
              calendario inteligente.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Entrenamientos Section -->
    <section id="entrenamientos" class="py-20 bg-secondary-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            Entrenamientos Personalizados
          </h2>
          <p class="text-xl text-secondary-600 max-w-3xl mx-auto">
            Crea y gestiona planes de entrenamiento adaptados a cada deportista
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 class="text-2xl font-bold text-secondary-900 mb-6">
              Planes de Entrenamiento Profesionales
            </h3>
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div
                  class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-secondary-900 mb-2">
                    Rutinas Personalizadas
                  </h4>
                  <p class="text-secondary-600">
                    Crea rutinas específicas para cada deportista según sus
                    objetivos y nivel.
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div
                  class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-secondary-900 mb-2">
                    Seguimiento de Progreso
                  </h4>
                  <p class="text-secondary-600">
                    Monitorea el avance de cada atleta con métricas detalladas y
                    reportes.
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div
                  class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-secondary-900 mb-2">
                    Biblioteca de Ejercicios
                  </h4>
                  <p class="text-secondary-600">
                    Accede a una amplia biblioteca de ejercicios con
                    instrucciones detalladas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="text-center mb-6">
              <h4 class="text-xl font-bold text-secondary-900 mb-2">
                Plan de Entrenamiento
              </h4>
              <p class="text-secondary-600">Ejemplo de rutina semanal</p>
            </div>
            <div class="space-y-4">
              <div
                class="flex justify-between items-center p-4 bg-primary-50 rounded-lg"
              >
                <span class="font-medium text-secondary-900"
                  >Lunes - Fuerza</span
                >
                <span class="text-primary-600 font-semibold">90 min</span>
              </div>
              <div
                class="flex justify-between items-center p-4 bg-secondary-50 rounded-lg"
              >
                <span class="font-medium text-secondary-900"
                  >Martes - Cardio</span
                >
                <span class="text-secondary-600 font-semibold">60 min</span>
              </div>
              <div
                class="flex justify-between items-center p-4 bg-primary-50 rounded-lg"
              >
                <span class="font-medium text-secondary-900"
                  >Miércoles - Técnica</span
                >
                <span class="text-primary-600 font-semibold">75 min</span>
              </div>
              <div
                class="flex justify-between items-center p-4 bg-secondary-50 rounded-lg"
              >
                <span class="font-medium text-secondary-900"
                  >Jueves - Descanso</span
                >
                <span class="text-secondary-600 font-semibold">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Marketplace Section -->
    <section id="marketplace" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            Marketplace Deportivo
          </h2>
          <p class="text-xl text-secondary-600 max-w-3xl mx-auto">
            Encuentra todo el equipamiento que necesitas para tu entrenamiento
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="bg-secondary-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div
              class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 class="font-bold text-secondary-900 mb-2">Equipamiento</h3>
            <p class="text-sm text-secondary-600">
              Encuentra el mejor equipamiento deportivo
            </p>
          </div>

          <div
            class="bg-secondary-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div
              class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
            </div>
            <h3 class="font-bold text-secondary-900 mb-2">Nutrición</h3>
            <p class="text-sm text-secondary-600">
              Suplementos y productos nutricionales
            </p>
          </div>

          <div
            class="bg-secondary-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div
              class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
            </div>
            <h3 class="font-bold text-secondary-900 mb-2">Tecnología</h3>
            <p class="text-sm text-secondary-600">
              Dispositivos y apps deportivas
            </p>
          </div>

          <div
            class="bg-secondary-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div
              class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
            </div>
            <h3 class="font-bold text-secondary-900 mb-2">Instalaciones</h3>
            <p class="text-sm text-secondary-600">
              Reserva espacios deportivos
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Suscripciones Section -->
    <section id="suscripciones" class="py-20 bg-secondary-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            Planes de Suscripción
          </h2>
          <p class="text-xl text-secondary-600 max-w-3xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Plan Básico -->
          <div
            class="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-primary-200 transition-all duration-200"
          >
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-secondary-900 mb-2">Básico</h3>
              <div class="text-4xl font-bold text-primary-600 mb-2">
                €9<span class="text-lg text-secondary-600">/mes</span>
              </div>
              <p class="text-secondary-600">Perfecto para empezar</p>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-primary-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-secondary-700">Hasta 2 equipos</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-primary-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-secondary-700"
                  >Planes básicos de entrenamiento</span
                >
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-primary-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-secondary-700">Soporte por email</span>
              </li>
            </ul>
            <a
              routerLink="/auth/register"
              class="w-full bg-secondary-100 hover:bg-secondary-200 text-secondary-900 py-3 px-6 rounded-lg font-semibold transition-colors text-center block"
            >
              Comenzar gratis
            </a>
          </div>

          <!-- Plan Pro -->
          <div
            class="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary-600 relative transform scale-105"
          >
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span
                class="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold"
                >Más Popular</span
              >
            </div>
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-secondary-900 mb-2">Pro</h3>
              <div class="text-4xl font-bold text-primary-600 mb-2">
                €29<span class="text-lg text-secondary-600">/mes</span>
              </div>
              <p class="text-secondary-600">Para equipos profesionales</p>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-primary-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-secondary-700">Equipos ilimitados</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-primary-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-secondary-700">Análisis avanzado</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-primary-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-secondary-700">Marketplace completo</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-primary-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-secondary-700">Soporte prioritario</span>
              </li>
            </ul>
            <a
              routerLink="/auth/register"
              class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-center block"
            >
              Empezar ahora
            </a>
          </div>

          <!-- Plan Enterprise -->
          <div
            class="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-primary-200 transition-all duration-200"
          >
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-secondary-900 mb-2">
                Enterprise
              </h3>
              <div class="text-4xl font-bold text-primary-600 mb-2">
                €99<span class="text-lg text-secondary-600">/mes</span>
              </div>
              <p class="text-secondary-600">Para organizaciones grandes</p>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-primary-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-secondary-700">Todo lo del plan Pro</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-primary-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-secondary-700">API personalizada</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-primary-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-secondary-700">Soporte 24/7</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-primary-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-secondary-700">Consultoría incluida</span>
              </li>
            </ul>
            <a
              routerLink="/auth/register"
              class="w-full bg-secondary-100 hover:bg-secondary-200 text-secondary-900 py-3 px-6 rounded-lg font-semibold transition-colors text-center block"
            >
              Contactar ventas
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary-600">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-white mb-6">
          ¿Listo para llevar tu entrenamiento al siguiente nivel?
        </h2>
        <p class="text-xl text-primary-100 mb-8">
          Únete a miles de deportistas y entrenadores que ya confían en
          SportPlanner
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            routerLink="/auth/register"
            class="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Registrarse gratis
          </a>
          <a
            routerLink="/auth/login"
            class="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-secondary-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-2">
            <h3 class="text-2xl font-bold text-white mb-4">SportPlanner</h3>
            <p class="text-secondary-300 mb-6 max-w-md">
              La plataforma líder para la planificación y gestión de
              entrenamientos deportivos profesionales.
            </p>
            <div class="flex space-x-4">
              <a
                href="#"
                class="text-secondary-400 hover:text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="text-secondary-400 hover:text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="text-secondary-400 hover:text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 class="text-lg font-semibold text-white mb-4">Producto</h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="#caracteristicas"
                  class="text-secondary-300 hover:text-white transition-colors"
                  >Características</a
                >
              </li>
              <li>
                <a
                  href="#entrenamientos"
                  class="text-secondary-300 hover:text-white transition-colors"
                  >Entrenamientos</a
                >
              </li>
              <li>
                <a
                  href="#marketplace"
                  class="text-secondary-300 hover:text-white transition-colors"
                  >Marketplace</a
                >
              </li>
              <li>
                <a
                  href="#suscripciones"
                  class="text-secondary-300 hover:text-white transition-colors"
                  >Precios</a
                >
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-lg font-semibold text-white mb-4">Soporte</h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="text-secondary-300 hover:text-white transition-colors"
                  >Centro de ayuda</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-secondary-300 hover:text-white transition-colors"
                  >Contacto</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-secondary-300 hover:text-white transition-colors"
                  >Términos</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-secondary-300 hover:text-white transition-colors"
                  >Privacidad</a
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-secondary-800 mt-12 pt-8 text-center">
          <p class="text-secondary-400">
            © 2025 SportPlanner. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      html {
        scroll-behavior: smooth;
      }
    `,
  ],
})
export class LandingPageComponent {
  mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
