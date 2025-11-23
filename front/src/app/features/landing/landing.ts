import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {
  plans = [
    {
      name: 'Free',
      price: '0€',
      period: 'siempre',
      description: 'Periodo de prueba limitado',
      features: [
        '1 planificación',
        'Funcionalidades básicas',
        'Soporte por email'
      ],
      highlighted: false
    },
    {
      name: 'Personal',
      price: '5,99€',
      period: 'mes',
      description: 'Para entrenadores individuales',
      features: [
        'Equipos ilimitados',
        'Planificaciones ilimitadas',
        'Editor visual completo',
        'Soporte prioritario'
      ],
      highlighted: false
    },
    {
      name: 'Pro',
      price: '9,99€',
      period: 'mes',
      description: 'Acceso completo al marketplace',
      features: [
        'Todo de Personal',
        'Marketplace completo',
        'Ejercicios validados',
        'Importar contenidos',
        'Soporte premium'
      ],
      highlighted: true
    },
    {
      name: 'Director',
      price: '15,99€',
      period: 'mes',
      description: 'Gestión de múltiples equipos',
      features: [
        'Todo de Pro',
        'Gestión de equipos',
        'Director deportivo',
        'Reportes avanzados',
        'API access'
      ],
      highlighted: false
    },
    {
      name: 'Club',
      price: '19,99€',
      period: 'mes',
      description: 'Solución completa para clubes',
      features: [
        'Todo de Director',
        'CRM completo',
        'Licencias múltiples',
        'Soporte dedicado',
        'Personalización'
      ],
      highlighted: false
    }
  ];

  currentYear = new Date().getFullYear();
}
