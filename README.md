# SportPlanner

## Descripción
Aplicación web para la planificación y gestión de entrenamientos deportivos. Permite a entrenadores crear, compartir y gestionar planificaciones, equipos y sesiones de entrenamiento con un sistema de marketplace integrado.

## Arquitectura
- **Frontend**: Angular 20 + Tailwind CSS
- **Backend**: .NET 8 Web API
- **Base de Datos**: PostgreSQL con Supabase
- **Autenticación**: Supabase Auth

## Estructura del Proyecto
```
SportPlanner/
├── src/
│   ├── front/SportPlanner/ # Aplicación Angular 20 con Tailwind 4
│   └── backend/            # API .NET 8
├── docs/                   # Documentación
├── scripts/               # Scripts de desarrollo
└── .claude/               # Configuración de agentes
```

## Requisitos Previos
- Node.js 18+
- .NET 8 SDK
- PostgreSQL (o cuenta Supabase)
- Angular CLI 20

## Instalación

### Frontend (Angular)
```bash
cd src/front/SportPlanner
npm install
ng serve
```

### Backend (.NET 8)
```bash
cd src/backend
dotnet restore
dotnet run
```

## Configuración
1. Crear cuenta en Supabase
2. Configurar variables de entorno
3. Ejecutar migraciones de base de datos

## Funcionalidades Principales
- ✅ Autenticación con Supabase
- ✅ Sistema de suscripciones (Gratuita, Entrenador, Club)
- ✅ Gestión de equipos y organizaciones
- ✅ Creación de planificaciones con conceptos e itinerarios
- ✅ Generación automática de entrenamientos
- ✅ Vista dinámica de sesiones con cronómetro
- ✅ Marketplace de planificaciones compartidas
- ✅ Sistema de valoraciones y búsqueda
- ✅ Reportes y analytics

## Estado del Proyecto
📋 **Fase**: Configuración inicial
🚀 **Sprint Actual**: Sprint 1 - Fundación del Sistema
📅 **Próximo Hito**: Sistema de autenticación funcional

## Documentación
- [Especificaciones Técnicas](.claude/specs/sportplanner/)
- [Plan de Sprint](.claude/project-state/sprint-plan.md)
- [Estructura de Tareas](.claude/project-state/task-structure.json)

## Contribución
Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guías de desarrollo.

## Licencia
MIT License - Ver [LICENSE](LICENSE) para más detalles.