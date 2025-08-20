# 📋 Tasks - Módulo de Autenticación PlanSport

> Checklist detallado para la implementación completa del sistema de autenticación con Angular 20, Tailwind CSS 4.1 y backend .NET ya existente.

---

## 🎯 Resumen del Proyecto

**Objetivo**: Implementar un sistema de autenticación completo con página `/auth` que incluya login/registro por tabs, redirección automática al dashboard, manejo de tokens y experiencia de usuario optimizada.

**Tecnologías**: Angular 20 (Standalone Components), Tailwind CSS 4.1, Lucide Angular, Signals, Backend .NET ya implementado.

**Estimación Total**: 40 horas (3 sprints)

---

## 🚀 Sprint 1: Fundamentos y Autenticación Básica (16h)

### 📱 1. Configuración Base del Módulo
- [x] **1.1** Crear estructura de carpetas del módulo auth
  - [x] `src/app/features/auth/`
  - [x] `src/app/features/auth/components/`
  - [x] `src/app/features/auth/services/`
  - [x] `src/app/features/auth/models/`
  - [x] `src/app/features/auth/guards/`
  - [x] `src/app/features/auth/validators/`
- [x] **1.2** Configurar rutas de autenticación
  - [x] Ruta `/auth` con componente principal
  - [x] Redirección desde `/login` y `/register` a `/auth`
  - [x] Configurar lazy loading del módulo
- [x] **1.3** Configurar interceptores HTTP
  - [x] Interceptor para agregar token automáticamente
  - [x] Interceptor para manejo de errores 401/403
  - [x] Interceptor para refresh token automático

**Tiempo estimado**: 4 horas

### 🔐 2. Modelos y Servicios Core
- [x] **2.1** Crear interfaces TypeScript
  - [x] `AuthUser` (basado en UserDto del backend)
  - [x] `LoginRequest` y `LoginResponse`
  - [x] `RegisterRequest` y `RegisterResponse`
  - [x] `AuthState` para manejo de estado
- [x] **2.2** Implementar AuthService
  - [x] Métodos login(), register(), logout()
  - [x] Método refreshToken() automático
  - [x] Método getCurrentUser()
  - [x] Manejo de localStorage para tokens
  - [x] Integración con backend API existente
- [x] **2.3** Implementar TokenService
  - [x] Almacenamiento seguro de tokens
  - [x] Validación de expiración
  - [x] Limpieza automática de tokens expirados

**Tiempo estimado**: 6 horas

### 🎨 3. Componente Principal de Autenticación
- [x] **3.1** Crear AuthPageComponent (Standalone)
  - [x] Estructura base con tabs (Login/Registro)
  - [x] Navegación entre tabs con estado
  - [x] Aplicar design system (colores verdes, tipografía Inter)
  - [x] Layout responsive optimizado para desktop
- [x] **3.2** Implementar sistema de tabs
  - [x] Tab activo con indicador visual
  - [x] Transiciones suaves entre tabs
  - [x] Mantener estado del formulario al cambiar tabs
- [x] **3.3** Integrar con router
  - [x] Query params para tab activo (?tab=login|register)
  - [x] Navegación programática
  - [x] Breadcrumbs y título dinámico

**Tiempo estimado**: 6 horas

---

## 🔑 Sprint 2: Formularios y Validación (14h)

### 📝 4. Formulario de Login
- [x] **4.1** Crear LoginFormComponent (Standalone)
  - [x] Reactive Forms con FormBuilder
  - [x] Campos: email, password
  - [x] Validaciones en tiempo real
  - [x] Aplicar estilos del design system
- [x] **4.2** Implementar validaciones
  - [x] Email válido y requerido
  - [x] Password mínimo 6 caracteres
  - [x] Mensajes de error personalizados
  - [x] Estados visuales (error, success, loading)
- [x] **4.3** Funcionalidad de login
  - [x] Integración con AuthService
  - [x] Loading state durante petición
  - [x] Manejo de errores del servidor
  - [x] Redirección automática al dashboard
- [x] **4.4** Características adicionales
  - [x] Checkbox "Recordarme"
  - [x] Link "¿Olvidaste tu contraseña?"
  - [x] Mostrar/ocultar contraseña

**Tiempo estimado**: 6 horas

### 📋 5. Formulario de Registro
- [x] **5.1** Crear RegisterFormComponent (Standalone)
  - [x] Reactive Forms con validaciones complejas
  - [x] Campos: fullName, email, password, confirmPassword
  - [x] Integración con design system
- [x] **5.2** Validaciones avanzadas
  - [x] Nombre completo (mínimo 2 palabras)
  - [x] Email único (validación asíncrona)
  - [x] Password seguro (mayúscula, minúscula, número)
  - [x] Confirmación de password coincidente
  - [x] Términos y condiciones (checkbox requerido)
- [x] **5.3** Funcionalidad de registro
  - [x] Integración con AuthService
  - [x] Manejo de errores específicos (email duplicado, etc.)
  - [x] Confirmación de registro exitoso
  - [x] Auto-login después del registro
- [x] **5.4** UX mejorada
  - [x] Indicador de fortaleza de contraseña
  - [x] Validación en tiempo real con debounce
  - [x] Mensajes de ayuda contextuales

**Tiempo estimado**: 8 horas

---

## 🛡️ Sprint 3: Seguridad y Experiencia Avanzada (10h)

### 🔒 6. Guards y Protección de Rutas
- [x] **6.1** Crear AuthGuard
  - [x] Verificar token válido
  - [x] Redireccionar a /auth si no autenticado
  - [x] Permitir acceso a rutas públicas
- [x] **6.2** Crear GuestGuard
  - [x] Redireccionar a dashboard si ya autenticado
  - [x] Aplicar a rutas de auth
- [x] **6.3** Implementar RoleGuard
  - [x] Verificar roles de usuario
  - [x] Manejo de permisos por organización
  - [x] Redirección a página de acceso denegado

**Tiempo estimado**: 4 horas

### 🎯 7. Funcionalidades Avanzadas
- [x] **7.1** Recuperación de contraseña
  - [x] Modal/página para solicitar reset
  - [x] Integración con endpoint forgot-password
  - [x] Confirmación de email enviado
- [x] **7.2** Manejo de tokens automático
  - [x] Refresh token antes de expiración
  - [x] Logout automático si refresh falla
  - [x] Notificación de sesión expirada
- [x] **7.3** Estados de carga y feedback
  - [x] Skeleton loaders en formularios
  - [x] Toasts para notificaciones
  - [x] Animaciones de transición

**Tiempo estimado**: 4 horas

### 🔗 8. Integración con Landing Page
- [x] **8.1** Modificar landing page
  - [x] Agregar botones "Iniciar Sesión" y "Registrarse"
  - [x] Links que redirijan a `/auth?tab=login` y `/auth?tab=register`
  - [x] Mantener diseño consistente
- [x] **8.2** Navegación global
  - [x] Header con estado de autenticación
  - [x] Menú de usuario autenticado
  - [x] Logout desde cualquier página

**Tiempo estimado**: 2 horas

---

## 🧪 Testing y Calidad

### ✅ 9. Testing Unitario
- [ ] **9.1** Tests de servicios
  - [ ] AuthService: login, register, logout
  - [ ] TokenService: almacenamiento, validación
  - [ ] Guards: AuthGuard, GuestGuard
- [ ] **9.2** Tests de componentes
  - [ ] AuthPageComponent: navegación tabs
  - [ ] LoginFormComponent: validaciones, submit
  - [ ] RegisterFormComponent: validaciones complejas
- [ ] **9.3** Tests de integración
  - [ ] Flujo completo de login
  - [ ] Flujo completo de registro
  - [ ] Manejo de errores del servidor

### 🔍 10. Testing E2E
- [ ] **10.1** Cypress tests
  - [ ] Navegación a página de auth
  - [ ] Login exitoso y redirección
  - [ ] Registro exitoso y auto-login
  - [ ] Manejo de errores de validación
  - [ ] Protección de rutas

---

## 📱 Responsive y Accesibilidad

### 📐 11. Responsive Design
- [ ] **11.1** Mobile (320px - 767px)
  - [ ] Formularios stack verticalmente
  - [ ] Botones full-width
  - [ ] Espaciado optimizado para touch
- [ ] **11.2** Tablet (768px - 1023px)
  - [ ] Layout centrado con max-width
  - [ ] Formularios con padding lateral
- [ ] **11.3** Desktop (1024px+)
  - [ ] Layout optimizado como especificado
  - [ ] Hover states en botones
  - [ ] Focus states mejorados

### ♿ 12. Accesibilidad
- [ ] **12.1** Navegación por teclado
  - [ ] Tab order lógico
  - [ ] Focus visible en todos los elementos
  - [ ] Escape para cerrar modales
- [ ] **12.2** Screen readers
  - [ ] Labels apropiados en formularios
  - [ ] ARIA attributes donde necesario
  - [ ] Mensajes de error anunciados
- [ ] **12.3** Contraste y colores
  - [ ] Verificar contraste mínimo WCAG AA
  - [ ] No depender solo del color para información
  - [ ] Modo alto contraste compatible

---

## 🚀 Deployment y Optimización

### ⚡ 13. Performance
- [ ] **13.1** Lazy loading
  - [ ] Módulo auth cargado solo cuando necesario
  - [ ] Componentes con OnPush strategy
- [ ] **13.2** Bundle optimization
  - [ ] Tree shaking de librerías no usadas
  - [ ] Minificación de CSS/JS
  - [ ] Compresión gzip habilitada

### 🔧 14. Configuración de Producción
- [ ] **14.1** Variables de entorno
  - [ ] API URLs por ambiente
  - [ ] Configuración de tokens
  - [ ] Feature flags si necesario
- [ ] **14.2** Seguridad
  - [ ] CSP headers configurados
  - [ ] HTTPS enforced
  - [ ] Tokens en httpOnly cookies (si aplicable)

---

## 📊 Métricas y Monitoreo

### 📈 15. Analytics
- [ ] **15.1** Eventos de autenticación
  - [ ] Login exitoso/fallido
  - [ ] Registro exitoso/fallido
  - [ ] Tiempo en formularios
- [ ] **15.2** Métricas de UX
  - [ ] Tasa de conversión login/registro
  - [ ] Abandono en formularios
  - [ ] Errores más comunes

---

## ✅ Checklist Final de Entrega

### 🎯 Funcionalidades Core
- [ ] ✅ Página `/auth` con tabs login/registro
- [ ] ✅ Redirección automática al dashboard tras login/registro
- [ ] ✅ Notificaciones de error en caso de fallo
- [ ] ✅ Manejo de tokens existentes (acceso directo al dashboard)
- [ ] ✅ Control robusto de expiración de tokens
- [ ] ✅ Botones en landing page que redirijan a `/auth`

### 🎨 Design System
- [ ] ✅ Colores verdes suaves implementados
- [ ] ✅ Tipografía Inter aplicada
- [ ] ✅ Espaciado consistente (sistema 4px)
- [ ] ✅ Componentes responsive
- [ ] ✅ Estados interactivos (hover, focus, loading)

### 🔒 Seguridad
- [ ] ✅ Guards protegiendo rutas privadas
- [ ] ✅ Interceptores manejando tokens automáticamente
- [ ] ✅ Refresh token implementado
- [ ] ✅ Logout seguro limpiando estado

### 📱 Experiencia de Usuario
- [ ] ✅ Formularios con validación en tiempo real
- [ ] ✅ Loading states durante peticiones
- [ ] ✅ Mensajes de error claros y útiles
- [ ] ✅ Navegación intuitiva entre tabs
- [ ] ✅ Responsive design optimizado

### 🧪 Calidad
- [ ] ✅ Tests unitarios > 80% cobertura
- [ ] ✅ Tests E2E para flujos principales
- [ ] ✅ Accesibilidad WCAG AA
- [ ] ✅ Performance optimizada

---

## 📝 Notas de Implementación

### 🔧 Consideraciones Técnicas
- **Standalone Components**: Usar exclusivamente componentes standalone de Angular 20
- **Signals**: Implementar estado reactivo con Angular Signals
- **Tailwind CSS 4.1**: Usar sistema `@theme` para personalización
- **Backend Integration**: API .NET ya implementada, solo necesita integración frontend

### 🎯 Prioridades
1. **Alta**: Funcionalidades core de autenticación
2. **Media**: UX avanzada y validaciones
3. **Baja**: Analytics y optimizaciones avanzadas

### ⚠️ Riesgos y Mitigaciones
- **Riesgo**: Incompatibilidad con API backend
  - **Mitigación**: Revisar DTOs y endpoints antes de implementar
- **Riesgo**: Problemas de CORS en desarrollo
  - **Mitigación**: Configurar proxy en angular.json
- **Riesgo**: Tokens expirando inesperadamente
  - **Mitigación**: Implementar refresh automático con margen de seguridad

---

## 🎉 Criterios de Éxito

### 📊 Métricas Objetivo
- **Tiempo de carga**: < 2 segundos para página auth
- **Tasa de conversión**: > 85% completación de formularios
- **Errores de usuario**: < 5% en validaciones
- **Accesibilidad**: 100% WCAG AA compliance
- **Performance**: Lighthouse score > 90

### ✅ Validación Final
- [ ] Usuario puede registrarse exitosamente
- [ ] Usuario puede hacer login exitosamente
- [ ] Redirección automática funciona correctamente
- [ ] Tokens se manejan automáticamente
- [ ] Experiencia mobile es fluida
- [ ] Todos los tests pasan
- [ ] No hay errores de consola
- [ ] Performance es óptima

---

*📋 Checklist creado para PlanSport - Módulo de Autenticación*
*Actualizado: Enero 2025*
*Estimación total: 40 horas en 3 sprints*