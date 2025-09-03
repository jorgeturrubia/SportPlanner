---
allowed-tools: Read, LS, Grep
argument-hint: [check|status]
description: Verifica sistema completo de agentes y documentación, reporta qué falta y sugiere acciones
---

# Inicializador del Sistema de Agentes

Verifica que el proyecto tenga configuración completa para trabajo con agentes.

🚀 ALWAYS START: "🔍 VERIFICANDO SISTEMA DE AGENTES..."

## TU PROTOCOLO:

### 1. 🔍 DIAGNÓSTICO
Verifica esta estructura obligatoria:
```
.claude/
├── docs/PRODUCT.md
├── docs/ARCHITECTURE.md  
├── docs/AGENTS.md
├── agents/agent-generator.md
├── agents/claude-memory-manager.md
├── commands/generate-product-docs.md
└── CLAUDE.md (en raíz del proyecto)
```

### 2. 🎯 INTERACCIÓN CON USUARIO

**SI FALTA DOCUMENTACIÓN:**
- "⚠️ Falta documentación del proyecto"
- "¿Quieres que ejecute `/generate-product-docs full` para crearla?"
- "Esto generará: PRODUCT.md, ARCHITECTURE.md, AGENTS.md"
- ESPERA confirmación del usuario

**SI FALTA agent-generator.md:**
- "⚠️ Falta el agente generador de agentes"  
- "¿Quieres que cree `agent-generator.md`?"
- "Este agente te ayudará a crear otros agentes optimizados"
- ESPERA confirmación del usuario

**SI FALTA claude-memory-manager.md:**
- "⚠️ Falta el gestor de memoria principal"
- "¿Quieres que cree `claude-memory-manager.md`?"
- "Este agente mantiene CLAUDE.md actualizado automáticamente"
- ESPERA confirmación del usuario

**SI FALTA generate-product-docs.md:**
- "⚠️ Falta el comando para generar documentación"
- "¿Quieres que cree `/generate-product-docs`?"
- "Este comando analizará tu proyecto y creará la documentación"
- ESPERA confirmación del usuario

**SI FALTA CLAUDE.md:**
- "⚠️ Falta CLAUDE.md (memoria principal del sistema)"
- "¿Quieres que el claude-memory-manager lo cree?"
- "Este archivo es crítico - Claude lo carga automáticamente al arrancar"
- ESPERA confirmación del usuario

**SI TODO ESTÁ PRESENTE:**
- "🎉 SISTEMA COMPLETAMENTE CONFIGURADO"
- "✅ Documentación: Presente"
- "✅ Agentes básicos: Listos" 
- "✅ Comandos: Configurados"
- "✅ Memoria principal: CLAUDE.md presente"
- "🚀 El sistema está listo para desarrollo con agentes"

### 3. 📝 ARGUMENTOS
- `check`: Verifica y reporta estado
- `status`: Muestra detalle de cada componente

## FORMATO DE RESPUESTA:
- Siempre pregunta antes de actuar
- Explica QUÉ va a hacer y POR QUÉ
- Espera confirmación explícita del usuario
- Solo reporta y sugiere, nunca modifica sin permiso

✅ ALWAYS END: "🔍 DIAGNÓSTICO COMPLETADO - Estado: [LISTO/INCOMPLETO]"
