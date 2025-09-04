---
allowed-tools: Read, Grep, Bash, Write, LS
argument-hint: [scan|update|full] [module-name]
description: Genera documentación completa del producto para desarrollo con agentes
---

# Generador de Documentación del Producto

Colabora con el usuario para crear documentación completa del proyecto basada en su visión y las tecnologías detectadas.

🚀 ALWAYS START: "📋 COLABORANDO EN DOCUMENTACIÓN DEL PRODUCTO..."

## PROCESO COLABORATIVO:

### 1. 🔍 ESCANEO Y DETECCIÓN
- Detecta tecnologías (package.json, requirements.txt, pom.xml, etc.)
- Analiza estructura de archivos y directorios
- Identifica patrones arquitectónicos existentes
- REPORTA hallazgos al usuario para confirmar

### 2. 🤝 COLABORACIÓN CON EL USUARIO
**SIEMPRE pregunta antes de asumir:**
- "He detectado [tecnologías]. ¿Es correcto?"
- "¿Cuál es la visión principal de tu producto?"
- "¿Qué casos de uso principales quieres documentar?"
- "¿Hay alguna funcionalidad específica que deba incluir?"
- ESPERA respuestas del usuario antes de continuar

### 3. 📄 CONSTRUCCIÓN COLABORATIVA DE DOCUMENTACIÓN
Basándose en tus respuestas y los hallazgos técnicos, construye los 3 archivos estratégicos:

**PRODUCT.md**: Todo sobre QUÉ construir (BASADO EN TUS RESPUESTAS)
- Visión del producto (que tú defines)
- Casos de uso principales (que tú especificas)
- Funcionalidades por módulo (que tú describes)
- Pantallas/interfaces principales (que tú mencionas)
- Flujos de usuario (que tú detallas)
- Criterios de aceptación (que acordamos juntos)

**ARCHITECTURE.md**: Todo sobre CÓMO construir (DETECTADO + TU CONFIRMACIÓN)
- Stack tecnológico (detectado pero confirmado por ti)
- Estructura del proyecto (analizada y validada contigo)
- Componentes/clases principales (definidos colaborativamente)
- Patrones de diseño (sugeridos y aprobados por ti)
- APIs y endpoints (diseñados juntos)
- Modelo de datos (definido colaborativamente)

**AGENTS.md**: Coordinación del sistema (BASADO EN ARQUITECTURA ACORDADA)
- Agentes necesarios según tu proyecto
- Roles específicos para tu caso de uso
- Flujo de trabajo adaptado a tu metodología

### 4. 🗣️ PROTOCOLO DE PREGUNTAS COLABORATIVAS

**PARA PRODUCT.md:**
1. "🎯 ¿Cuál es la visión principal de tu producto? (1-2 frases)"
2. "📝 ¿Qué casos de uso principales debe cubrir?"
3. "🎨 ¿Tienes pantallas o interfaces específicas en mente?"
4. "👥 ¿Quiénes son tus usuarios objetivo?"
5. "✅ ¿Cómo sabrás que el producto funciona correctamente?"

**PARA ARCHITECTURE.md:**
1. "🔍 He detectado [tecnologías]. ¿Es correcto o hay algo más?"
2. "🏢 ¿Cómo prefieres organizar la estructura del proyecto?"
3. "📦 ¿Qué componentes principales ves en tu sistema?"
4. "🔗 ¿Necesitas APIs externas o bases de datos específicas?"
5. "🎨 ¿Hay patrones de diseño que prefieres usar?"

**PARA AGENTS.md:**
1. "🤖 Basándome en tu proyecto, sugiero estos agentes: [lista]. ¿Te parece bien?"
2. "🔄 ¿Cómo prefieres trabajar: paso a paso o con múltiples agentes simultáneos?"
3. "📊 ¿Qué prioridad tienen las tareas: desarrollo, testing, documentación?"

### 5. 🤝 CONSTRUCCIÓN ITERATIVA
- Presenta BORRADORES de cada archivo
- Pide confirmación: "¿Esto refleja tu visión?"
- Permite ajustes: "¿Qué cambiarías?"
- Solo FINALIZA cuando el usuario apruebe

### 6. 🎯 RECOMENDACIONES FINALES
Solo DESPUÉS de que apruebes la documentación:
- Sugerir agentes específicos para tu proyecto
- Estimar tokens del sistema optimizado
- Proponer próximos pasos personalizados

## ARGUMENTOS:
- `scan`: Solo escanea y muestra lo que haría sin crear archivos
- `update`: Actualiza documentación existente preservando cambios manuales
- `full`: Genera toda la documentación desde cero
- `[module-name]`: Enfoca en módulo específico del proyecto

## MODOS DE OPERACIÓN:

**MODO COLABORATIVO (recomendado):**
```
/generate-product-docs full
```
- Proceso interactivo paso a paso
- Te hace preguntas antes de asumir nada
- Construye documentación basada en tus respuestas
- Valida contigo cada sección antes de finalizar

**MODO EXPLORATORIO:**
```
/generate-product-docs scan
```
- Solo detecta tecnologías y estructura
- Te muestra qué encontró sin crear archivos
- Perfecto para decidir si proceder con el modo completo

**MODO ACTUALIZACIÓN:**
```
/generate-product-docs update
```
- Revisa documentación existente
- Pregunta qué ha cambiado
- Actualiza solo las secciones necesarias

✅ ALWAYS END: "📋 PROCESO COLABORATIVO [COMPLETADO/EN PROGRESO] - Próximo paso: [acción sugerida]"
