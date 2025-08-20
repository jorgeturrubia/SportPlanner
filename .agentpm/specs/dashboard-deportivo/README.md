# Dashboard Deportivo - PlanSport

## Descripción General

Este spec define el sistema de dashboard post-login para la aplicación PlanSport, una plataforma de planificación deportiva para equipos de fútbol, baloncesto, balonmano y otros deportes de equipo.

## Objetivos

- Crear un dashboard diferenciado de la landing page con navegación específica para usuarios autenticados
- Implementar un header con logo, toggle de tema (dark/light) y menú de usuario
- Desarrollar una barra lateral colapsible con navegación principal
- Crear sistema de gestión de equipos (crear, editar, eliminar, listar)
- Establecer una experiencia UX/UI moderna y funcional para entrenadores y gestores deportivos

## Contexto del Proyecto

**Tipo de aplicación:** Planificación deportiva para equipos
**Stack tecnológico:** Angular 20.1.0, TailwindCSS 4.1.12, Lucide Icons
**Usuarios objetivo:** Entrenadores, gestores deportivos, coordinadores de equipos
**Deportes soportados:** Fútbol, baloncesto, balonmano y otros deportes de equipo

## Módulos Incluidos

1. **Header Dashboard** - Navegación superior post-login
2. **Sidebar Navigation** - Menú lateral colapsible
3. **Theme Toggle** - Cambio entre tema claro y oscuro
4. **User Menu** - Perfil de usuario y logout
5. **Teams Management** - CRUD completo de equipos
6. **Teams List View** - Vista de equipos en cards interactivas

## Dependencias

- Sistema de autenticación (debe estar implementado)
- Routing de Angular configurado
- TailwindCSS configurado
- Lucide Icons disponible

## Orden de Implementación Recomendado

1. Header Dashboard y estructura base
2. Sidebar Navigation
3. Theme Toggle
4. User Menu
5. Teams Management (CRUD)
6. Teams List View