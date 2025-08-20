# Spec de Autenticación - PlanSport

## 🎯 Objetivo

Implementar un sistema completo de autenticación para PlanSport que incluya:
- Página de autenticación con tabs de Login/Register
- Gestión completa de tokens JWT
- Protección de rutas y redirecciones automáticas
- Integración con el backend Supabase existente

## 📋 Descripción General

Este spec define la implementación del sistema de autenticación frontend que se integrará con la API backend ya desarrollada. El sistema manejará:

### Flujos Principales:
1. **Landing Page**: Botones Login/Register redirigen a `/auth`
2. **Página Auth**: Tabs intercambiables entre Login y Register
3. **Login Exitoso**: Redirección automática a Dashboard
4. **Register Exitoso**: Redirección automática a Dashboard
5. **Token Válido**: Acceso directo a Dashboard desde Landing
6. **Protección de Rutas**: Verificación automática en todas las páginas del Dashboard

### Características Técnicas:
- **Framework**: Angular 20 con Standalone Components
- **Styling**: Tailwind CSS 4.1
- **Icons**: Lucide Angular
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient con interceptors
- **Routing**: Angular Router con guards

## 🔗 Backend API Disponible

La API backend ya está implementada con los siguientes endpoints:

### Endpoints de Autenticación:
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/verify` - Verificar token actual

### Endpoints de Perfil:
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

### Endpoints de Recuperación:
- `POST /api/auth/forgot-password` - Solicitar reset
- `POST /api/auth/reset-password` - Resetear contraseña
- `POST /api/auth/verify-email` - Verificar email

## 🎨 Componentes a Desarrollar

1. **AuthPage Component** - Página principal con tabs
2. **LoginForm Component** - Formulario de inicio de sesión
3. **RegisterForm Component** - Formulario de registro
4. **AuthService** - Servicio de autenticación
5. **AuthGuard** - Guard para proteger rutas
6. **AuthInterceptor** - Interceptor para tokens
7. **TokenService** - Gestión de tokens y expiración

## 🔄 Estados de la Aplicación

### Usuario No Autenticado:
- Landing Page muestra botones "Login" y "Register"
- Acceso solo a páginas públicas
- Redirección automática a `/auth` al intentar acceder al Dashboard

### Usuario Autenticado:
- Landing Page muestra botón "Dashboard"
- Acceso completo a todas las funcionalidades
- Verificación automática de token en cada navegación
- Logout automático si el token expira

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Breakpoints**: Siguiendo el sistema de Tailwind CSS
- **Touch Friendly**: Botones y elementos táctiles apropiados

## 🔒 Seguridad

- **JWT Tokens**: Almacenamiento seguro en localStorage
- **Token Refresh**: Renovación automática antes de expiración
- **Route Guards**: Protección de rutas sensibles
- **HTTP Interceptors**: Inyección automática de headers de autorización
- **Logout Automático**: En caso de token inválido o expirado

## 📊 Métricas de Éxito

- Tiempo de carga de la página de auth < 2 segundos
- Flujo de login/register sin errores
- Transiciones suaves entre estados
- Manejo correcto de errores de red
- Experiencia de usuario intuitiva

---

**Fecha de Creación**: $(date)
**Stack**: Angular 20 + Tailwind CSS + Supabase
**Prioridad**: Alta
**Dependencias**: Backend API (✅ Implementado)