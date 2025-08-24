import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-gray-900 text-white">
      <!-- Main Footer Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="lg:col-span-1">
            <div class="text-2xl font-bold text-white mb-4">PlanSport</div>
            <p class="text-gray-300 mb-6 leading-relaxed">
              La plataforma líder en gestión deportiva que ayuda a atletas y entrenadores 
              a alcanzar su máximo potencial.
            </p>
            
            <!-- Newsletter Signup -->
            <div class="mb-6">
              <h4 class="font-semibold mb-3">Newsletter</h4>
              <div class="flex">
                <input
                  type="email"
                  placeholder="tu-email@example.com"
                  class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
                >
                <button
                  type="button"
                  class="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </button>
              </div>
              <p class="text-xs text-gray-400 mt-2">
                Únete a +5,000 atletas que reciben tips semanales
              </p>
            </div>

            <!-- Social Links -->
            <div>
              <h4 class="font-semibold mb-3">Síguenos</h4>
              <div class="flex gap-4">
                @for (social of socialLinks(); track social.name) {
                  <a
                    [href]="social.href"
                    [attr.aria-label]="social.name"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <div [innerHTML]="social.icon"></div>
                  </a>
                }
              </div>
            </div>
          </div>

          <!-- Footer Sections -->
          @for (section of footerSections(); track section.title) {
            <div>
              <h4 class="font-semibold text-white mb-4">{{ section.title }}</h4>
              <ul class="space-y-3">
                @for (link of section.links; track link.label) {
                  <li>
                    <a
                      [href]="link.href"
                      class="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {{ link.label }}
                    </a>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      </div>

      <!-- App Download Section -->
      <div class="border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 class="text-xl font-bold text-white mb-2">
                Lleva PlanSport contigo
              </h3>
              <p class="text-gray-300 mb-4">
                Descarga nuestra app móvil y entrena desde cualquier lugar
              </p>
              
              <!-- App Store Badges -->
              <div class="flex gap-4">
                <a
                  href="#"
                  class="bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-6 py-3 flex items-center gap-3"
                >
                  <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <div class="text-xs text-gray-300">Descarga en</div>
                    <div class="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                
                <a
                  href="#"
                  class="bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-6 py-3 flex items-center gap-3"
                >
                  <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div>
                    <div class="text-xs text-gray-300">Descarga en</div>
                    <div class="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            <!-- QR Code -->
            <div class="lg:text-right">
              <div class="inline-block bg-white p-4 rounded-lg">
                <div class="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                  <!-- QR Code Placeholder -->
                  <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <p class="text-sm text-gray-300 mt-2">Escanea para descargar</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-sm text-gray-400">
              © {{ currentYear() }} PlanSport. Todos los derechos reservados.
            </div>
            
            <!-- Legal Links -->
            <div class="flex gap-6 text-sm text-gray-400">
              @for (legal of legalLinks(); track legal.label) {
                <a
                  [href]="legal.href"
                  class="hover:text-white transition-colors"
                >
                  {{ legal.label }}
                </a>
              }
            </div>
            
            <!-- Language Selector -->
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clip-rule="evenodd" />
              </svg>
              <select class="bg-transparent text-gray-400 text-sm focus:outline-none cursor-pointer">
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  protected readonly currentYear = signal(new Date().getFullYear());

  protected readonly footerSections = signal<FooterSection[]>([
    {
      title: 'Producto',
      links: [
        { label: 'Planes de Entrenamiento', href: '#entrenamientos' },
        { label: 'Marketplace', href: '#marketplace' },
        { label: 'Analytics', href: '/analytics' },
        { label: 'App Móvil', href: '/mobile' },
        { label: 'Integraciones', href: '/integrations' },
        { label: 'Novedades', href: '/changelog' }
      ]
    },
    {
      title: 'Recursos',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Guías de Entrenamiento', href: '/guides' },
        { label: 'Centro de Ayuda', href: '/help' },
        { label: 'Webinars', href: '/webinars' },
        { label: 'Calculadoras', href: '/tools' },
        { label: 'Estado del Sistema', href: '/status' }
      ]
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre Nosotros', href: '#sobre-nosotros' },
        { label: 'Carreras', href: '/careers' },
        { label: 'Prensa', href: '/press' },
        { label: 'Inversionistas', href: '/investors' },
        { label: 'Partnerships', href: '/partnerships' },
        { label: 'Contacto', href: '/contact' }
      ]
    }
  ]);

  protected readonly socialLinks = signal<SocialLink[]>([
    {
      name: 'Instagram',
      href: 'https://instagram.com/plansport',
      icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/plansport',
      icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>'
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/plansport',
      icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/plansport',
      icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/plansport',
      icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
    }
  ]);

  protected readonly legalLinks = signal<FooterLink[]>([
    { label: 'Privacidad', href: '/privacy' },
    { label: 'Términos', href: '/terms' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' }
  ]);
}