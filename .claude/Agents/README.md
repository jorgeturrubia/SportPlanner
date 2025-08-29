# 🚀 **AUTONOMOUS PROJECT MANAGER SYSTEM**

Un sistema de agentes inteligentes para Claude Code que automatiza completamente el desarrollo full-stack sin necesidad de especificaciones explícitas.

## ✨ **¿Qué hace este sistema?**

El **Project Manager Agent** es un orquestador inteligente que:

1. **Analiza automáticamente** el contexto de tu proyecto (steering files, specs, estructura)
2. **Detecta las tecnologías** utilizadas (.NET, Angular, React, etc.)
3. **Descubre agentes especializados** disponibles en la carpeta de agentes
4. **Planifica y ejecuta** el desarrollo completo de forma autónoma
5. **Coordina entre capas** (backend primero, luego frontend)
6. **Valida continuamente** que todo funciona correctamente

## 🎯 **Instalación y Configuración**

### **1. Copia los agentes a tu proyecto:**
```bash
# Copia toda la carpeta AgentPm a tu proyecto Claude Code
cp -r C:/ProjectPP/AgentPm .claude/agents/
```

### **2. Estructura resultante:**
```
tu-proyecto/
├─ .claude/
│  ├─ agents/
│  │  ├─ project-manager.agent.md         # 🧠 Agente orquestador principal
│  │  ├─ backend-net-specialist.agent.md  # 🔥 Especialista .NET
│  │  └─ angular-frontend-specialist.agent.md # ⚡ Especialista Angular
│  ├─ steering/
│  │  ├─ product.md                       # Contexto del producto
│  │  ├─ tech.md                         # Stack tecnológico
│  │  └─ structure.md                    # Estructura del proyecto
└─ src/ (tu código)
```

### **3. Configuración requerida en steering files:**

**`.claude/steering/tech.md`** (ejemplo):
```markdown
# Technology Stack

## Backend
- .NET 8 Web API
- Entity Framework Core
- Clean Architecture
- Supabase Authentication

## Frontend  
- Angular 20
- TypeScript 5.8
- Tailwind CSS 4
- Standalone Components

## Database
- PostgreSQL
- Supabase
```

## 🚀 **Uso del Sistema**

### **Activación Automática**

El PM Agent se activa automáticamente cuando dices:
- *"Implement the authentication system"*
- *"Build the team management feature"*  
- *"Develop the user dashboard"*
- *"Create the API for teams"*

### **Ejemplo de Ejecución:**

```
TÚ: "Implement the complete team management system"

PM AGENT: 🚀 Analyzing project context for autonomous development...

📊 CONTEXT ANALYSIS:
- Technology Stack: .NET 8 + Angular 20 + PostgreSQL
- Architecture: Clean Architecture + MVC  
- Features: Team CRUD, Authentication, Modal UI

🔍 AGENT DISCOVERY:
- Found: backend-net-specialist.agent.md
- Found: angular-frontend-specialist.agent.md  

📋 EXECUTION PLAN:
Layer 1: Database models and EF setup (.NET agent)
Layer 2: API controllers and services (.NET agent)  
Layer 3: Authentication integration (.NET agent)
Layer 4: Angular components and services (Angular agent)
Layer 5: UI forms and validation (Angular agent)
Layer 6: Integration testing & validation

🚀 STARTING AUTONOMOUS EXECUTION...

[Proceeds to execute each layer with validation]
```

## 🔧 **Agentes Especializados Incluidos**

### **🧠 Project Manager Agent**
- **Rol**: Orquestador principal inteligente
- **Capacidades**: 
  - Análisis de contexto automático
  - Detección de tecnologías
  - Descubrimiento de agentes
  - Planificación de tareas
  - Validación continua

### **🔥 Backend .NET Specialist**
- **Especialización**: .NET 8, Clean Architecture, EF Core, Web APIs
- **Prioridad**: 1 (ejecuta primero)
- **Capacidades**: Controllers, Services, Models, Authentication, Testing

### **⚡ Angular Frontend Specialist**  
- **Especialización**: Angular 20+, Standalone Components, RxJS, TypeScript
- **Prioridad**: 2 (ejecuta después del backend)
- **Capacidades**: Components, Services, Forms, Routing, Guards, Testing

## 🎮 **Comandos y Funcionalidades**

### **Desarrollo Autónomo:**
```
"Develop the user authentication system"
"Build the team management feature"  
"Implement the dashboard with charts"
"Create the API for user management"
```

### **Desarrollo Específico por Agente:**
```
"Use the backend-net-specialist to create the Team API"
"Use the angular-frontend-specialist to build the team components"
```

### **Validación y Testing:**
```
"Validate the current implementation"
"Test the authentication flow"
"Check integration between frontend and backend"
```

## 🔍 **Cómo Funciona Internamente**

### **1. Análisis de Contexto:**
- Lee `steering/tech.md` → Detecta: .NET + Angular
- Lee `steering/structure.md` → Entiende la arquitectura
- Lee specs existentes → Comprende los requerimientos

### **2. Descubrimiento de Agentes:**
- Escanea `.claude/agents/*.agent.md`
- Busca archivos que contengan "net", "angular", etc.
- Mapea capacidades y prioridades de ejecución

### **3. Planificación Inteligente:**
- Backend tasks primero (models → services → controllers)
- Frontend tasks después (components → services → routing)
- Validación continua entre capas

### **4. Ejecución Coordinada:**
- Llama agentes en orden de prioridad
- Mantiene estado entre ejecuciones
- Valida que cada capa funcione antes de continuar

## 🚨 **Extensibilidad**

### **Añadir Nuevas Tecnologías:**

Para añadir soporte a React, simplemente crea:
```
.claude/agents/react-frontend-specialist.agent.md
```

El PM Agent lo descubrirá automáticamente cuando detecte React en el proyecto.

### **Tecnologías Soportadas Automáticamente:**
- **Frontend**: Angular, React, Vue, JavaScript/Node
- **Backend**: .NET, Node.js, Python, Java  
- **Database**: PostgreSQL, SQL Server, MongoDB
- **Y cualquier otra que definas en un agente**

## 📋 **Convenciones de Naming**

### **Para que el PM Agent encuentre tus agentes:**
- Incluye la tecnología en el nombre del archivo
- Ejemplos que funcionan:
  - `my-react-expert.agent.md`
  - `python-backend-specialist.agent.md`  
  - `vue-component-builder.agent.md`
  - `database-postgres.agent.md`

### **Aliases Soportados:**
- **.NET**: "net", "dotnet", ".net", "csharp"
- **Angular**: "angular", "ng"
- **React**: "react", "reactjs"  
- **JavaScript**: "javascript", "js", "node"

## 🎯 **Mejores Prácticas**

### **1. Steering Files Completos:**
- Mantén `tech.md` actualizado con el stack real
- Describe la arquitectura en `structure.md`
- Explica el producto en `product.md`

### **2. Agentes Especializados:**
- Crea un agente por tecnología principal
- Incluye convenciones específicas del proyecto
- Define herramientas necesarias en el frontmatter

### **3. Validación Continua:**
- El PM Agent valida después de cada capa
- Si algo falla, intentará recuperación automática
- Siempre mantén tests actualizados

## 🚀 **Casos de Uso Increíbles**

### **Desarrollo Completo sin Specs:**
```
TÚ: "Build a complete authentication system with login, register, and team management"

RESULTADO: 
✅ Backend API completo con .NET
✅ Frontend Angular con componentes y formularios  
✅ Integración Supabase
✅ Validación y testing
✅ Documentación actualizada
```

### **Migración Automática:**
```
TÚ: "Convert this jQuery app to React"

RESULTADO:
✅ Detecta jQuery en el proyecto  
✅ Busca react-specialist.agent.md
✅ Planifica migración incremental
✅ Convierte componente por componente
✅ Mantiene funcionalidad durante migración
```

---

## 🎊 **¡Ya está listo!**

Tu sistema de agentes autónomos está configurado. Simplemente pide cualquier desarrollo y observa cómo el PM Agent:

1. 🧠 **Analiza** tu proyecto automáticamente
2. 🔍 **Descubre** los agentes apropiados  
3. 📋 **Planifica** la ejecución inteligentemente
4. 🚀 **Ejecuta** con coordinación perfecta
5. ✅ **Valida** continuamente los resultados

**¡Desarrollo full-stack completamente autónomo!** 🎯