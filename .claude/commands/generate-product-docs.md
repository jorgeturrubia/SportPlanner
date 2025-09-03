---
allowed-tools: Read, Grep, Bash, Write, LS
argument-hint: [scan|update|full] [module-name]
description: Genera documentación completa del producto para desarrollo con agentes
---

# Generador de Documentación del Producto

Analiza el proyecto actual y genera documentación completa que servirá como base de conocimiento para el sistema de agentes de desarrollo.

🚀 ALWAYS START: "📋 GENERANDO DOCUMENTACIÓN DEL PRODUCTO..."

## PROCESO:

### 1. 🔍 ESCANEO DEL PROYECTO
- Detecta tecnologías (package.json, requirements.txt, pom.xml, etc.)
- Analiza estructura de archivos y directorios
- Identifica patrones arquitectónicos existentes
- Examina código fuente para extraer funcionalidades

### 2. 🧠 ANÁLISIS FUNCIONAL
- Extrae casos de uso del código existente
- Identifica componentes y clases principales
- Mapea relaciones entre módulos
- Detecta patrones de diseño utilizados

### 3. 📄 GENERACIÓN DE DOCUMENTACIÓN
Crea los 3 archivos estratégicos:

**PRODUCT.md**: Todo sobre QUÉ construir
- Visión del producto
- Casos de uso principales  
- Funcionalidades por módulo
- Pantallas/interfaces principales
- Flujos de usuario
- Criterios de aceptación

**ARCHITECTURE.md**: Todo sobre CÓMO construir
- Stack tecnológico detectado
- Estructura del proyecto
- Componentes/clases principales
- Patrones de diseño
- APIs y endpoints
- Modelo de datos

**AGENTS.md**: Coordinación del sistema
- Estado actual del proyecto
- Próximas tareas pendientes
- Roles necesarios de agentes
- Protocolos de comunicación
- Historial de decisiones

### 4. 🤖 ANÁLISIS DE AGENTES NECESARIOS
Después de generar documentación:
- Revisa .claude/agents/ existentes
- Compara contra MATRIZ DE AGENTES según tipo de proyecto:
  * Frontend-only: [frontend-dev, qa-tester]
  * Backend-API: [api-dev, api-tester, db-admin]  
  * Fullstack-web: [coordinator, frontend-dev, backend-dev, qa-tester]
  * Mobile-app: [mobile-dev, api-dev, qa-tester]
- Detecta agentes faltantes, redundantes o mal optimizados
- Reporta recomendaciones específicas

### 5. 💡 RECOMENDACIONES INTELIGENTES
- "⚠️ Faltan agentes: [lista]"  
- "🔄 Agentes redundantes: [lista]"
- "🎯 Crear con: /generate-agent [tipo]"
- "📊 Cobertura del proyecto: [porcentaje]%"
- "⚡ Tokens estimados del sistema: ~[número]"

## ARGUMENTOS:
- `scan`: Solo escanea y muestra lo que haría sin crear archivos
- `update`: Actualiza documentación existente preservando cambios manuales
- `full`: Genera toda la documentación desde cero
- `[module-name]`: Enfoca en módulo específico del proyecto

## EJEMPLOS DE USO:
```
/generate-product-docs scan
/generate-product-docs full
/generate-product-docs update auth-module
```

✅ ALWAYS END: "📋 DOCUMENTACIÓN [ESCANEADA/GENERADA/ACTUALIZADA] - Agentes recomendados: [lista]"
