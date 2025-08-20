# PlanSport - Plataforma Multi-Deporte de Planificación

## Descripción del Proyecto

PlanSport es una aplicación integral de planificación deportiva multi-deporte que facilita a entrenadores crear, compartir y ejecutar planificaciones de entrenamiento. Con muy pocos clicks, los usuarios pueden acceder a planificaciones completas con objetivos, ejercicios y entrenamientos creados por la comunidad de entrenadores a través de un marketplace de conocimiento deportivo.

## Arquitectura Técnica

### Frontend (Angular 20)
- **Ubicación**: `src/front/SportPlanner/`
- **Framework**: Angular 20 con componentes standalone
- **Styling**: Tailwind CSS 4
- **Icons**: Hero Icons
- **Estado**: Angular Signals + RxJS
- **Formularios**: Reactive Forms con tipado estricto

### Backend (.NET 8)
- **Ubicación**: `src/back/SportPlanner/`
- **Framework**: .NET 8 Web API
- **Autenticación**: Supabase Auth con JWT
- **Base de Datos**: Supabase PostgreSQL
- **ORM**: Entity Framework Core

## Estado Actual de Implementación

### ✅ Fase 0: Completada
- [x] Estructura del proyecto (Angular 20 + .NET 8)
- [x] Landing page con diseño moderno
- [x] Sistema de autenticación Supabase
- [x] Dashboard con UX mejorado
- [x] Gestión básica de equipos
- [x] Diseño responsive con Tailwind CSS 4

### 🔄 Fase 1: En Desarrollo
- [ ] Completar funcionalidades de gestión de equipos
- [ ] Sistema de suscripciones (Gratuita, Entrenador, Club)
- [ ] Selección de deporte al registrarse
- [ ] Gestión de perfiles de usuario

## Características Clave del Producto

### Modelo de Suscripciones
- **Gratuita (0€)**: 1 equipo, 15 entrenamientos máximo
- **Entrenador**: Equipos y entrenamientos ilimitados, conceptos personalizados
- **Club**: Gestión múltiples equipos, rol director, usuarios adicionales

### Funcionalidades Principales
- **Marketplace de Planificaciones**: Importar y compartir planificaciones con valoración 1-5 estrellas
- **Generación Automática**: Crear entrenamientos completos basados en itinerarios
- **Gestión Multi-Deporte**: Conceptos y ejercicios específicos por deporte
- **Sistema de Roles**: Administrador, Director, Entrenador con permisos granulares

## Estructura de Datos

### Relaciones Principales
- Usuario → Suscripciones (gratuita + 1 premium máximo)
- Club → Múltiples Equipos
- Equipo ↔ Planificaciones (many-to-many)
- Planificación → Conceptos o Itinerarios
- Concepto ↔ Ejercicios (many-to-many)

### Clasificaciones
- **Equipos**: Masculino/Femenino, Categoría por edad, Nivel A/B/C
- **Conceptos**: Categoría/Subcategoría, Nivel de dificultad, Tiempo estimado
- **Ejercicios**: Vinculados a conceptos múltiples para entrenamiento efectivo

## Estándares de Desarrollo

### Convenciones de Código
- **Angular**: Componentes standalone, control flow syntax (@if, @for, @switch)
- **TypeScript**: Tipado estricto, uso de Signals para estado
- **CSS**: Tailwind CSS 4 utility-first, variables CSS para temas
- **.NET**: Minimal APIs para CRUD, controladores para lógica compleja

### Organización de Archivos
```
src/front/SportPlanner/
├── app/
│   ├── features/          # Módulos por funcionalidad
│   │   ├── auth/
│   │   ├── teams/
│   │   ├── planning/
│   │   └── marketplace/
│   ├── shared/           # Componentes compartidos
│   ├── pages/           # Componentes de página
│   └── core/           # Servicios core
```

### Naming Conventions
- **Angular**: kebab-case para componentes y servicios
- **.NET**: PascalCase siguiendo convenciones C#
- **Interfaces TypeScript**: Prefijo 'I'
- **Archivos**: component.ts, component.html, component.css separados

## Comandos de Desarrollo

### Frontend
```bash
cd src/front/SportPlanner
npm run dev          # Desarrollo
npm run build        # Build producción
npm run test         # Tests unitarios
npm run lint         # Linting
```

### Backend
```bash
cd src/back/SportPlanner
dotnet run           # Ejecutar API
dotnet test          # Tests
dotnet build         # Build
```

## Configuración de Entorno

### Variables de Entorno
- **Frontend**: `src/front/SportPlanner/src/environments/`
- **Backend**: `src/back/SportPlanner/appsettings.json`
- **Supabase**: Configuración en ambos proyectos

### Base de Datos
- **Provider**: Supabase PostgreSQL
- **Autenticación**: Supabase Auth
- **Storage**: Supabase Storage para medios

## Roadmap de Desarrollo

### Próximas Características (Fases 2-3)
- Sistema completo de conceptos y objetivos categorizados
- Biblioteca de ejercicios vinculados a conceptos
- Planificaciones con itinerarios predefinidos
- Generación automática de entrenamientos

### Características Avanzadas (Fases 4-8)
- Vista dinámica de entrenamientos con cronómetro
- Analytics y reportes de progreso
- Marketplace comunitario con valoraciones
- Integración con wearables y ML

## Enfoque de Mercado

- **Idioma**: Interfaz en español
- **Mercado**: Entrenadores, clubes deportivos, directores deportivos
- **Deportes**: Multi-deporte con especialización por disciplina
- **UX**: Configuración ultra-rápida (3 clicks para planificación completa)

---

*Documentación generada para el desarrollo de PlanSport con Agent OS*