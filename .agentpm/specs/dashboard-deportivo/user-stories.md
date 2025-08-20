# User Stories - Dashboard Deportivo PlanSport

## Contexto de Usuarios

### **Personas Objetivo**
- **Entrenadores:** Gestionan equipos y planifican entrenamientos
- **Coordinadores Deportivos:** Supervisan múltiples equipos
- **Gestores de Club:** Administran la organización deportiva
- **Asistentes Técnicos:** Apoyan en la gestión de equipos

## Épicas Principales

### **Épica 1: Navegación y Acceso al Dashboard**
### **Épica 2: Gestión de Equipos**
### **Épica 3: Personalización de la Experiencia**
### **Épica 4: Administración de Perfil**

---

## Épica 1: Navegación y Acceso al Dashboard

### **US-001: Acceso al Dashboard Post-Login**
**Como** entrenador autenticado  
**Quiero** ser redirigido automáticamente al dashboard después del login  
**Para** acceder rápidamente a mis herramientas de gestión deportiva

**Criterios de Aceptación:**
- ✅ Después del login exitoso, soy redirigido a `/dashboard`
- ✅ El dashboard muestra un header diferente al de la landing page
- ✅ Veo mi información de usuario en el header
- ✅ El dashboard es responsive en desktop y mobile

**Definición de Terminado:**
- Routing configurado correctamente
- Guard de autenticación implementado
- Header del dashboard diferenciado
- Tests unitarios pasando

---

### **US-002: Navegación Principal con Sidebar**
**Como** usuario del dashboard  
**Quiero** tener una barra lateral con navegación clara  
**Para** acceder fácilmente a las diferentes secciones de la aplicación

**Criterios de Aceptación:**
- ✅ Veo una sidebar con las opciones: Inicio, Equipos
- ✅ Cada opción tiene un icono claro y descriptivo
- ✅ La opción activa se resalta visualmente
- ✅ La sidebar es colapsible para ahorrar espacio
- ✅ En mobile, la sidebar se adapta apropiadamente

**Definición de Terminado:**
- Componente SidebarComponent implementado
- Navegación funcional entre secciones
- Estados activos correctamente mostrados
- Responsive design funcionando

---

### **US-003: Colapso de Sidebar**
**Como** usuario del dashboard  
**Quiero** poder colapsar y expandir la barra lateral  
**Para** tener más espacio para el contenido principal cuando lo necesite

**Criterios de Aceptación:**
- ✅ Hay un botón para colapsar/expandir la sidebar
- ✅ Al colapsar, solo se muestran los iconos
- ✅ Al expandir, se muestran iconos y texto
- ✅ El estado se mantiene durante la sesión
- ✅ La transición es suave y visualmente agradable

**Definición de Terminado:**
- Animaciones de colapso implementadas
- Estado persistente en localStorage
- Transiciones CSS suaves
- Funcionalidad probada en diferentes tamaños de pantalla

---

## Épica 2: Gestión de Equipos

### **US-004: Visualización de Lista de Equipos**
**Como** entrenador  
**Quiero** ver todos mis equipos en una vista organizada  
**Para** tener una visión general de los equipos que gestiono

**Criterios de Aceptación:**
- ✅ Veo mis equipos en formato de cards atractivas
- ✅ Cada card muestra: nombre, deporte, categoría, número de jugadores
- ✅ Las cards tienen un diseño moderno y profesional
- ✅ Puedo ver el estado de carga mientras se cargan los equipos
- ✅ Si no tengo equipos, veo un mensaje apropiado con opción de crear

**Definición de Terminado:**
- Componente TeamsComponent implementado
- Componente TeamCardComponent creado
- Estados de loading y empty implementados
- Diseño responsive y atractivo

---

### **US-005: Creación de Nuevo Equipo**
**Como** entrenador  
**Quiero** crear un nuevo equipo desde el dashboard  
**Para** comenzar a gestionar un nuevo grupo deportivo

**Criterios de Aceptación:**
- ✅ Hay un botón "Crear Equipo" claramente visible
- ✅ Al hacer clic, se abre un modal con formulario
- ✅ El formulario incluye: nombre, deporte, categoría, descripción, color
- ✅ Hay validaciones apropiadas en todos los campos
- ✅ Puedo seleccionar el deporte de una lista predefinida
- ✅ Puedo elegir un color representativo para el equipo
- ✅ Al guardar, el equipo aparece inmediatamente en la lista

**Definición de Terminado:**
- Modal TeamModalComponent implementado
- Formulario reactivo con validaciones
- Integración con TeamsService
- Feedback visual de éxito/error

---

### **US-006: Edición de Equipo Existente**
**Como** entrenador  
**Quiero** editar la información de mis equipos  
**Para** mantener los datos actualizados y correctos

**Criterios de Aceptación:**
- ✅ Cada card de equipo tiene un botón de "Editar"
- ✅ Al hacer clic, se abre el mismo modal de creación pero con datos precargados
- ✅ Puedo modificar cualquier campo del equipo
- ✅ Los cambios se reflejan inmediatamente en la lista
- ✅ Hay confirmación visual de que los cambios se guardaron

**Definición de Terminado:**
- Modal reutilizado para edición
- Precarga de datos funcionando
- Actualización optimista en la UI
- Manejo de errores implementado

---

### **US-007: Eliminación de Equipo**
**Como** entrenador  
**Quiero** eliminar equipos que ya no gestiono  
**Para** mantener mi lista de equipos organizada y relevante

**Criterios de Aceptación:**
- ✅ Cada card de equipo tiene un botón de "Eliminar"
- ✅ Al hacer clic, aparece una confirmación antes de eliminar
- ✅ La confirmación explica claramente las consecuencias
- ✅ Si confirmo, el equipo se elimina inmediatamente de la vista
- ✅ Hay feedback visual de que la eliminación fue exitosa

**Definición de Terminado:**
- Modal de confirmación implementado
- Eliminación optimista en la UI
- Manejo de errores de eliminación
- Feedback apropiado al usuario

---

## Épica 3: Personalización de la Experiencia

### **US-008: Toggle de Tema Claro/Oscuro**
**Como** usuario del dashboard  
**Quiero** poder cambiar entre tema claro y oscuro  
**Para** usar la aplicación cómodamente en diferentes condiciones de iluminación

**Criterios de Aceptación:**
- ✅ Hay un toggle de tema visible en el header
- ✅ Al hacer clic, cambia inmediatamente entre claro y oscuro
- ✅ El cambio afecta a toda la interfaz del dashboard
- ✅ Mi preferencia se guarda y persiste entre sesiones
- ✅ El icono del toggle refleja el tema actual

**Definición de Terminado:**
- Componente ThemeToggleComponent implementado
- ThemeService con persistencia en localStorage
- Variables CSS para tema oscuro definidas
- Transiciones suaves entre temas

---

### **US-009: Detección Automática de Tema del Sistema**
**Como** usuario del dashboard  
**Quiero** que la aplicación respete mi preferencia de tema del sistema operativo  
**Para** tener una experiencia consistente con mis otras aplicaciones

**Criterios de Aceptación:**
- ✅ Al primer acceso, la app detecta mi preferencia del sistema
- ✅ Si cambio el tema del sistema, la app se actualiza automáticamente
- ✅ Puedo sobrescribir la detección automática con mi preferencia manual
- ✅ La preferencia manual tiene prioridad sobre la del sistema

**Definición de Terminado:**
- Media query para prefers-color-scheme implementada
- Listener para cambios de tema del sistema
- Lógica de prioridades correcta
- Tests para diferentes escenarios

---

## Épica 4: Administración de Perfil

### **US-010: Visualización de Información de Usuario**
**Como** usuario autenticado  
**Quiero** ver mi información de perfil en el header  
**Para** confirmar que estoy en mi cuenta correcta

**Criterios de Aceptación:**
- ✅ Veo un avatar con mis iniciales en el header
- ✅ El avatar usa un color consistente y atractivo
- ✅ Al lado del avatar veo mi nombre completo
- ✅ Debajo del nombre veo mi email
- ✅ En mobile, solo se muestra el avatar para ahorrar espacio

**Definición de Terminado:**
- Componente UserMenuComponent implementado
- Generación automática de iniciales
- Diseño responsive del perfil
- Información de usuario correctamente mostrada

---

### **US-011: Menú de Usuario con Logout**
**Como** usuario autenticado  
**Quiero** tener acceso a un menú de usuario  
**Para** realizar acciones relacionadas con mi cuenta

**Criterios de Aceptación:**
- ✅ Al hacer clic en mi avatar, se despliega un menú
- ✅ El menú incluye la opción "Cerrar Sesión"
- ✅ Al hacer clic en "Cerrar Sesión", soy deslogueado inmediatamente
- ✅ Después del logout, soy redirigido a la página de login
- ✅ El menú se cierra al hacer clic fuera de él

**Definición de Terminado:**
- Dropdown menu implementado
- Funcionalidad de logout integrada
- Redirección post-logout funcionando
- Manejo de clics fuera del menú

---

### **US-012: Confirmación de Logout**
**Como** usuario autenticado  
**Quiero** tener una confirmación antes de cerrar sesión  
**Para** evitar desloguearme accidentalmente

**Criterios de Aceptación:**
- ✅ Al hacer clic en "Cerrar Sesión", aparece una confirmación
- ✅ La confirmación pregunta si realmente quiero cerrar sesión
- ✅ Puedo cancelar y continuar en la aplicación
- ✅ Si confirmo, se ejecuta el logout inmediatamente
- ✅ La confirmación es clara y no ambigua

**Definición de Terminado:**
- Modal de confirmación de logout
- Flujo de confirmación/cancelación
- UX clara y sin ambigüedades
- Tests de interacción

---

## Historias Técnicas

### **TS-001: Configuración de Routing del Dashboard**
**Como** desarrollador  
**Quiero** configurar las rutas del dashboard con lazy loading  
**Para** optimizar el rendimiento de la aplicación

**Criterios de Aceptación:**
- ✅ Rutas del dashboard configuradas con lazy loading
- ✅ Guard de autenticación protege todas las rutas del dashboard
- ✅ Redirección automática a dashboard después del login
- ✅ Manejo de rutas no encontradas

---

### **TS-002: Implementación de Estado Reactivo con Signals**
**Como** desarrollador  
**Quiero** usar Angular Signals para el estado de la aplicación  
**Para** tener una gestión de estado moderna y eficiente

**Criterios de Aceptación:**
- ✅ Todos los servicios usan signals para el estado
- ✅ Componentes reactivos a cambios de estado
- ✅ No se usan Observables para estado local
- ✅ Computed signals para estado derivado

---

### **TS-003: Optimización de Performance**
**Como** desarrollador  
**Quiero** optimizar el rendimiento del dashboard  
**Para** proporcionar una experiencia de usuario fluida

**Criterios de Aceptación:**
- ✅ OnPush change detection en todos los componentes
- ✅ Lazy loading de componentes implementado
- ✅ Minimización de re-renders innecesarios
- ✅ Bundle size optimizado

---

## Criterios de Aceptación Globales

### **Accesibilidad**
- ✅ Navegación completa por teclado
- ✅ Contraste de colores WCAG AA
- ✅ Etiquetas ARIA apropiadas
- ✅ Soporte para lectores de pantalla

### **Responsive Design**
- ✅ Funcional en dispositivos móviles (320px+)
- ✅ Optimizado para tablets (768px+)
- ✅ Experiencia completa en desktop (1024px+)
- ✅ Navegación adaptativa según el dispositivo

### **Performance**
- ✅ Tiempo de carga inicial < 3 segundos
- ✅ Transiciones suaves (60fps)
- ✅ Lazy loading implementado
- ✅ Bundle size optimizado

### **Compatibilidad**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### **Testing**
- ✅ Cobertura de tests > 80%
- ✅ Tests unitarios para todos los componentes
- ✅ Tests de integración para flujos principales
- ✅ Tests E2E para casos de uso críticos