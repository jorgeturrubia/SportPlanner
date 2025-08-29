import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, NgIconComponent, NavbarComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit {
  
  features = [
    {
      icon: 'heroCalendarDays',
      title: 'Gestión de Eventos',
      description: 'Organiza y planifica torneos, entrenamientos y competencias con herramientas intuitivas y completas.'
    },
    {
      icon: 'heroUsers',
      title: 'Gestión de Equipos',
      description: 'Administra jugadores, crea equipos balanceados y mantén un seguimiento completo de tus deportistas.'
    },
    {
      icon: 'heroAcademicCap',
      title: 'Sistema de Categorías',
      description: 'Organiza competencias por edad, nivel y tipo de deporte para una experiencia justa y divertida.'
    },
    {
      icon: 'heroServerStack',
      title: 'Análisis y Estadísticas',
      description: 'Obtén insights detallados sobre rendimiento, participación y métricas clave de tus eventos deportivos.'
    }
  ];

  marketplaceFeatures = [
    {
      icon: 'heroMagnifyingGlass',
      title: 'Encuentra Eventos',
      description: 'Descubre torneos y actividades deportivas cerca de ti o únete a competencias online.'
    },
    {
      icon: 'heroUsers',
      title: 'Conecta con Deportistas',
      description: 'Conoce otros atletas, forma equipos y expande tu red de contactos deportivos.'
    },
    {
      icon: 'heroCalendarDays',
      title: 'Calendario Integrado',
      description: 'Sincroniza todos tus eventos deportivos en un solo lugar y nunca pierdas una cita importante.'
    }
  ];

  subscriptionPlans = [
    {
      name: 'Básico',
      price: 'Gratis',
      period: '',
      description: 'Perfecto para empezar',
      features: [
        'Hasta 3 equipos',
        'Eventos básicos',
        'Soporte por email',
        'Estadísticas básicas'
      ],
      highlighted: false,
      buttonText: 'Comenzar Gratis'
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/mes',
      description: 'Para organizadores serios',
      features: [
        'Equipos ilimitados',
        'Eventos avanzados',
        'Soporte prioritario',
        'Análisis completos',
        'Integraciones',
        'Personalización'
      ],
      highlighted: true,
      buttonText: 'Comenzar Prueba'
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: '/mes',
      description: 'Para organizaciones grandes',
      features: [
        'Todo en Pro',
        'API completa',
        'Soporte 24/7',
        'Manager dedicado',
        'Entrenamientos',
        'SLA garantizado'
      ],
      highlighted: false,
      buttonText: 'Contactar Ventas'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToAuth(): void {
    this.router.navigate(['/auth']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}