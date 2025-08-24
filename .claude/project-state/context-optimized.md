# SportPlanner - Contexto Optimizado del Proyecto

## Resumen Ejecutivo
Aplicación web para planificación deportiva que permite a entrenadores crear, compartir y gestionar planificaciones, entrenamientos y ejercicios con sistema de valoraciones y marketplace.

## Funcionalidades Clave

### 1. Autenticación y Suscripciones
- **Supabase Auth**: Sistema de autenticación
- **Gratuita (€0)**: 1 equipo, 15 entrenamientos
- **Entrenador**: Acceso completo, entrenamientos ilimitados
- **Club**: Gestión múltiples equipos, modo director

### 2. Estructura de Datos Principal
```
Usuario → Suscripción → Organización → Equipos → Planificaciones
                                    ↓
                              Entrenamientos → Ejercicios → Conceptos
```

### 3. Entidades Core
- **Equipos**: Género, categoría edad, nivel (A/B/C)
- **Conceptos**: Categoría/subcategoría, dificultad, tiempo aprendizaje
- **Planificaciones**: Fecha inicio/fin, días semana, horarios
- **Entrenamientos**: Fecha, lugar, ejercicios vinculados
- **Itinerarios**: Conjuntos predefinidos de conceptos

### 4. Características Especiales
- **Marketplace**: Compartir/importar planificaciones (valoración 1-5 estrellas)
- **Vista dinámica**: Cronómetro para seguimiento entrenamientos
- **Informes**: Porcentajes objetivos, progreso planificado vs ejecutado
- **Calendario**: Entrenamientos futuros/pasados (solo futuros editables)
- **Visibilidad**: Bit para ocultar equipos/planificaciones antiguas

## Stack Tecnológico Definido
- **Frontend**: Angular 20 + Tailwind CSS v4
- **Backend**: .NET 8 + Entity Framework Core
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth + JWT

## Flujo de Usuario Optimizado
1. Registro → Selección suscripción
2. Crear equipo → Asignar itinerario (opcional)
3. Generación automática entrenamientos
4. Ejecución con vista dinámica + cronómetro

## Reglas de Negocio Críticas
- Multi-usuario sin compartir conceptos personalizados
- Máximo 1 suscripción no gratuita por usuario
- Usuarios sin suscripción pueden ser añadidos por administradores
- Roles: Administrador, Director, Entrenador
- Permisos por equipo individuales

---
**Tokens Originales**: ~2800
**Tokens Optimizados**: ~800
**Reducción**: 71%