# SportPlanner - Sistema de Agentes Especializados

## 🤖 Arquitectura de Agentes

El sistema SportPlanner utiliza **agentes especializados** para optimizar el desarrollo, mantenimiento y evolución de la plataforma. Cada agente está diseñado para dominar un área específica del proyecto.

---

## 🎯 Agentes Disponibles

### 🧠 **claude-memory-manager**
**Propósito**: Gestor de memoria principal del sistema
**Ubicación**: `.claude/agents/claude-memory-manager.md`

**Responsabilidades**:
- Mantiene `CLAUDE.md` actualizado automáticamente
- Incorpora cambios de arquitectura y nuevas funcionalidades
- Gestiona la documentación de contexto para futuras sesiones
- Optimiza el arranque del sistema con información relevante

**Cuándo usar**:
- ✅ SIEMPRE al completar funcionalidades importantes
- ✅ Después de cambios arquitectónicos significativos
- ✅ Al inicio de sesiones para verificar contexto actualizado
- ✅ Proactivamente cuando la documentación está desactualizada

```bash
# Ejemplo de uso
/Task claude-memory-manager "Actualizar CLAUDE.md con nueva funcionalidad de suscripciones implementada"
```

### ⚙️ **agent-generator**
**Propósito**: Generador de nuevos agentes especializados
**Ubicación**: `.claude/agents/agent-generator.md`

**Responsabilidades**:
- Crear agentes especializados para necesidades específicas del proyecto
- Optimizar agentes para el contexto SportPlanner
- Seguir mejores prácticas de Claude Code
- Gestionar el catálogo de agentes disponibles

**Cuándo usar**:
- ✅ Cuando detectas necesidad de especialización repetitiva
- ✅ Para crear agentes de dominio específico (Teams, Plannings, Marketplace)
- ✅ Al identificar gaps en la cobertura de agentes existentes

```bash
# Ejemplo de uso
/Task agent-generator "Crear agente especializado en gestión de entrenamientos con cronómetro"
```

### 🔧 **dotnet-expert**
**Propósito**: Especialista en desarrollo backend con .NET 8 y C# 12
**Ubicación**: `.claude/agents/dotnet-expert.md`

**Responsabilidades**:
- Implementar APIs modernas con .NET 8 y ASP.NET Core
- Aplicar patrones de Entity Framework Core optimizados
- Revisar código backend para adherencia a mejores prácticas
- Optimizar performance y seguridad en servicios .NET
- Gestionar migraciones y configuraciones de base de datos

**Especialidades**:
- **Minimal APIs**: Endpoints modernos y eficientes
- **C# 12 Features**: Primary constructors, collection expressions, pattern matching
- **EF Core**: Repository patterns, query optimization, migrations
- **Security**: JWT authentication, authorization policies, input validation
- **Performance**: Async patterns, caching, memory optimization

**Cuándo usar**:
- ✅ Implementando nuevos Controllers o Services backend
- ✅ Creando APIs para Teams, Plannings, Trainings, Marketplace
- ✅ Optimizando queries de Entity Framework
- ✅ Implementando autenticación y autorización granular
- ✅ Revisando código .NET para performance y seguridad

```bash
# Ejemplos de uso
/Task dotnet-expert "Implementar API endpoint para gestión de suscripciones"
/Task dotnet-expert "Revisar TeamService para optimización de queries EF Core"
/Task dotnet-expert "Crear middleware de autorización por roles granulares"
```

### 🎨 **angular-best-practices**
**Propósito**: Especialista en desarrollo frontend con Angular 20+
**Ubicación**: `.claude/agents/angular-best-practices.md`

**Responsabilidades**:
- Implementar componentes siguiendo Angular 20+ estándares
- Modernizar código Angular legacy a patrones actuales
- Optimizar performance con OnPush y Signals
- Crear interfaces responsive con Tailwind CSS
- Integrar con servicios backend y Supabase Auth

**Especialidades**:
- **Standalone Components**: Arquitectura moderna sin NgModules
- **Signals**: Gestión reactiva de estado con `signal()`, `computed()`, `effect()`
- **Control Flow**: `@if`, `@for`, `@switch` en lugar de directivas estructurales
- **Typed Forms**: Reactive forms fuertemente tipadas
- **Performance**: OnPush strategy, deferrable views, lazy loading

**Patrones que evita**:
- NgModules (usa standalone components)
- `*ngIf`, `*ngFor` (usa @if, @for)
- Constructor injection (usa inject())
- Inline templates/styles (siempre archivos separados)

**Cuándo usar**:
- ✅ Creando nuevos componentes para Teams, Plannings, Dashboard
- ✅ Modernizando componentes existentes a Angular 20+
- ✅ Implementando formularios reactivos complejos
- ✅ Optimizando performance de componentes
- ✅ Integrando con NotificationService para UX

```bash
# Ejemplos de uso
/Task angular-best-practices "Crear componente de creación de equipos con validación"
/Task angular-best-practices "Modernizar AuthComponent a standalone con signals"
/Task angular-best-practices "Implementar componente marketplace con filtros reactivos"
```

---

## 🚀 Agentes Especializados de Dominio

Con los **agentes técnicos base** (`dotnet-expert` y `angular-best-practices`) ya disponibles, el siguiente nivel son **agentes de dominio SportPlanner**:

### 🏃‍♂️ **sportplanner-training-agent** (Sugerido)
**Dominio**: Gestión de entrenamientos y ejecución en tiempo real

**Especializaciones sugeridas**:
- Creación automática de entrenamientos basados en planificaciones
- Optimización de cronómetros y vista dinámica de ejercicios
- Cálculo de progreso de conceptos entrenados vs planificados
- Generación de informes post-entrenamiento

**Colaboración**: Usaría `dotnet-expert` para backend y `angular-best-practices` para frontend
**Herramientas recomendadas**: `*` (acceso completo)

### ⭐ **sportplanner-marketplace-agent** (Sugerido)
**Dominio**: Sistema de marketplace y valoraciones

**Especializaciones sugeridas**:
- Implementación de filtros avanzados de búsqueda
- Sistema de valoraciones y reviews (1-5 ⭐)
- Algoritmos de recomendación de planificaciones
- Gestión de importación/exportación de planificaciones

**Colaboración**: Coordinaría `dotnet-expert` y `angular-best-practices`
**Herramientas recomendadas**: `Read, Write, Edit, Bash, Grep, Glob`

### 👥 **sportplanner-roles-agent** (Pendiente)
**Dominio**: Gestión de usuarios, roles y permisos

**Especializaciones sugeridas**:
- Implementación de RBAC granular
- Gestión de suscripciones y limitaciones por plan
- Asignación flexible de permisos por equipo/planificación
- Flujos de invitación de usuarios (entrenadores, ayudantes)

**Herramientas recomendadas**: `Read, Write, Edit, Grep`

### 📊 **sportplanner-analytics-agent** (Pendiente)
**Dominio**: Informes, analytics y dashboard

**Especializaciones sugeridas**:
- Generación de informes de progreso de equipos
- Analytics de uso de conceptos y ejercicios
- Dashboards para directores deportivos
- Métricas de rendimiento de planificaciones

**Herramientas recomendadas**: `Read, Grep, Bash`

### 🔧 **sportplanner-devops-agent** (Pendiente)
**Dominio**: Deployment, testing y CI/CD

**Especializaciones sugeridas**:
- Configuración de pipelines de deployment
- Gestión de migraciones de base de datos
- Testing automatizado (frontend y backend)
- Monitoreo y health checks

**Herramientas recomendadas**: `Bash, Read, Write, Edit`

---

## 🎯 Estrategias de Uso de Agentes

### **📋 Para Nuevas Funcionalidades**
1. **Planificación**: `general-purpose` para research inicial
2. **Implementación**: Agente especializado del dominio
3. **Testing**: `sportplanner-devops-agent` para validación
4. **Documentación**: `claude-memory-manager` para actualizar contexto

### **🐛 Para Debugging y Fixes**
1. **Análisis**: `general-purpose` para localizar el problema
2. **Fix**: Agente especializado del dominio afectado
3. **Verificación**: `sportplanner-devops-agent` para testing
4. **Documentación**: `claude-memory-manager` si hay cambios arquitectónicos

### **🔄 Para Refactoring**
1. **Análisis de impacto**: `general-purpose` para mapear dependencies
2. **Refactor**: Múltiples agentes especializados según dominios afectados
3. **Testing**: `sportplanner-devops-agent` para validación completa
4. **Actualización**: `claude-memory-manager` para nuevos patterns

---

## 🛠️ Gestión del Ciclo de Vida de Agentes

### **🆕 Creación de Nuevos Agentes**
```bash
# 1. Identificar necesidad específica
/Task agent-generator "Necesito un agente para gestión de conceptos y ejercicios personalizados"

# 2. El agent-generator creará el agente optimizado
# 3. Validar funcionalidad con caso de uso real
# 4. Añadir a esta documentación
```

### **📈 Evolución de Agentes Existentes**
- **Feedback Loop**: Recolectar casos donde el agente no fue óptimo
- **Optimización**: Usar `agent-generator` para mejorar agentes existentes
- **Versionado**: Mantener historial de cambios en agentes

### **🔄 Mantenimiento**
- **Revisión mensual**: Evaluar efectividad de cada agente
- **Actualización**: Adaptar agentes a nuevas funcionalidades
- **Deprecation**: Retirar agentes que ya no aportan valor

---

## 📚 Mejores Prácticas

### **✅ Do's**
- **Especialización**: Usar el agente más específico para cada tarea
- **Contexto completo**: Proporcionar contexto detallado en prompts
- **Feedback**: Documentar casos exitosos y problemáticos
- **Colaboración**: Combinar múltiples agentes para tareas complejas

### **❌ Don'ts**
- **Sobreuso**: No usar agentes para tareas simples que puedes hacer directamente
- **Contexto insuficiente**: Evitar prompts vagos o sin contexto
- **Dependencia excesiva**: Mantener capacidad de desarrollo sin agentes
- **Agentes redundantes**: Evitar crear agentes con responsabilidades solapadas

---

## 🔍 Monitoreo y Métricas

### **📊 KPIs de Agentes**
- **Tiempo de resolución**: Comparar vs desarrollo manual
- **Calidad del código**: Métricas de código generado por agentes
- **Adopción**: Frecuencia de uso de cada agente
- **Satisfacción**: Feedback subjetivo de desarrolladores

### **🎯 Objetivos de Performance**
- **Especialización**: > 80% tareas resueltas por agente específico (no general-purpose)
- **Eficiencia**: 50% reducción tiempo desarrollo en tareas especializadas
- **Consistencia**: 90% adherencia a patterns y convenciones del proyecto
- **Documentación**: 100% funcionalidades nuevas documentadas automáticamente

---

## 🚀 Roadmap de Agentes

### **Fase 1: Agentes Core** (Actual)
- ✅ `claude-memory-manager`: Gestión de contexto
- ✅ `agent-generator`: Creación de agentes
- ⏳ `general-purpose`: Tareas no especializadas

### **Fase 2: Agentes de Dominio** (Próximo)
- 📅 `sportplanner-training-agent`: Entrenamientos
- 📅 `sportplanner-marketplace-agent`: Marketplace
- 📅 `sportplanner-roles-agent`: Usuarios y permisos

### **Fase 3: Agentes Avanzados** (Futuro)
- 📅 `sportplanner-analytics-agent`: Informes y métricas
- 📅 `sportplanner-devops-agent`: CI/CD y deployment
- 📅 `sportplanner-mobile-agent`: Desarrollo móvil

### **Fase 4: Agentes de IA** (Investigación)
- 📅 `sportplanner-ai-coach`: Recomendaciones inteligentes de entrenamientos
- 📅 `sportplanner-content-agent`: Generación automática de ejercicios
- 📅 `sportplanner-insight-agent`: Analytics predictivos

---

## 💡 Casos de Uso Típicos

### **🎯 Desarrollo de Nueva Funcionalidad: "Sistema de Suscripciones"**
```bash
# 1. Research y planificación
/Task general-purpose "Analizar implementación de suscripciones con Stripe/PayPal en SportPlanner"

# 2. Implementación backend
/Task sportplanner-roles-agent "Implementar limitaciones por suscripción en TeamService"

# 3. Implementación frontend
/Task general-purpose "Crear componente de selección de suscripción con Tailwind CSS"

# 4. Testing
/Task sportplanner-devops-agent "Crear tests para flujos de suscripción"

# 5. Documentación
/Task claude-memory-manager "Actualizar CLAUDE.md con sistema de suscripciones implementado"
```

### **🐛 Debugging: "Error en generación automática de entrenamientos"**
```bash
# 1. Localizar problema
/Task general-purpose "Debugger error en PlanningService.GenerateTrainingsAsync"

# 2. Fix especializado
/Task sportplanner-training-agent "Corregir lógica de asignación de conceptos a entrenamientos"

# 3. Validación
/Task sportplanner-devops-agent "Validar fix con tests de integración"
```

---

**💡 Recuerda**: Los agentes son herramientas para acelerar el desarrollo, no reemplazar el conocimiento técnico. Úsalos estratégicamente para maximizar productividad manteniendo control sobre el código.