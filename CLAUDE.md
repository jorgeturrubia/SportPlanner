# PlanSport - Sistema de Gestión Deportiva

## Stack Tecnológico
- **Frontend**: Angular 20 (standalone components, signals, modern control flow)
- **Backend**: .NET 8 (minimal APIs, dependency injection)
- **Database**: Supabase (PostgreSQL, RLS, real-time)
- **Styling**: Tailwind CSS v4 (modern syntax, responsive design)
- **Icons**: Hero Icons (SVG implementation)

## Agentes Especializados Disponibles

### 🎯 stack-coordinator
Coordinador principal que orquesta todo el workflow y delega a agentes especializados.

### 📱 angular-specialist
Experto en Angular 20 con standalone components, signals y control flow moderno (@if/@for).

### 🔧 api-architect
Especialista en .NET 8 minimal APIs con integración a Supabase.

### 🔗 integration-validator
Valida la integración end-to-end entre frontend, backend y base de datos.

### 🗄️ supabase-manager
Gestiona esquemas de base de datos, RLS policies y subscripciones real-time.

### 🎨 ui-designer
Experto en Tailwind CSS v4, Hero Icons y diseño responsive moderno.

## Comandos Disponibles

### Desarrollo
- `/init-stack [nombre]` - Inicializar proyecto completo
- `/create-feature [nombre] [descripción]` - Crear feature completa
- `/validate-stack` - Validar compatibilidad integral
- `/fix-integration` - Debug de problemas de integración
- `/stack-status` - Estado completo del sistema

## Estándares de Desarrollo

### Angular 20
- ✅ Componentes standalone únicamente
- ✅ Signals para manejo de estado
- ✅ Control flow moderno (@if/@for/@switch)
- ✅ Formularios tipados y reactivos
- ✅ Lazy loading con loadComponent
- ✅ OnPush change detection

### .NET 8
- ✅ Minimal APIs exclusivamente
- ✅ Dependency injection pattern
- ✅ Manejo global de excepciones
- ✅ Validación con FluentValidation
- ✅ Logging estructurado
- ✅ Configuración por ambientes

### Supabase
- ✅ Row Level Security en todas las tablas
- ✅ Constraints y validaciones apropiadas
- ✅ Índices en foreign keys
- ✅ Triggers para updated_at
- ✅ Funciones PostgreSQL para lógica compleja
- ✅ Real-time solo en tablas necesarias

### Tailwind CSS v4
- ✅ Sintaxis moderna v4
- ✅ Diseño mobile-first
- ✅ Dark mode support
- ✅ Hero Icons como SVG inline
- ✅ Accessibility-first
- ✅ Utilidades de performance

## Integración y Compatibilidad

### Puntos Críticos
- Los nombres de componentes Angular deben coincidir con rutas de API
- Los modelos de datos deben estar sincronizados entre frontend/backend
- CORS configurado para localhost:4200
- Variables de ambiente para todas las URLs externas
- Manejo de errores comprehensivo en todas las capas

### Validaciones Automáticas
- ❌ Bloquea uso de NgModules en lugar de standalone
- ❌ Previene sintaxis de Tailwind CSS v3 en proyecto v4
- ❌ Detecta URLs hardcodeadas sin configuración de ambiente
- ❌ Identifica falta de políticas RLS en tablas
- ❌ Valida patrones async/await incorrectos

## Flujo de Desarrollo Típico

1. **Inicialización**: `/init-stack plansport`
2. **Desarrollo**: `/create-feature user-management "Gestión completa de usuarios"`
3. **Validación**: `/validate-stack`
4. **Debug**: `/fix-integration` (si es necesario)
5. **Estado**: `/stack-status`

## Principios de Calidad

- **Automatización**: Hooks validan todo automáticamente
- **Consistencia**: Estándares forzados por agentes especializados
- **Performance**: Optimizaciones en cada capa del stack
- **Seguridad**: RLS, validación de input, CORS apropiado
- **Mantenibilidad**: Código limpio y bien documentado
- **Escalabilidad**: Arquitectura modular y extensible

¡El sistema está listo para acelerar tu desarrollo con máxima calidad y consistencia! 🚀
