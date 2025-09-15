# Documentación - Sistema de Suscripciones

## Resumen de la Implementación

Se ha implementado un sistema completo de suscripciones para SportPlanner que permite a los usuarios elegir entre diferentes planes de suscripción y deportes. El sistema incluye validación de suscripción activa para acceder al dashboard.

## Arquitectura General

### Backend (ASP.NET Core)

#### 1. Modelos de Datos
- **Subscription**: Define los planes de suscripción disponibles (Gratuita, Entrenador, Club)
- **UserSubscription**: Relaciona usuarios con suscripciones y deportes
- **SportType**: Enum con 11 tipos de deportes soportados

#### 2. DTOs (Data Transfer Objects)
- **CreateSubscriptionRequest**: Para crear nuevas suscripciones
- **UpdateSubscriptionRequest**: Para actualizar suscripciones existentes
- **SubscriptionResponse**: Respuesta con información de suscripción
- **UserSubscriptionStatusResponse**: Estado completo de suscripciones del usuario
- **AvailableSubscriptionResponse**: Planes de suscripción disponibles
- **SportTypeResponse**: Tipos de deportes con nombres y descripciones

#### 3. Servicios
- **ISubscriptionService**: Interfaz del servicio de suscripciones
- **SubscriptionService**: Implementación con lógica de negocio:
  - Gestión de suscripciones activas
  - Creación, actualización y cancelación de suscripciones
  - Verificación de acceso al dashboard
  - Obtención de tipos de deportes

#### 4. Controlador API
- **SubscriptionController**: Endpoints RESTful:
  - `GET /api/subscription/status` - Obtener estado de suscripción
  - `GET /api/subscription/available` - Obtener planes disponibles
  - `GET /api/subscription/sport-types` - Obtener tipos de deportes
  - `GET /api/subscription` - Obtener suscripciones del usuario
  - `POST /api/subscription` - Crear nueva suscripción
  - `PUT /api/subscription/{id}` - Actualizar suscripción
  - `POST /api/subscription/{id}/cancel` - Cancelar suscripción
  - `GET /api/subscription/can-access-dashboard` - Verificar acceso

#### 5. Base de Datos
- **Migración**: `AddSportFieldToUserSubscription`
  - Añade campo `Sport` a tabla `UserSubscriptions`
  - Configuración como enum con conversión a int

### Frontend (Angular)

#### 1. Modelos TypeScript
- **subscription.model.ts**: Interfaces y enums que reflejan los modelos del backend
- **SportType**: Enum con tipos de deportes
- **SubscriptionType**: Enum con tipos de suscripción

#### 2. Servicios
- **SubscriptionService**: Servicio con signals para gestión reactiva:
  - `getSubscriptionStatus()` - Obtener estado de suscripción
  - `getAvailableSubscriptions()` - Obtener planes disponibles
  - `getSportTypes()` - Obtener tipos de deportes
  - `createSubscription()` - Crear suscripción
  - `updateSubscription()` - Actualizar suscripción
  - `cancelSubscription()` - Cancelar suscripción
  - `canAccessDashboard()` - Verificar acceso
  - Signals reactivos para estado de carga, errores y datos

#### 3. Guards
- **subscriptionGuard**: Verifica suscripción activa para acceder a rutas protegidas
- **noSubscriptionGuard**: Permite acceso solo si no hay suscripción activa

#### 4. Componentes
- **SubscriptionComponent**: Página completa de suscripciones:
  - Visualización de planes disponibles con características
  - Selección de deporte con iconos y descripciones
  - Manejo de estados (carga, error, éxito)
  - Diseño responsive con Tailwind CSS
  - Indicador visual de plan popular
  - Mensaje para usuarios con suscripción activa

#### 5. Rutas
- `/subscription` - Página de suscripciones (requiere auth, sin suscripción)
- `/dashboard` - Dashboard (requiere auth y suscripción activa)
- Redirección automática después de login/registro basada en estado de suscripción

## Flujo de Usuario

### 1. Registro/Login
1. Usuario se registra o inicia sesión
2. Sistema verifica automáticamente si tiene suscripción activa
3. Redirección:
   - **Sin suscripción**: `/subscription`
   - **Con suscripción**: `/dashboard`

### 2. Selección de Suscripción
1. Usuario ve 3 planes: Gratuita, Entrenador, Club
2. Plan "Entrenador" marcado como "POPULAR"
3. Cada plan muestra:
   - Precio (Gratis, €29.99/mes, €99.99/mes)
   - Características (equipos, sesiones, conceptos, etc.)
   - Descripción del plan

### 3. Selección de Deporte
1. Después de seleccionar plan, usuario elige deporte
2. 11 deportes disponibles con iconos y descripciones
3. Selección visual con estados hover y seleccionado

### 4. Creación de Suscripción
1. Botón "Crear Suscripción" habilitado solo con plan y deporte seleccionados
2. Confirmación visual durante creación
3. Redirección automática a dashboard después de éxito
4. Notificaciones de éxito/error

### 5. Acceso al Dashboard
- **Guard**: Verifica suscripción activa antes de permitir acceso
- **Redirección automática** a página de suscripciones si no tiene suscripción
- **Verificación en tiempo real** del estado de suscripción

## Características Técnicas

### Backend
- **Entity Framework Core** con PostgreSQL
- **Migraciones automáticas** para cambios en esquema
- **Validación de modelos** con Data Annotations
- **Manejo de errores** centralizado
- **Logging** con ILogger
- **Inyección de dependencias** configurada

### Frontend
- **Angular 17+** con signals reactivos
- **Tailwind CSS** para estilos responsive
- **RxJS** para manejo de operaciones asíncronas
- **Guards de ruta** para protección de acceso
- **Servicios con estado reactivo** usando signals
- **Componentes standalone** para mejor rendimiento
- **Manejo de errores** con notificaciones visuales

### Seguridad
- **JWT Authentication** integrado con sistema existente
- **Autorización basada en roles** y suscripciones
- **Validación de datos** en frontend y backend
- **Protección de rutas** con guards
- **Sanitización de entradas** para prevenir XSS

## Planes de Suscripción

### 1. Gratuita (Free)
- **Precio**: Gratis
- **Equipos**: 1 equipo
- **Sesiones**: 15 sesiones
- **Conceptos personalizados**: No
- **Itinerarios**: No
- **Modo director**: No

### 2. Entrenador (Coach) - POPULAR
- **Precio**: €29.99/mes
- **Equipos**: 5 equipos
- **Sesiones**: Ilimitadas
- **Conceptos personalizados**: Sí
- **Itinerarios**: Sí
- **Modo director**: No

### 3. Club (Club)
- **Precio**: €99.99/mes
- **Equipos**: Ilimitados
- **Sesiones**: Ilimitadas
- **Conceptos personalizados**: Sí
- **Itinerarios**: Sí
- **Modo director**: Sí

## Deportes Soportados

1. **Fútbol** - Deporte de equipo jugado con los pies
2. **Baloncesto** - Deporte de equipo jugado con las manos
3. **Tenis** - Deporte de raqueta individual o por parejas
4. **Voleibol** - Deporte de equipo con red
5. **Rugby** - Deporte de contacto con oval
6. **Balonmano** - Deporte de equipo en pista
7. **Hockey** - Deporte con stick y puck
8. **Béisbol** - Deporte de bate y pelota
9. **Natación** - Deporte acuático competitivo
10. **Atletismo** - Deportes de pista y campo
11. **Otro** - Otros deportes

## Estados y Manejo de Errores

### Estados de Carga
- **Loading**: Indicador visual durante operaciones asíncronas
- **Error**: Mensajes de error con opción de reintentar
- **Success**: Notificaciones de operaciones exitosas

### Manejo de Errores
- **Backend**: Validación de modelos, manejo de excepciones
- **Frontend**: Catch de errores HTTP, notificaciones visuales
- **Base de Datos**: Transacciones, manejo de restricciones

## Pruebas y Validación

### Backend
- ✅ Compilación exitosa
- ✅ Migraciones generadas correctamente
- ✅ Servicios inyectados y configurados
- ✅ Endpoints API definidos y documentados

### Frontend
- ✅ Compilación exitosa (con advertencias de configuración)
- ✅ Componentes creados con signals reactivos
- ✅ Guards implementados para protección de rutas
- ✅ Diseño responsive con Tailwind CSS
- ✅ Manejo de estados y errores

## Mejoras Futuras

1. **Pasarela de Pago**: Integración con Stripe/PayPal para pagos reales
2. **Períodos de Prueba**: Ofrecer período de prueba para planes pagos
3. **Descuentos**: Sistema de descuentos por pago anual
4. **Estadísticas**: Dashboard de uso de suscripciones
5. **Notificaciones**: Email recordatorio de renovación
6. **Cancelación Programada**: Permitir cancelación al final del período
7. **Actualización de Plan**: Cambio entre planes con prorateo
8. **Múltiples Deportes**: Permitir suscripciones para múltiples deportes

## Conclusión

El sistema de suscripciones ha sido implementado exitosamente con una arquitectura robusta y escalable. Proporciona una experiencia de usuario fluida con validación adecuada y protección de rutas. El sistema está listo para producción y puede extenderse fácilmente con funcionalidades adicionales.
