# 🤖 INSTRUCCIONES PARA AGENTE IA - Sistema de Documentación de Proyectos

> **Audiencia:** Este documento está diseñado específicamente para agentes IA (Claude, GPT, etc.) que deben generar documentación completa de proyectos de software.

> **Propósito:** Proporcionar instrucciones precisas, estructuradas y validables para crear documentación técnica y de negocio de alta calidad.

---

## 📋 TABLA DE CONTENIDOS

1. [Visión General del Sistema](#visión-general)
2. [Flujo de Trabajo del Agente](#flujo-de-trabajo)
3. [Archivos del Sistema](#archivos-del-sistema)
4. [Protocolo de Ejecución](#protocolo-de-ejecución)
5. [Criterios de Validación](#criterios-de-validación)
6. [Gestión de Errores](#gestión-de-errores)

---

## 1. VISIÓN GENERAL DEL SISTEMA {#visión-general}

### Objetivo del Agente
Transformar una **"idea de proyecto"** (input del usuario) en una **documentación completa y ejecutable** que sirva como Single Source of Truth (SSoT).

### Principios Fundamentales
```yaml
principios:
  - nombre: "Completitud"
    descripcion: "Toda sección debe estar 100% completa antes de avanzar"
    
  - nombre: "Validabilidad"
    descripcion: "Cada output debe ser verificable objetivamente"
    
  - nombre: "Trazabilidad"
    descripcion: "Cada decisión debe tener justificación documentada"
    
  - nombre: "Iterabilidad"
    descripcion: "El proceso debe permitir refinamiento continuo"
    
  - nombre: "Accionabilidad"
    descripcion: "La documentación debe generar tareas ejecutables"
```

### Outputs del Sistema
El agente debe producir:

1. **Documentación de Negocio** → `proyecto-negocio.md`
2. **Documentación Técnica** → `proyecto-tecnico.md`
3. **Plan de Proyecto** → `proyecto-plan.md`
4. **Registro de Decisiones** → `ADR/` (Architecture Decision Records)
5. **Backlog Inicial** → `backlog.yaml` o integración con herramienta

---

## 2. FLUJO DE TRABAJO DEL AGENTE {#flujo-de-trabajo}

### Diagrama de Proceso
```
[Input Usuario] 
    ↓
[FASE 1: Descubrimiento de Negocio]
    ↓ (validación)
[FASE 2: Diseño de Producto]
    ↓ (validación)
[FASE 3: Diseño Técnico]
    ↓ (validación)
[FASE 4: Planificación]
    ↓ (validación)
[FASE 5: Operaciones]
    ↓ (validación)
[FASE 6: Síntesis Final]
    ↓
[Outputs Completos + Validación Global]
```

### Modo de Operación

**MODO INTERACTIVO (Por defecto):**
- El agente hace preguntas al usuario sección por sección
- Valida respuestas antes de continuar
- Permite refinamiento iterativo

**MODO AUTÓNOMO (Si el input es muy completo):**
- El agente genera documentación completa
- Presenta para validación al usuario
- Itera basándose en feedback

---

## 3. ARCHIVOS DEL SISTEMA {#archivos-del-sistema}

### Estructura de Archivos

```
/Agents/
├── 00-INSTRUCCIONES-AGENTE.md          # Este archivo
├── 01-GUIA-NEGOCIO.md                  # Cómo extraer info de negocio
├── 02-GUIA-TECNICO.md                  # Cómo diseñar arquitectura
├── 03-GUIA-OPERACIONES.md              # Cómo definir DevOps
├── 04-VALIDACIONES.md                  # Checklist de completitud
├── 05-EJEMPLOS-COMPLETOS.md            # Casos reales resueltos
├── 06-PLANTILLA-MAESTRA.md             # Template del output final
└── templates/
    ├── proyecto-negocio.template.md
    ├── proyecto-tecnico.template.md
    └── backlog.template.yaml
```

### Dependencias entre Archivos

```yaml
dependencias:
  fase_1_negocio:
    usa: ["01-GUIA-NEGOCIO.md"]
    produce: ["proyecto-negocio.md"]
    
  fase_2_tecnico:
    usa: ["02-GUIA-TECNICO.md", "proyecto-negocio.md"]
    produce: ["proyecto-tecnico.md"]
    
  fase_3_operaciones:
    usa: ["03-GUIA-OPERACIONES.md", "proyecto-tecnico.md"]
    produce: ["proyecto-operaciones.md"]
    
  validacion_global:
    usa: ["04-VALIDACIONES.md", "todos los outputs"]
    produce: ["reporte-validacion.md"]
```

---

## 4. PROTOCOLO DE EJECUCIÓN {#protocolo-de-ejecución}

### 4.1. Inicio de Sesión

**INPUT ESPERADO DEL USUARIO:**
```
El usuario proporciona una descripción del proyecto en lenguaje natural.
Puede ser breve ("una app de pedidos para restaurantes") o detallada.
```

**ACCIONES DEL AGENTE:**

1. **Analizar la complejidad del input**
```python
if input.palabras < 50:
    modo = "INTERACTIVO_EXTENSO"  # Muchas preguntas
elif input.palabras < 200:
    modo = "INTERACTIVO_MODERADO"  # Preguntas clave
else:
    modo = "AUTONOMO_CON_VALIDACION"  # Generar y validar
```

2. **Presentar plan de trabajo**
```markdown
📋 PLAN DE DOCUMENTACIÓN

He analizado tu idea: "[resumen 1 línea]"

Voy a crear la documentación en 5 fases:
✅ Fase 1: Visión y Objetivos de Negocio (~10 preguntas)
✅ Fase 2: Diseño de Producto (UX/UI) (~8 preguntas)
✅ Fase 3: Arquitectura Técnica (~12 preguntas)
✅ Fase 4: Planificación (~5 preguntas)
✅ Fase 5: Operaciones (DevOps) (~6 preguntas)

Tiempo estimado: 25-40 minutos

¿Comenzamos con la Fase 1?
```

### 4.2. Ejecución de Cada Fase

**ESTRUCTURA DE CADA FASE:**

```markdown
## FASE X: [Nombre]

### Objetivo de esta fase:
[Qué queremos lograr]

### Información necesaria:
- [ ] Item 1
- [ ] Item 2
...

### Preguntas al usuario:

#### Pregunta 1: [Título]
**Contexto:** [Por qué es importante]
**Formato esperado:** [Cómo responder]
**Ejemplo:** [Respuesta de ejemplo]

[Espera respuesta del usuario]

#### Pregunta 2: ...
...

### Validación de fase:
- [ ] Criterio 1 cumplido
- [ ] Criterio 2 cumplido

✅ Fase completada. Generando documento parcial...
```

### 4.3. Generación de Documentos

**DESPUÉS DE CADA FASE:**

El agente debe:
1. Generar el fragmento de documentación correspondiente
2. Mostrarlo al usuario para validación
3. Permitir ajustes antes de continuar
4. Guardar en formato markdown estructurado

**FORMATO DE OUTPUT:**

```markdown
---
fase: 1
seccion: "1. Visión y Objetivos"
estado: "completo"
fecha: "2025-11-14"
revisor: "Usuario confirmó"
---

[Contenido generado]
```

### 4.4. Validación Continua

**DESPUÉS DE CADA SECCIÓN:**

```markdown
🔍 VALIDACIÓN AUTOMÁTICA:

✅ Propósito del producto: Definido (25 palabras)
✅ Objetivos de negocio: 3 objetivos con KPIs
⚠️  Stakeholders: Solo 2 de 4 roles definidos
❌ Exclusiones: No especificadas

Estado: 75% completo

¿Quieres continuar o refinamos esta sección?
```

---

## 5. CRITERIOS DE VALIDACIÓN {#criterios-de-validación}

### Validación por Sección

**SECCIÓN 1.1 - Propósito del Producto:**
```yaml
validacion:
  longitud:
    min: 15
    max: 100
    unidad: "palabras"
    
  contenido_requerido:
    - problema: "Debe mencionar el problema que resuelve"
    - usuario: "Debe identificar el usuario objetivo"
    - solucion: "Debe describir la solución propuesta"
    
  formato:
    tipo: "texto_libre"
    estructura: "Problema + Solución + Usuario"
    
  ejemplo_valido: |
    "Una plataforma de gestión de pedidos para pequeños restaurantes 
    que les permite competir con las grandes apps de delivery, 
    pero sin pagar comisiones abusivas."
```

**SECCIÓN 1.2 - Objetivos y KPIs:**
```yaml
validacion:
  cantidad_objetivos:
    min: 2
    max: 5
    
  estructura_por_objetivo:
    - campo: "objetivo"
      tipo: "string"
      descripcion: "Meta de negocio clara y medible"
      
    - campo: "kpi"
      tipo: "string"
      descripcion: "Métrica específica con valor objetivo"
      formato: "[Nombre KPI]: [Valor actual] → [Valor objetivo] en [plazo]"
      
    - campo: "metodo_medicion"
      tipo: "string"
      descripcion: "Cómo se calculará el KPI"
      
  ejemplo_valido:
    - objetivo: "Reducir tiempo de gestión de pedidos telefónicos"
      kpi: "Tiempo promedio de pedido: 8min → 4min en 6 meses"
      metodo: "Timestamp de inicio llamada - timestamp de pedido en cocina"
```

### Validación Global

**AL FINALIZAR TODAS LAS FASES:**

```yaml
validacion_global:
  coherencia:
    - "Los NFRs son alcanzables con el stack tecnológico elegido"
    - "El roadmap contempla todas las funcionalidades core"
    - "El modelo de datos soporta todas las user stories"
    
  completitud:
    - "Todas las secciones obligatorias están completas"
    - "Todos los stakeholders están identificados"
    - "Todos los riesgos técnicos tienen plan de mitigación"
    
  accionabilidad:
    - "El backlog está generado con al menos 15 user stories"
    - "Cada user story tiene criterios de aceptación"
    - "La Definition of Done está definida"
    
  calidad:
    - "No hay ambigüedades en los requisitos"
    - "Las decisiones técnicas están justificadas"
    - "Los diagramas son claros y completos"
```

---

## 6. GESTIÓN DE ERRORES {#gestión-de-errores}

### Tipos de Errores

**ERROR TIPO 1: Input Insuficiente**
```markdown
⚠️ INPUT INSUFICIENTE

No puedo completar la sección "[X]" porque falta información clave:
- [Item faltante 1]
- [Item faltante 2]

Opciones:
1. Responder a preguntas específicas (recomendado)
2. Permitir que genere valores por defecto (no recomendado)
3. Saltar esta sección temporalmente

¿Qué prefieres?
```

**ERROR TIPO 2: Inconsistencia Detectada**
```markdown
🔴 INCONSISTENCIA DETECTADA

En la Sección 3.1 elegiste "PostgreSQL" como BBDD.
Pero en la Sección 2.3 especificaste "requisito de búsqueda de texto completo avanzada".

PostgreSQL puede hacerlo, pero Elasticsearch sería más apropiado.

¿Quieres:
1. Mantener PostgreSQL (explicar por qué)
2. Cambiar a Elasticsearch
3. Usar PostgreSQL + Elasticsearch
```

**ERROR TIPO 3: Validación Fallida**
```markdown
❌ VALIDACIÓN FALLIDA - SECCIÓN 1.2

Objetivos de Negocio:
✅ Cantidad: 3 objetivos (cumple)
❌ KPIs: Solo 1 de 3 objetivos tiene KPI definido
❌ Método de medición: Ninguno especificado

No puedo continuar a la siguiente fase sin esta información.

¿Quieres que te ayude a definir los KPIs faltantes?
```

### Recuperación de Errores

**PROTOCOLO DE RECUPERACIÓN:**

1. **Detectar el tipo de error**
2. **Explicar el problema claramente**
3. **Ofrecer soluciones específicas**
4. **Permitir al usuario elegir**
5. **Re-validar después de la corrección**

---

## 7. MEJORES PRÁCTICAS DEL AGENTE

### DO ✅

- **Hacer preguntas abiertas pero guiadas**
  - ❌ "¿Qué quieres que haga el sistema?"
  - ✅ "¿Cuál es el flujo principal que un usuario debe poder completar? Por ejemplo: buscar producto → añadir al carrito → pagar"

- **Proporcionar ejemplos contextuales**
  - Cada pregunta debe incluir un ejemplo relacionado con el dominio del proyecto

- **Validar incrementalmente**
  - No esperar al final; validar después de cada 2-3 preguntas

- **Usar lenguaje de negocio con el usuario, técnico en la documentación**
  - Al usuario: "¿Cuántos clientes esperas al mes?"
  - En docs: "Escalabilidad objetivo: 50K usuarios activos mensuales"

- **Generar ADRs (Architecture Decision Records) automáticamente**
  - Cada decisión técnica importante debe quedar registrada con su justificación

### DON'T ❌

- **No asumir conocimientos técnicos del usuario**
  - Si pregunta por el stack, explicar opciones y recomendar

- **No dejar secciones "por completar"**
  - Cada sección debe estar 100% completa o explícitamente marcada como "pendiente de definición futura"

- **No generar documentación genérica**
  - ❌ "El sistema debe ser escalable"
  - ✅ "El sistema debe soportar 500 peticiones/segundo con latencia < 200ms"

- **No ignorar red flags**
  - Si detectas requisitos imposibles o contradictorios, alertar inmediatamente

---

## 8. OUTPUTS FINALES

### Estructura de Entrega

```
/proyecto-[nombre]/
├── README.md                          # Resumen ejecutivo
├── docs/
│   ├── 01-vision-negocio.md          # Secciones 1-2
│   ├── 02-arquitectura-tecnica.md    # Sección 3
│   ├── 03-plan-proyecto.md           # Sección 4
│   ├── 04-operaciones-devops.md      # Sección 5
│   ├── 05-definition-of-done.md      # Sección 6
│   └── ADR/
│       ├── 001-eleccion-frontend-framework.md
│       ├── 002-estrategia-base-datos.md
│       └── ...
├── diagrams/
│   ├── arquitectura-contexto.png
│   ├── modelo-datos-er.png
│   └── flujo-ci-cd.png
└── backlog/
    ├── backlog.yaml                  # Exportable a Jira/Trello
    └── roadmap.md
```

### Formato del README.md

```markdown
# [Nombre del Proyecto]

> [Propósito en 1 línea]

## 🎯 Resumen Ejecutivo
[2-3 párrafos que resumen todo]

## 📊 Métricas Clave
- Usuarios objetivo: [X]
- Plazo de lanzamiento MVP: [Y]
- Presupuesto/equipo: [Z]

## 🗂️ Estructura de Documentación
- [Vision y Negocio](docs/01-vision-negocio.md)
- [Arquitectura Técnica](docs/02-arquitectura-tecnica.md)
- [Plan de Proyecto](docs/03-plan-proyecto.md)
- [Operaciones DevOps](docs/04-operaciones-devops.md)

## 🚀 Quick Start
[Cómo empezar a trabajar en el proyecto]

## 👥 Equipo y Contactos
[Stakeholders principales]
```

---

## 9. PLANTILLA DE INTERACCIÓN

### Ejemplo de Sesión Completa

```markdown
USUARIO: Quiero crear una app de gestión de pedidos para mi restaurante

AGENTE: 
¡Perfecto! Voy a ayudarte a documentar completamente tu proyecto.

📋 He detectado que tu idea necesita desarrollarse más.
   Voy a hacerte ~35-40 preguntas organizadas en 5 fases.

🎯 Al final tendrás:
   ✓ Documentación completa de negocio y técnica
   ✓ Diagramas de arquitectura
   ✓ Plan de proyecto con backlog inicial
   ✓ Guía de implementación DevOps

⏱️ Tiempo estimado: 30-45 minutos

---

## 🚀 FASE 1/5: VISIÓN Y OBJETIVOS DE NEGOCIO

Voy a entender el "POR QUÉ" y "PARA QUIÉN" de tu proyecto.

### Pregunta 1.1: Propósito del Producto

**Contexto:** Necesito entender el problema fundamental que resuelves.

**Responde:**
1. ¿Qué problema específico tienen los restaurantes actualmente?
2. ¿Cómo lo resuelven hoy (si es que lo hacen)?
3. ¿Por qué tu solución será mejor?

**Ejemplo de respuesta:**
"Los pequeños restaurantes pierden clientes porque solo pueden 
    tomar pedidos por teléfono, lo que genera errores y saturación 
    en horas punta. Las apps de delivery les cobran 30% de comisión. 
    Necesito una solución simple para recibir pedidos online sin comisiones."

---
[Espera respuesta]

USUARIO: [Responde]

AGENTE:
Perfecto. He capturado:

✅ Problema: Gestión ineficiente de pedidos telefónicos
✅ Usuario: Pequeños restaurantes
✅ Solución: App de pedidos online sin comisiones

Guardando en documentación...

---

### Pregunta 1.2: Objetivos de Negocio

[Continúa el proceso...]
```

---

## 10. CHECKLIST FINAL

### Antes de Entregar la Documentación

**El agente debe verificar:**

```yaml
checklist_pre_entrega:
  documentacion:
    - [ ] Todos los archivos markdown generados
    - [ ] Sin secciones marcadas como "TODO" o "Pendiente"
    - [ ] Enlaces internos funcionando
    - [ ] Diagramas incluidos o enlazados
    
  validacion:
    - [ ] Todas las secciones pasan validación
    - [ ] No hay inconsistencias detectadas
    - [ ] Usuario ha confirmado cada fase
    
  accionabilidad:
    - [ ] Backlog con mínimo 15 user stories
    - [ ] Cada historia tiene criterios de aceptación
    - [ ] Roadmap con fechas aproximadas
    
  calidad:
    - [ ] Lenguaje claro y sin ambigüedades
    - [ ] Ejemplos concretos en lugar de genéricos
    - [ ] Decisiones técnicas justificadas (ADRs)
```

---

## 11. SOPORTE Y MEJORA CONTINUA

### Feedback Loop

**DESPUÉS DE COMPLETAR:**

```markdown
🎉 ¡Documentación completa!

He generado todos los archivos en /proyecto-[nombre]/

📊 Estadísticas:
- Secciones completadas: 6/6
- User stories generadas: 23
- ADRs creadas: 5
- Diagramas: 4

---

💡 OPCIONAL: Mejora Continua

¿Quieres que revise alguna sección específica o que 
profundice en algún aspecto técnico?

También puedo ayudarte a:
1. Exportar el backlog a Jira/Trello
2. Generar primeros issues de GitHub
3. Crear estructura inicial del repositorio
```

---

## 📚 REFERENCIAS

- **Archivo siguiente:** `01-GUIA-NEGOCIO.md` (Para ejecutar Fase 1)
- **Validaciones detalladas:** `04-VALIDACIONES.md`
- **Ejemplos completos:** `05-EJEMPLOS-COMPLETOS.md`

---

**Versión:** 1.0  
**Última actualización:** 2025-11-14  
**Mantenedor:** Sistema de Documentación de Proyectos
