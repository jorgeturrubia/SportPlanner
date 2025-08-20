# User Stories - Sistema de Autenticación

## 🎭 Personas

### Usuario Nuevo
- **Descripción**: Persona que visita PlanSport por primera vez
- **Objetivos**: Registrarse y comenzar a usar la aplicación
- **Conocimientos**: Básicos de aplicaciones web

### Usuario Registrado
- **Descripción**: Persona que ya tiene cuenta en PlanSport
- **Objetivos**: Acceder rápidamente a su dashboard
- **Conocimientos**: Familiarizado con la aplicación

### Usuario Móvil
- **Descripción**: Usuario que accede principalmente desde dispositivos móviles
- **Objetivos**: Experiencia fluida en pantallas pequeñas
- **Conocimientos**: Uso habitual de apps móviles

---

## 📱 Epic: Acceso a la Aplicación

### US-001: Navegación desde Landing Page
**Como** usuario visitante  
**Quiero** ver botones claros de "Iniciar Sesión" y "Registrarse" en la landing page  
**Para** poder acceder fácilmente al sistema de autenticación  

**Criterios de Aceptación:**
- [ ] Los botones están visibles en la landing page
- [ ] Al hacer clic en "Iniciar Sesión" redirijo a `/auth?tab=login`
- [ ] Al hacer clic en "Registrarse" redirijo a `/auth?tab=register`
- [ ] Los botones son responsive y táctiles en móvil
- [ ] Si ya estoy autenticado, veo un botón "Dashboard" en lugar de login/register

**Estimación:** 2 horas

---

### US-002: Página de Autenticación con Tabs
**Como** usuario  
**Quiero** una página de autenticación con tabs intercambiables  
**Para** poder elegir entre iniciar sesión o registrarme sin cambiar de página  

**Criterios de Aceptación:**
- [ ] La página `/auth` muestra tabs "Iniciar Sesión" y "Registrarse"
- [ ] Puedo cambiar entre tabs sin recargar la página
- [ ] El tab activo se mantiene según el parámetro URL `?tab=login|register`
- [ ] El diseño es responsive y funciona en móvil
- [ ] Animaciones suaves entre cambios de tab

**Estimación:** 3 horas

---

## 🔐 Epic: Inicio de Sesión

### US-003: Formulario de Login
**Como** usuario registrado  
**Quiero** un formulario de login intuitivo y seguro  
**Para** acceder rápidamente a mi cuenta  

**Criterios de Aceptación:**
- [ ] Campos: Email y Contraseña
- [ ] Validación en tiempo real (email válido, contraseña requerida)
- [ ] Botón "Iniciar Sesión" deshabilitado hasta que el form sea válido
- [ ] Opción "Recordar sesión" (checkbox)
- [ ] Link "¿Olvidaste tu contraseña?"
- [ ] Mostrar/ocultar contraseña con ícono
- [ ] Loading state durante la petición

**Estimación:** 4 horas

---

### US-004: Login Exitoso
**Como** usuario registrado  
**Quiero** ser redirigido automáticamente al dashboard tras login exitoso  
**Para** comenzar a usar la aplicación inmediatamente  

**Criterios de Aceptación:**
- [ ] Tras login exitoso, redirección automática a `/dashboard`
- [ ] Token JWT almacenado de forma segura
- [ ] Información del usuario disponible en la aplicación
- [ ] Mensaje de bienvenida (toast/notification)
- [ ] Estado de autenticación actualizado globalmente

**Estimación:** 2 horas

---

### US-005: Manejo de Errores de Login
**Como** usuario  
**Quiero** recibir mensajes claros cuando hay errores en el login  
**Para** entender qué debo corregir  

**Criterios de Aceptación:**
- [ ] Credenciales incorrectas: "Email o contraseña incorrectos"
- [ ] Email no verificado: "Verifica tu email antes de continuar"
- [ ] Cuenta bloqueada: Mensaje específico con instrucciones
- [ ] Error de red: "Problema de conexión, intenta nuevamente"
- [ ] Los errores se muestran de forma no intrusiva
- [ ] Los errores desaparecen al corregir el campo

**Estimación:** 2 horas

---

## 📝 Epic: Registro de Usuario

### US-006: Formulario de Registro
**Como** usuario nuevo  
**Quiero** un formulario de registro completo pero simple  
**Para** crear mi cuenta rápidamente  

**Criterios de Aceptación:**
- [ ] Campos: Email, Contraseña, Confirmar Contraseña, Nombre Completo, Deporte
- [ ] Validación en tiempo real para todos los campos
- [ ] Contraseña segura (mínimo 8 caracteres, mayúscula, número)
- [ ] Confirmación de contraseña debe coincidir
- [ ] Checkbox "Acepto términos y condiciones" (requerido)
- [ ] Botón deshabilitado hasta que todo sea válido
- [ ] Dropdown para seleccionar deporte principal

**Estimación:** 5 horas

---

### US-007: Registro Exitoso
**Como** usuario nuevo  
**Quiero** ser redirigido al dashboard tras registro exitoso  
**Para** comenzar a usar la aplicación inmediatamente  

**Criterios de Aceptación:**
- [ ] Tras registro exitoso, redirección automática a `/dashboard`
- [ ] Token JWT almacenado automáticamente
- [ ] Perfil de usuario creado y disponible
- [ ] Mensaje de bienvenida personalizado
- [ ] Email de verificación enviado (opcional)

**Estimación:** 2 horas

---

## 🛡️ Epic: Protección de Rutas

### US-008: Acceso Directo con Token Válido
**Como** usuario autenticado  
**Quiero** acceder directamente al dashboard si tengo un token válido  
**Para** no tener que hacer login repetidamente  

**Criterios de Aceptación:**
- [ ] Al cargar la aplicación, verificar token automáticamente
- [ ] Si token es válido, mostrar botón "Dashboard" en landing
- [ ] Acceso directo a `/dashboard` sin pasar por `/auth`
- [ ] Información del usuario cargada automáticamente
- [ ] Funciona tras recargar la página o cerrar/abrir navegador

**Estimación:** 3 horas

---

### US-009: Protección del Dashboard
**Como** sistema  
**Quiero** verificar autenticación en todas las páginas del dashboard  
**Para** mantener la seguridad de la aplicación  

**Criterios de Aceptación:**
- [ ] Todas las rutas `/dashboard/*` requieren autenticación
- [ ] Si no hay token válido, redirección automática a `/auth`
- [ ] Verificación en cada cambio de ruta
- [ ] Manejo de tokens expirados
- [ ] Loading state durante verificación

**Estimación:** 4 horas

---

### US-010: Logout y Expiración de Token
**Como** usuario autenticado  
**Quiero** poder cerrar sesión y ser deslogueado automáticamente si mi token expira  
**Para** mantener la seguridad de mi cuenta  

**Criterios de Aceptación:**
- [ ] Botón "Cerrar Sesión" visible en el dashboard
- [ ] Al hacer logout, limpiar token y redirigir a landing
- [ ] Detección automática de token expirado
- [ ] Logout automático y notificación al usuario
- [ ] Refresh token automático antes de expiración

**Estimación:** 3 horas

---

## 🔄 Epic: Gestión de Tokens

### US-011: Renovación Automática de Tokens
**Como** usuario autenticado  
**Quiero** que mi sesión se mantenga activa automáticamente  
**Para** no ser interrumpido mientras uso la aplicación  

**Criterios de Aceptación:**
- [ ] Renovación automática del token antes de expirar
- [ ] Uso del refresh token para obtener nuevo access token
- [ ] Manejo de errores si el refresh token es inválido
- [ ] Proceso transparente para el usuario
- [ ] Fallback a logout si no se puede renovar

**Estimación:** 4 horas

---

## 📱 Epic: Experiencia Móvil

### US-012: Autenticación Responsive
**Como** usuario móvil  
**Quiero** una experiencia de autenticación optimizada para mi dispositivo  
**Para** poder usar la aplicación cómodamente desde mi teléfono  

**Criterios de Aceptación:**
- [ ] Formularios adaptados a pantallas pequeñas
- [ ] Botones con tamaño táctil apropiado (mínimo 44px)
- [ ] Teclado apropiado para cada campo (email, password)
- [ ] Navegación fluida entre campos
- [ ] Zoom automático deshabilitado en inputs
- [ ] Orientación portrait y landscape

**Estimación:** 3 horas

---

## 🎨 Epic: Experiencia de Usuario

### US-013: Feedback Visual y Estados
**Como** usuario  
**Quiero** recibir feedback visual claro sobre el estado de mis acciones  
**Para** entender qué está pasando en la aplicación  

**Criterios de Aceptación:**
- [ ] Loading spinners durante peticiones
- [ ] Estados de éxito con checkmarks o colores verdes
- [ ] Estados de error con colores rojos y íconos
- [ ] Transiciones suaves entre estados
- [ ] Notificaciones toast para acciones importantes
- [ ] Indicadores de progreso cuando sea apropiado

**Estimación:** 3 horas

---

## 📊 Resumen de Estimaciones

| Epic | User Stories | Tiempo Total |
|------|-------------|-------------|
| Acceso a la Aplicación | 2 | 5 horas |
| Inicio de Sesión | 3 | 8 horas |
| Registro de Usuario | 2 | 7 horas |
| Protección de Rutas | 3 | 10 horas |
| Gestión de Tokens | 1 | 4 horas |
| Experiencia Móvil | 1 | 3 horas |
| Experiencia de Usuario | 1 | 3 horas |
| **TOTAL** | **13** | **40 horas** |

---

## 🎯 Priorización

### Sprint 1 (MVP - 20 horas)
- US-001: Navegación desde Landing Page
- US-002: Página de Autenticación con Tabs
- US-003: Formulario de Login
- US-004: Login Exitoso
- US-006: Formulario de Registro
- US-007: Registro Exitoso

### Sprint 2 (Protección - 15 horas)
- US-008: Acceso Directo con Token Válido
- US-009: Protección del Dashboard
- US-010: Logout y Expiración de Token
- US-011: Renovación Automática de Tokens

### Sprint 3 (Polish - 5 horas)
- US-005: Manejo de Errores de Login
- US-012: Autenticación Responsive
- US-013: Feedback Visual y Estados