# 🚀 Sistema de Desarrollo Multi-Agente v1.0

## 📋 Descripción
Sistema agnóstico de desarrollo basado en agentes especializados que coordinan todo el ciclo de vida del software.

## 🎯 Principios del Sistema
1. **Documentación Primero**: Todo cambio empieza con documentación
2. **Agentes Especializados**: Cada agente tiene un dominio específico
3. **Coordinación Automática**: El orchestrator maneja el flujo
4. **Agnóstico de Tecnología**: El sistema se adapta a cualquier stack

## 🤖 Agentes Principales

### Coordinación
- **orchestrator**: Coordina todos los agentes y flujos de trabajo

### Análisis y Diseño
- **product-manager**: Define requisitos y lógica de negocio
- **architect**: Diseña la arquitectura del sistema
- **stack-selector**: Selecciona las tecnologías apropiadas

### Implementación
- **implementer**: Genera código y estructura del proyecto
- **tester**: Crea y ejecuta pruebas
- **reviewer**: Revisa código y documentación

### Especialistas (Se activan según el stack)
- Los agentes de tecnología específica se cargan dinámicamente

## 📁 Estructura de Documentación
- @docs/product/ - Requisitos, historias de usuario, casos de uso
- @docs/architecture/ - Decisiones arquitecturales, diagramas
- @docs/technical/ - Stack, configuración, guías técnicas
- @docs/tasks/ - Tareas actuales y backlog

## 🔧 Comandos Rápidos
- `/start-project [nombre]` - Iniciar nuevo proyecto
- `/update-requirements` - Actualizar requisitos con product-manager
- `/design-architecture` - Diseñar arquitectura del sistema
- `/select-stack` - Evaluar y seleccionar tecnologías
- `/check-status` - Ver estado actual del proyecto
- `/validate-all` - Validar consistencia de documentación

## ⚠️ REGLAS IMPORTANTES
1. SIEMPRE usar el orchestrator para tareas complejas
2. La documentación en docs/ es la fuente de verdad
3. Los cambios de arquitectura requieren revisión del architect
4. Cada sesión debe empezar revisando @docs/tasks/current.md
5. Los agentes se comunican mediante archivos en .claude/task-state/

## 🚦 Flujo de Trabajo Estándar
1. Usuario → Orchestrator (analiza tarea)
2. Orchestrator → Product Manager (si hay nuevos requisitos)
3. Orchestrator → Architect (si hay cambios estructurales)
4. Orchestrator → Stack Selector (si no hay stack definido)
5. Orchestrator → Implementer (para generar código)
6. Orchestrator → Tester (para validar)
7. Orchestrator → Reviewer (para revisión final)

## 📊 Estado del Sistema
- Último proyecto: [No iniciado]
- Stack activo: [No seleccionado]
- Documentación: [Plantillas listas]

## 🔄 Para Empezar
1. Ejecuta `/start-project [nombre]` para iniciar
2. O usa directamente: "Necesito crear una aplicación de [tipo]"
3. El sistema se encargará del resto

---
*Sistema creado para maximizar productividad con Claude Code*
*Versión: 1.0.0 | Agnóstico de Tecnología*
