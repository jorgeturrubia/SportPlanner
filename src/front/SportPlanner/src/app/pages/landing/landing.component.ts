import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  private router = inject(Router);
  features = [
    {
      icon: '⚽',
      title: 'Planificación Inteligente',
      description: 'Crea entrenamientos personalizados para cada deporte y atleta'
    },
    {
      icon: '📊',
      title: 'Seguimiento Avanzado',
      description: 'Monitorea el progreso con métricas detalladas en tiempo real'
    },
    {
      icon: '👥',
      title: 'Gestión de Equipos',
      description: 'Administra múltiples equipos desde una plataforma centralizada'
    },
    {
      icon: '📈',
      title: 'Análisis Profesional',
      description: 'Genera reportes con estadísticas para tomar mejores decisiones'
    }
  ];

  testimonials = [
    {
      name: 'Carlos Mendoza',
      role: 'Entrenador Principal',
      club: 'Real Madrid Juvenil',
      quote: 'PlanSport ha revolucionado la forma en que organizamos nuestros entrenamientos.'
    },
    {
      name: 'Ana García',
      role: 'Directora Técnica',
      club: 'Club Natación Barcelona',
      quote: 'El seguimiento individualizado que permite PlanSport es increíble.'
    },
    {
      name: 'Miguel Rodríguez',
      role: 'Entrenador Personal',
      club: 'Atletismo Valencia',
      quote: 'Como entrenador de atletismo, PlanSport me permite tener todo organizado.'
    }
  ];

  pricingPlans = [
    {
      name: 'Básico',
      price: '19€',
      period: 'mes',
      features: ['Hasta 10 atletas', 'Planificación básica', 'Reportes mensuales']
    },
    {
      name: 'Pro',
      price: '49€',
      period: 'mes',
      features: ['Hasta 100 atletas', 'Análisis avanzado', 'Integración dispositivos'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '99€',
      period: 'mes',
      features: ['Atletas ilimitados', 'IA predictiva', 'Soporte 24/7']
    }
  ];

  onGetStarted() {
    this.router.navigate(['/register']);
  }

  onViewDemo() {
    // TODO: Show demo
    console.log('View demo clicked');
  }
}