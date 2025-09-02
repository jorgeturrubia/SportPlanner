---
description: Verificar el estado actual del proyecto y tareas pendientes
allowed-tools: Read, Bash
---

# 📊 Verificación de Estado del Proyecto

## 1. Verificar Documentación Actual

### Producto
- Revisar si existe @docs/product/vision.md
- Revisar si existe @docs/product/requirements.md
- Contar historias de usuario en @docs/product/user-stories/
- Verificar completitud del modelo de dominio

### Arquitectura
- Revisar si existe @docs/architecture/high-level-design.md
- Contar ADRs en @docs/architecture/adr/
- Verificar patrones documentados

### Técnico
- Revisar si existe @docs/technical/recommended-stack.md
- Verificar agentes activados
- Revisar configuración actual

### Tareas
- Leer @docs/tasks/current.md si existe
- Verificar .claude/task-state/current.json

## 2. Generar Reporte de Estado

Crear un reporte con formato:

```
════════════════════════════════════════════
📊 ESTADO DEL PROYECTO
Fecha: [fecha y hora actual]

📁 DOCUMENTACIÓN
├─ Visión: [✅ Completa|⚠️ Parcial|❌ Faltante]
├─ Requisitos: [cantidad] definidos
├─ Historias: [cantidad] documentadas
├─ Arquitectura: [✅|⚠️|❌]
└─ Stack: [Definido|No definido]

🔧 CONFIGURACIÓN
├─ Stack seleccionado: [tecnologías o "Pendiente"]
├─ Agentes activos: [lista]
├─ Estructura proyecto: [✅|❌]
└─ Tests configurados: [✅|❌]

📋 TAREAS
├─ En progreso: [cantidad]
├─ Completadas: [cantidad]
├─ Bloqueadas: [cantidad]
└─ Pendientes: [cantidad]

⚠️ PUNTOS DE ATENCIÓN
[Lista de items que requieren atención]

✅ COMPLETITUD GENERAL: [X]%

🔄 PRÓXIMOS PASOS RECOMENDADOS
1. [Acción prioritaria 1]
2. [Acción prioritaria 2]
3. [Acción prioritaria 3]

💡 RECOMENDACIONES
[Sugerencias basadas en el estado actual]
════════════════════════════════════════════
```

## 3. Verificar Salud del Sistema

- Confirmar que la estructura de carpetas está correcta
- Verificar que los agentes principales están presentes
- Comprobar que los hooks están configurados
- Validar que la documentación es consistente

## 4. Identificar Gaps

Listar explícitamente qué falta:
- [ ] Documentación faltante
- [ ] Configuración pendiente
- [ ] Decisiones no tomadas
- [ ] Agentes no configurados
