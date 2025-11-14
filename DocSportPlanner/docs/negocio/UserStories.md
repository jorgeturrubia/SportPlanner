# USER STORIES - SportPlanner

---

## Resumen del Backlog

**Total de Stories:** 20 Must-Have (MVP)
**Epicas:** 8
**Distribucion:**
- Must-Have (MVP): 20 stories
- Should-Have: 5 stories (Fase 2)
- Could-Have: 4 stories (Fase 3)

---

## EPICA 1: Autenticacion y Perfil de Usuario

### US-001: Registrar cuenta de entrenador

**Como** entrenador nuevo (Carlos)  
**Quiero** crear mi cuenta con email y contrasena  
**Para** empezar a usar SportPlanner

**Prioridad:** Must-Have | **Estimacion:** 3 story points

**Criterios de Aceptacion:**
- [ ] Formulario solicita: email (unico), contrasena (minimo 8 caracteres), nombre completo, deporte principal
- [ ] Validacion de email (formato correcto con regex)
- [ ] Contrasena debe tener minimo 8 caracteres, 1 mayuscula, 1 numero
- [ ] Tras registro exitoso, recibo email de confirmacion (Supabase Auth)
- [ ] Tras confirmar email, puedo hacer login
- [ ] Se crea perfil automaticamente con plan Free
- [ ] Se crea en tabla users con user_id referenciando auth.users

**Notas Tecnicas:**
- Usar Supabase Auth para registro
- Hash de contrasena automatico (bcrypt via Supabase)
- Email template personalizado con logo SportPlanner

---

### US-002: Login de usuario

**Como** usuario registrado (Carlos o Laura)  
**Quiero** hacer login con email y contrasena  
**Para** acceder a mi cuenta

**Prioridad:** Must-Have | **Estimacion:** 2 story points

**Criterios de Aceptacion:**
- [ ] Formulario con email + contrasena
- [ ] Si credenciales correctas: redirige a dashboard segun rol (entrenador -> dashboard principal, director -> dashboard supervisor)
- [ ] Si incorrectas: muestra error "Credenciales invalidas. Verifica tu email y contrasena."
- [ ] Token JWT valido por 7 dias
- [ ] Opcion "Recordarme" guarda refresh token (30 dias)
- [ ] Link "Olvide mi contrasena" funcional
- [ ] Despues de 5 intentos fallidos, bloqueo temporal de 15 minutos

**Notas Tecnicas:**
- JWT token en localStorage (accesible desde Angular)
- Refresh token en httpOnly cookie (seguridad)
- Interceptor HTTP para anadir Bearer token a todas las requests

---

### US-003: Recuperar contrasena olvidada

**Como** usuario que olvido su contrasena  
**Quiero** recibir un email para resetearla  
**Para** volver a acceder a mi cuenta

**Prioridad:** Should-Have | **Estimacion:** 3 story points

**Criterios de Aceptacion:**
- [ ] Formulario con campo email
- [ ] Si email existe: envia email con link de reset (valido 1 hora)
- [ ] Si email NO existe: muestra mismo mensaje (seguridad - no revelar si email existe)
- [ ] Link redirige a formulario de nueva contrasena
- [ ] Formulario solicita: nueva contrasena + confirmar contrasena
- [ ] Al confirmar: contrasena actualizada y sesiones anteriores invalidadas
- [ ] Mensaje: "Contrasena actualizada. Por favor, inicia sesion nuevamente."

---

## EPICA 2: Gestion de Objetivos/Conceptos

### US-004: Crear objetivo de entrenamiento

**Como** Carlos (entrenador)  
**Quiero** crear un objetivo de entrenamiento (ej: "Pase corto")  
**Para** luego usarlo en mis planificaciones

**Prioridad:** Must-Have | **Estimacion:** 5 story points

**Criterios de Aceptacion:**
- [ ] Formulario con campos: nombre (requerido), descripcion (opcional), categoria (select: tecnica/tactica/fisica/psicologica), nivel de dificultad (slider 1-10), tags (array de strings)
- [ ] Puedo seleccionar un "objetivo padre" (dropdown con mis objetivos existentes) para crear jerarquia
- [ ] Si selecciono objetivo padre, sistema valida que no haya ciclo (A padre de B, B padre de A)
- [ ] Visualizacion de dificultad con iconos (1-3: facil, 4-6: medio, 7-10: dificil)
- [ ] Al guardar: objetivo aparece en "Mis Objetivos" inmediatamente
- [ ] Sistema muestra confirmacion: "Objetivo '[nombre]' creado exitosamente"

**Notas Tecnicas:**
- Tabla: user_objetivos
- Validacion de ciclos: algoritmo de grafos (DFS) para detectar ciclos
- Tags: input con autocompletado de tags existentes del usuario

---

### US-005: Ver lista de mis objetivos

**Como** Carlos  
**Quiero** ver todos mis objetivos organizados  
**Para** gestionarlos y usarlos en planificaciones

**Prioridad:** Must-Have | **Estimacion:** 3 story points

**Criterios de Aceptacion:**
- [ ] Vista de lista/grid con tarjetas de objetivos
- [ ] Cada tarjeta muestra: nombre, categoria (icono), dificultad (visual), tags, numero de veces usado
- [ ] Filtros disponibles: categoria (multi-select), rango de dificultad (slider), deporte (si aplica)
- [ ] Busqueda por nombre (search input con debounce 300ms)
- [ ] Ordenamiento: alfabetico, por dificultad (asc/desc), por veces usado (desc)
- [ ] Click en tarjeta: abre modal de detalle con opciones "Editar" y "Eliminar"
- [ ] Boton "Nuevo objetivo" siempre visible (sticky o floating action button)
- [ ] Si no hay objetivos: mensaje con ilustracion "Crea tu primer objetivo para empezar a planificar"

**Notas Tecnicas:**
- Paginacion: 20 objetivos por pagina (infinite scroll o paginacion clasica)
- Cache en frontend (5 minutos) para evitar queries innecesarias

---

### US-006: Editar objetivo existente

**Como** Carlos  
**Quiero** editar un objetivo que cree anteriormente  
**Para** corregir errores o actualizar informacion

**Prioridad:** Must-Have | **Estimacion:** 3 story points

**Criterios de Aceptacion:**
- [ ] Desde vista de lista, click "Editar" abre formulario pre-rellenado
- [ ] Puedo modificar cualquier campo excepto "veces_usado" (readonly)
- [ ] Si cambio objetivo padre: sistema valida que no se creen ciclos
- [ ] Si objetivo tiene "hijos" (otros objetivos que dependen de el): mensaje de advertencia "Este objetivo tiene X objetivos que dependen de el. Los cambios pueden afectar progresiones."
- [ ] Al guardar: campo fue_modificado se actualiza a true si tenia source_marketplace_id
- [ ] Sistema muestra confirmacion: "Objetivo actualizado"

---

### US-007: Eliminar objetivo

**Como** Carlos  
**Quiero** eliminar un objetivo que ya no uso  
**Para** mantener mi biblioteca organizada

**Prioridad:** Must-Have | **Estimacion:** 2 story points

**Criterios de Aceptacion:**
- [ ] Boton "Eliminar" en detalle de objetivo
- [ ] Modal de confirmacion: "Estas seguro de eliminar '[nombre]'? Esta accion no se puede deshacer."
- [ ] Si objetivo esta asociado a ejercicios: mensaje adicional "Este objetivo esta en X ejercicios. Se eliminara de esos ejercicios."
- [ ] Si objetivo esta en planificacion activa: NO permitir eliminar, mostrar error "No puedes eliminar objetivos que estan en planificaciones activas. Archiva la planificacion primero."
- [ ] Al confirmar: soft delete (deleted_at timestamp) o hard delete segun politica
- [ ] Sistema muestra confirmacion: "Objetivo eliminado"

---

## EPICA 3: Editor Visual de Ejercicios

### US-008: Crear ejercicio con canvas visual

**Como** Carlos  
**Quiero** crear un ejercicio de futbol usando un canvas tipo "cancha"  
**Para** poder explicarlo visualmente a mis jugadores

**Prioridad:** Must-Have | **Estimacion:** 13 story points (COMPLEJO)

**Criterios de Aceptacion:**
- [ ] Selecciono deporte (futbol/baloncesto/balonmano) y tipo de cancha (11v11, 7v7, 5v5, etc.)
- [ ] Canvas carga plantilla de cancha correspondiente (imagen de fondo)
- [ ] Barra lateral con elementos arrastrables: jugadores (icono), conos (varios colores), balones, lineas/flechas
- [ ] Puedo arrastrar elementos desde barra lateral al canvas (drag & drop)
- [ ] Cada elemento en canvas es seleccionable (click)
- [ ] Elemento seleccionado tiene handles para: mover, rotar, escalar (solo jugadores y conos)
- [ ] Puedo cambiar color de jugadores (azul/rojo para equipos)
- [ ] Puedo anadir numero a jugadores (1-99)
- [ ] Puedo eliminar elementos (boton "Eliminar" o tecla Delete)
- [ ] Boton "Limpiar canvas" con confirmacion
- [ ] Boton "Deshacer" y "Rehacer" (CTRL+Z, CTRL+Y)
- [ ] Canvas es responsive (se ajusta a diferentes tamanos de pantalla)
- [ ] Zoom in/out con botones o scroll del mouse
- [ ] Boton "Guardar ejercicio" abre modal para ingresar nombre y descripcion

**Notas Tecnicas:**
- Libreria: Fabric.js (canvas HTML5 con manipulacion de objetos)
- Guardar estado del canvas como JSON en campo canvas_data (JSONB en PostgreSQL)
- Thumbnail: generar automaticamente imagen PNG del canvas (canvas.toDataURL) y subir a Supabase Storage

**Ejemplo de estructura JSON:**
```json
{
  "tipo_cancha": "futbol_11v11",
  "elementos": [
    {"tipo": "jugador", "id": "j1", "x": 50, "y": 100, "color": "azul", "numero": 10, "angulo": 0},
    {"tipo": "cono", "id": "c1", "x": 100, "y": 150, "color": "rojo"},
    {"tipo": "balon", "id": "b1", "x": 60, "y": 110}
  ],
  "zoom": 1.0,
  "ancho_canvas": 800,
  "alto_canvas": 600
}
```

---

### US-009: Anadir animaciones basicas a ejercicio

**Como** Carlos  
**Quiero** anadir movimiento a los jugadores y balones  
**Para** mostrar como se ejecuta el ejercicio

**Prioridad:** Must-Have | **Estimacion:** 8 story points

**Criterios de Aceptacion:**
- [ ] Modo "Animacion" togglable (switch entre "Editar" y "Animar")
- [ ] En modo Animacion: click en jugador/balon abre menu contextual con opciones: "Anadir movimiento", "Anadir accion" (pase, tiro, bote)
- [ ] "Anadir movimiento": arrastro para dibujar linea de trayectoria (polyline)
- [ ] Trayectoria tiene puntos intermedios editables (bezier curve o polyline simple)
- [ ] Puedo anadir iconos de accion en la trayectoria: pase (flecha), tiro (arco), bote (icono baloncesto), correr (pies)
- [ ] Sistema asigna orden automatico (1, 2, 3...) a cada animacion
- [ ] Puedo reordenar animaciones (drag & drop de lista de secuencias)
- [ ] Boton "Reproducir animacion" muestra preview (elementos se mueven segun trayectorias con timing)
- [ ] Velocidad de animacion configurable (lenta 3s, normal 2s, rapida 1s por movimiento)
- [ ] Animacion se puede pausar y reiniciar
- [ ] Animaciones se guardan en campo canvas_data junto con elementos estaticos

**Notas Tecnicas:**
- Animaciones con GSAP (GreenSock Animation Platform) o CSS animations via Fabric.js
- Estructura JSON incluye array de animaciones con timing y easing

**Ejemplo de estructura JSON (animaciones):**
```json
{
  "elementos": [...],
  "animaciones": [
    {
      "elemento_id": "j1",
      "tipo_movimiento": "correr",
      "trayectoria": [[50,100], [80,120], [100,150]],
      "duracion_segundos": 3,
      "orden": 1,
      "easing": "linear"
    },
    {
      "elemento_id": "b1",
      "tipo_movimiento": "pase",
      "desde": "j1",
      "hacia": "j2",
      "orden": 2,
      "duracion_segundos": 1
    }
  ]
}
```

---

### US-010: Asociar objetivos a ejercicio

**Como** Carlos  
**Quiero** asociar objetivos a un ejercicio  
**Para** saber que trabaja cada ejercicio

**Prioridad:** Must-Have | **Estimacion:** 3 story points

**Criterios de Aceptacion:**
- [ ] En formulario de crear/editar ejercicio: seccion "Objetivos que trabaja este ejercicio"
- [ ] Dropdown/autocomplete con mis objetivos creados
- [ ] Puedo seleccionar multiples objetivos (multi-select con chips/tags)
- [ ] Cada objetivo muestra su categoria (icono) y dificultad
- [ ] Sistema sugiere objetivos basado en tags del ejercicio (si aplicable)
- [ ] Puedo eliminar objetivos asociados (click en X del chip)
- [ ] Minimo 1 objetivo requerido para guardar ejercicio
- [ ] Al guardar: relacion se crea en tabla user_ejercicio_objetivos

**Notas Tecnicas:**
- Componente de Angular: ng-select o material autocomplete
- Validacion: al menos 1 objetivo requerido

---

### US-011: Exportar ejercicio como imagen

**Como** Carlos  
**Quiero** exportar el ejercicio como imagen PNG  
**Para** imprimirlo o compartirlo por WhatsApp

**Prioridad:** Could-Have | **Estimacion:** 3 story points

**Criterios de Aceptacion:**
- [ ] Boton "Exportar como imagen" en editor de ejercicio
- [ ] Sistema genera imagen PNG del canvas (sin UI, solo cancha y elementos)
- [ ] Resolucion: alta calidad (2x o 3x del tamano visual para impresion)
- [ ] Imagen incluye marca de agua discreta "Creado con SportPlanner" (esquina inferior derecha)
- [ ] Usuario puede descargar imagen directamente (download automatico)
- [ ] Nombre de archivo: "[nombre-ejercicio]-[fecha].png"

**Notas Tecnicas:**
- canvas.toDataURL('image/png') con escala 2x
- Trigger download via anchor element con atributo download

---

## EPICA 4: Planificador de Temporada

### US-012: Crear planificacion de temporada

**Como** Carlos  
**Quiero** crear una planificacion para la temporada  
**Para** organizar que objetivos trabajar cada semana

**Prioridad:** Must-Have | **Estimacion:** 5 story points

**Criterios de Aceptacion:**
- [ ] Formulario con campos: nombre (ej: "Benjamin 2024-25"), descripcion (opcional), deporte (select: futbol/baloncesto/balonmano), fecha inicio (date picker), fecha fin (date picker), entrenamientos por semana (number input 1-7), duracion sesion en minutos (number input)
- [ ] Sistema calcula automaticamente: numero total de semanas (diferencia entre fechas / 7)
- [ ] Sistema calcula: numero total de entrenamientos (semanas * entrenamientos_por_semana)
- [ ] Sistema calcula: tiempo total disponible (entrenamientos * duracion_sesion_minutos)
- [ ] Validaciones: fecha_fin debe ser posterior a fecha_inicio (minimo 4 semanas)
- [ ] Al guardar: planificacion se crea con estado "activa" y progreso 0%
- [ ] Sistema redirige a vista de planificacion mensual/semanal
- [ ] Mensaje de confirmacion: "Planificacion '[nombre]' creada. Ahora anade objetivos."

**Notas Tecnicas:**
- Tabla: user_planificaciones
- Validacion de fechas en frontend y backend
- Calculos de semanas considerando semanas completas

---

### US-013: Anadir objetivos a planificacion (seleccion manual)

**Como** Carlos  
**Quiero** seleccionar objetivos de mi biblioteca y anadirlos a la planificacion  
**Para** definir que trabajare durante la temporada

**Prioridad:** Must-Have | **Estimacion:** 5 story points

**Criterios de Aceptacion:**
- [ ] Vista de planificacion tiene boton "Anadir objetivos"
- [ ] Modal muestra lista de mis objetivos con filtros (categoria, dificultad)
- [ ] Puedo seleccionar multiples objetivos (checkboxes)
- [ ] Sistema muestra info de cada objetivo: nombre, dificultad, categoria, si tiene dependencias (objetivo padre)
- [ ] Al seleccionar: boton "Siguiente" activa
- [ ] Siguiente paso: asignar semanas a cada objetivo (ver US-014)
- [ ] Puedo volver a lista de seleccion sin perder selecciones (navegacion multi-paso)

**Notas Tecnicas:**
- Modal con stepper (paso 1: seleccionar, paso 2: asignar semanas)
- Estado temporal en frontend hasta confirmacion final

---

### US-014: Asignar objetivos a semanas (distribucion manual)

**Como** Carlos  
**Quiero** asignar manualmente en que semanas trabajare cada objetivo  
**Para** tener control total de mi planificacion

**Prioridad:** Must-Have | **Estimacion:** 8 story points

**Criterios de Aceptacion:**
- [ ] Despues de seleccionar objetivos (US-013): pantalla de asignacion temporal
- [ ] Vista muestra: timeline de semanas (1 a N) en eje horizontal
- [ ] Cada objetivo seleccionado aparece como fila
- [ ] Puedo arrastrar "bloques de objetivo" sobre semanas para asignar (drag & drop)
- [ ] Bloque puede abarcar multiples semanas (ej: objetivo en semanas 3-5)
- [ ] Sistema valida dependencias: si objetivo B depende de A (A es padre), B no puede empezar antes de que A termine
- [ ] Si intento violar dependencia: alerta roja "El objetivo '[B]' requiere completar '[A]' primero"
- [ ] Puedo redimensionar bloques (drag de bordes para cambiar semana_inicio/semana_fin)
- [ ] Colores diferentes por categoria (tecnica=azul, tactica=verde, fisica=rojo, psicologica=morado)
- [ ] Vista muestra resumen: "X objetivos asignados, Y semanas cubiertas, Z semanas sin objetivos"
- [ ] Boton "Guardar planificacion" confirma y crea relaciones en user_planificacion_objetivos

**Notas Tecnicas:**
- UI tipo Gantt chart simplificado (libreria: dhtmlx-gantt o custom con D3.js)
- Validacion de dependencias: algoritmo para verificar orden topologico

---

### US-015: Distribucion automatica de objetivos (Algoritmo de Progresion)

**Como** Carlos  
**Quiero** que el sistema distribuya automaticamente los objetivos por semanas  
**Para** ahorrar tiempo y tener una progresion logica

**Prioridad:** Must-Have | **Estimacion:** 13 story points (COMPLEJO - algoritmo)

**Criterios de Aceptacion:**
- [ ] Despues de seleccionar objetivos (US-013): opcion "Distribucion automatica" vs "Distribucion manual"
- [ ] Si elijo automatica: sistema calcula distribucion basandose en:
  - Dificultad de objetivos (faciles al inicio, dificiles al final)
  - Dependencias (objetivos padre antes que hijos)
  - Tiempo disponible (semanas totales)
  - Balance de categorias (no todas las semanas solo tecnica)
- [ ] Sistema asigna semana_inicio y semana_fin a cada objetivo
- [ ] Objetivos de dificultad 1-3: primeras 30% de semanas
- [ ] Objetivos de dificultad 4-6: semanas 30-70%
- [ ] Objetivos de dificultad 7-10: ultimas 30% de semanas
- [ ] Sistema respeta dependencias (grafo topologico)
- [ ] Sistema muestra preview de distribucion antes de confirmar
- [ ] Puedo ajustar manualmente despues de auto-distribucion
- [ ] Boton "Re-calcular distribucion" si cambio objetivos

**Notas Tecnicas:**
- Algoritmo de planificacion con restricciones (CSP - Constraint Satisfaction Problem)
- Ordenamiento topologico para dependencias
- Heuristica de asignacion basada en dificultad y tiempo
- Ver documento separado: "AlgoritmoProgresion.md" para pseudocodigo detallado

---

### US-016: Ver progreso de planificacion

**Como** Carlos  
**Quiero** ver que porcentaje de la planificacion he completado  
**Para** saber si voy bien o atrasado

**Prioridad:** Must-Have | **Estimacion:** 5 story points

**Criterios de Aceptacion:**
- [ ] Dashboard de planificacion muestra barra de progreso prominente
- [ ] Progreso calculado como: (entrenamientos completados / entrenamientos totales) * 100
- [ ] Indicador visual: verde si voy adelantado, amarillo si voy al dia, rojo si atrasado
- [ ] Logica de "atrasado": si fecha actual > semana planificada y entrenamientos < esperados
- [ ] Seccion "Esta semana" muestra: objetivos a trabajar esta semana, entrenamientos realizados vs planificados
- [ ] Seccion "Proximas semanas" muestra: objetivos que vienen (3 semanas siguientes)
- [ ] Si estoy 2+ semanas atrasado: alerta destacada "Estas atrasado X entrenamientos. Considera ajustar tu planificacion."
- [ ] Boton "Ver detalles" muestra estadisticas completas: objetivos completados vs pendientes, distribucion por categoria

**Notas Tecnicas:**
- Calculo en backend via funcion SQL o stored procedure
- Cache de progreso actualizado al completar entrenamientos (trigger o evento)

---

## EPICA 5: Creador de Sesiones de Entrenamiento

### US-017: Crear sesion de entrenamiento estructurada

**Como** Carlos  
**Quiero** crear una sesion de entrenamiento para un dia especifico  
**Para** tener la estructura completa del entrenamiento

**Prioridad:** Must-Have | **Estimacion:** 5 story points

**Criterios de Aceptacion:**
- [ ] Desde calendario: click en dia -> opcion "Crear entrenamiento"
- [ ] Formulario con: nombre (pre-relleno: "Entrenamiento [dia]"), fecha (pre-relleno: dia seleccionado), duracion total (pre-relleno: desde planificacion), objetivos a trabajar (dropdown con objetivos de esa semana de la planificacion)
- [ ] Estructura automatica en 3 partes: Calentamiento (15 min default), Parte principal (60 min default), Vuelta a la calma (15 min default)
- [ ] Puedo ajustar duracion de cada parte (sliders o number inputs)
- [ ] Sistema valida: suma de partes = duracion total
- [ ] Cada parte muestra boton "Anadir ejercicio"
- [ ] Al guardar sin ejercicios: sesion creada pero estado "borrador" (icono diferente en calendario)
- [ ] Mensaje: "Sesion creada. Anade ejercicios para completarla."

**Notas Tecnicas:**
- Tabla: user_sesiones
- Estado: borrador, planificada, en_curso, completada

---

### US-018: Anadir ejercicios a sesion

**Como** Carlos  
**Quiero** anadir ejercicios a cada parte de la sesion  
**Para** completar el entrenamiento

**Prioridad:** Must-Have | **Estimacion:** 8 story points

**Criterios de Aceptacion:**
- [ ] Click "Anadir ejercicio" en una parte: modal con lista de "Mis ejercicios"
- [ ] Filtros automaticos: ejercicios que trabajan objetivos de esta sesion aparecen primero (destacados)
- [ ] Puedo filtrar por: objetivo, categoria, dificultad
- [ ] Puedo buscar por nombre
- [ ] Cada ejercicio muestra: thumbnail (preview del canvas), nombre, duracion recomendada, objetivos que trabaja
- [ ] Click en ejercicio: muestra detalle con canvas completo
- [ ] Boton "Anadir a [parte]"
- [ ] Al anadir: modal solicita configuracion especifica: duracion real (minutos), repeticiones, series, notas (ej: "Enfatizar velocidad")
- [ ] Ejercicio aparece en la parte correspondiente de la sesion
- [ ] Puedo reordenar ejercicios dentro de una parte (drag & drop)
- [ ] Sistema calcula duracion total consumida y muestra progreso vs tiempo disponible
- [ ] Si excedo tiempo: alerta "Estas X minutos sobre el tiempo disponible. Ajusta las duraciones."
- [ ] Puedo eliminar ejercicio de sesion (icono X)

**Notas Tecnicas:**
- Tabla: user_sesion_ejercicios (relacion M-N con orden)
- Calculo de tiempo real-time en frontend

---

### US-019: Ver resumen de sesion completa

**Como** Carlos  
**Quiero** ver el resumen completo de la sesion antes de guardarla  
**Para** validar que esta bien estructurada

**Prioridad:** Must-Have | **Estimacion:** 3 story points

**Criterios de Aceptacion:**
- [ ] Vista resumen tipo "preview" o "timeline"
- [ ] Muestra estructura completa: Calentamiento (X min) -> Parte principal (Y min) -> Vuelta a la calma (Z min)
- [ ] Cada ejercicio con: thumbnail pequeno, nombre, duracion, orden
- [ ] Duracion total destacada en grande: "90 minutos"
- [ ] Objetivos trabajados en esta sesion (lista con iconos)
- [ ] Boton "Editar" vuelve al modo edicion
- [ ] Boton "Guardar y finalizar" cambia estado a "planificada"
- [ ] Mensaje: "Sesion guardada. Lista para ejecutar el [fecha]."
- [ ] Sesion aparece en calendario con icono "lista" (checkmark verde)

---

## EPICA 6: Visualizador de Entrenamientos (Modo Entrenador)

### US-020: Iniciar modo visualizador

**Como** Carlos  
**Quiero** iniciar el modo visualizador desde el calendario  
**Para** ejecutar el entrenamiento en el campo

**Prioridad:** Must-Have | **Estimacion:** 8 story points

**Criterios de Aceptacion:**
- [ ] Desde calendario: click en sesion del dia de hoy
- [ ] Boton "Iniciar entrenamiento" visible y destacado
- [ ] Al hacer click: modo pantalla completa (fullscreen API)
- [ ] Vista muestra:
  - Cronometro en grande (minutos:segundos) con boton Play/Pause
  - Canvas del ejercicio actual (ocupando 60% de pantalla)
  - Nombre del ejercicio actual
  - Objetivos de esta parte (chips con iconos)
  - Indicador de progreso: "Ejercicio 1 de 8"
  - Duracion recomendada del ejercicio en curso
- [ ] Botones de navegacion grandes (touch-friendly, minimo 60px):
  - "Anterior ejercicio"
  - "Siguiente ejercicio"
  - "Pausar/Reanudar"
  - "Finalizar entrenamiento" (rojo, con confirmacion)
- [ ] Boton "Reproducir animacion" (si ejercicio tiene animaciones)
- [ ] Orientacion landscape recomendada (mensaje si esta en portrait en movil)

**Notas Tecnicas:**
- Fullscreen API: document.documentElement.requestFullscreen()
- Wake Lock API para evitar que pantalla se apague (navigator.wakeLock.request('screen'))
- Cronometro con setInterval (JavaScript) actualizado cada segundo
- Canvas renderizado con Fabric.js en modo view-only

---

### US-021: Navegar entre ejercicios en visualizador

**Como** Carlos  
**Quiero** avanzar al siguiente ejercicio durante el entrenamiento  
**Para** seguir la sesion planificada

**Prioridad:** Must-Have | **Estimacion:** 5 story points

**Criterios de Aceptacion:**
- [ ] Boton "Siguiente ejercicio" cambia al siguiente en la lista
- [ ] Cronometro se resetea automaticamente al cambiar de ejercicio
- [ ] Canvas carga el nuevo ejercicio (con transicion fade-in suave)
- [ ] Si ejercicio tiene animacion: boton "Reproducir animacion" activo
- [ ] Si ejercicio tiene notas especificas: aparece tooltip o banner con las notas
- [ ] Indicador actualiza: "Ejercicio 2 de 8"
- [ ] Si llego al ultimo ejercicio: boton "Siguiente" cambia a "Finalizar entrenamiento"
- [ ] Al finalizar ultimo ejercicio: mensaje "Entrenamiento completado!" y confetti animation (opcional)
- [ ] Boton "Anterior ejercicio" permite retroceder (por si me equivoque)

**Notas Tecnicas:**
- Estado de navegacion manejado en componente Angular
- Prevenir cierre accidental de fullscreen con confirmacion

---

### US-022: Finalizar entrenamiento y marcarlo como completado

**Como** Carlos  
**Quiero** finalizar el entrenamiento y marcarlo como completado  
**Para** que se registre en el progreso de mi planificacion

**Prioridad:** Must-Have | **Estimacion:** 3 story points

**Criterios de Aceptacion:**
- [ ] Boton "Finalizar entrenamiento" (visible siempre, en rojo)
- [ ] Modal de confirmacion: "Estas seguro de finalizar? Ejercicios restantes: X"
- [ ] Opciones: "Si, finalizar entrenamiento" o "Cancelar y continuar"
- [ ] Al confirmar:
  - Estado de sesion cambia a "completada"
  - Se guarda timestamp de finalizacion (fecha_finalizacion_real)
  - Progreso de planificacion se actualiza (entrenamientos_completados++)
  - Sale de fullscreen y vuelve al calendario
- [ ] Mensaje de confirmacion: "Entrenamiento completado! Progreso de planificacion: XX%"
- [ ] Sesion aparece en calendario con icono "completado" (checkmark grande verde)
- [ ] Opcional: formulario rapido "Como estuvo el entrenamiento?" (rating 1-5 estrellas + notas)

**Notas Tecnicas:**
- Trigger o funcion SQL para actualizar progreso_porcentaje en user_planificaciones
- Notificacion push (si implementado) celebrando el entrenamiento completado

---

## EPICA 7: Calendario de Entrenamientos

### US-023: Ver calendario mensual de entrenamientos

**Como** Carlos  
**Quiero** ver todos mis entrenamientos en un calendario mensual  
**Para** tener vision global de la temporada

**Prioridad:** Must-Have | **Estimacion:** 8 story points

**Criterios de Aceptacion:**
- [ ] Vista calendario tipo Google Calendar (grid de dias)
- [ ] Cada dia con entrenamiento muestra: icono distintivo, nombre corto de sesion, duracion
- [ ] Estados visuales diferenciados por color:
  - Gris claro: sin entrenamiento planificado
  - Azul: entrenamiento planificado (pendiente)
  - Verde: entrenamiento completado
  - Rojo: entrenamiento perdido (fecha paso y no se hizo)
- [ ] Click en dia con entrenamiento: modal con detalle completo
- [ ] Click en dia vacio: opcion "Crear entrenamiento"
- [ ] Navegacion entre meses: flechas "< Mes anterior" y "Mes siguiente >"
- [ ] Boton "Hoy" para volver rapidamente a fecha actual
- [ ] Vista muestra indicador de mes actual y semana actual (borde destacado)
- [ ] Responsive: en movil, vista puede cambiar a lista (opcional toggle)

**Notas Tecnicas:**
- Libreria: FullCalendar o Angular Material Datepicker con customizacion
- Query eficiente: solo cargar sesiones del mes visible (paginacion temporal)

---

### US-024: Crear sesion rapida desde calendario

**Como** Carlos  
**Quiero** crear una sesion directamente desde un dia del calendario  
**Para** planificar rapido sin tantos pasos

**Prioridad:** Should-Have | **Estimacion:** 5 story points

**Criterios de Aceptacion:**
- [ ] Click en dia vacio: boton "Crear entrenamiento rapido"
- [ ] Modal compacto con: fecha (pre-relleno), objetivos (auto-sugeridos de esa semana), duracion (pre-relleno desde planificacion)
- [ ] Boton "Crear con ejercicios recomendados" (sistema auto-selecciona ejercicios que trabajan esos objetivos)
- [ ] Boton "Crear vacio y personalizar despues"
- [ ] Si elijo "con ejercicios recomendados": sistema crea sesion completa en segundos (usando algoritmo de seleccion)
- [ ] Sesion aparece inmediatamente en calendario con estado "planificada"
- [ ] Puedo editarla despues haciendo click
- [ ] Mensaje: "Entrenamiento creado con X ejercicios. Revisa y ajusta si necesitas."

**Notas Tecnicas:**
- Algoritmo de seleccion: priorizar ejercicios que trabajen objetivos de esa semana, balancear dificultad

---

## EPICA 8: Marketplace de Contenidos (MVP Lite - Fase 2)

### US-025: Explorar marketplace de ejercicios

**Como** Carlos (plan Pro)  
**Quiero** explorar ejercicios creados por el sistema o la comunidad  
**Para** importarlos a mi biblioteca

**Prioridad:** Should-Have (Fase 2 lite) | **Estimacion:** 5 story points

**Criterios de Aceptacion:**
- [ ] Seccion "Marketplace" en menu principal (icono tienda)
- [ ] Vista grid/lista de ejercicios destacados
- [ ] Cada card muestra: thumbnail del canvas, nombre, objetivos que trabaja, rating (estrellas), numero de descargas
- [ ] Filtros laterales: deporte, categoria, rango de dificultad, valoracion minima
- [ ] Busqueda por texto (nombre o tags)
- [ ] Ordenamiento: mas populares (descargas), mejor valorados (rating), mas recientes
- [ ] Click en ejercicio: modal con detalle completo (canvas con zoom, descripcion detallada, objetivos, valoraciones de usuarios)
- [ ] Si soy usuario Free: mensaje "Actualiza a plan Pro para importar ejercicios del marketplace"
- [ ] Si soy plan Pro: boton "Importar a mi biblioteca" visible

**Notas Tecnicas:**
- Query a tabla marketplace_ejercicios con filtros
- Paginacion: 20 ejercicios por pagina

---

### US-026: Importar ejercicio del marketplace

**Como** Carlos (plan Pro)  
**Quiero** importar un ejercicio del marketplace a mi biblioteca  
**Para** usarlo en mis sesiones

**Prioridad:** Should-Have (Fase 2 lite) | **Estimacion:** 3 story points

**Criterios de Aceptacion:**
- [ ] Boton "Importar a mi biblioteca" en detalle de ejercicio (marketplace)
- [ ] Sistema valida que usuario tiene plan Pro o superior
- [ ] Al hacer click: loading spinner mientras se copia
- [ ] Sistema crea copia en tabla user_ejercicios con:
  - Todos los campos copiados (canvas_data, nombre, descripcion, etc.)
  - source_marketplace_id = id del ejercicio original
  - fecha_importacion = NOW()
  - fue_modificado = false
- [ ] Si ejercicio tiene objetivos asociados (marketplace_objetivos): sistema pregunta "Importar tambien los objetivos asociados?" (checkboxes para seleccionar cuales)
- [ ] Sistema crea entradas en user_marketplace_imports (log)
- [ ] Incrementa contador veces_descargado en marketplace_ejercicios
- [ ] Mensaje: "Ejercicio '[nombre]' importado exitosamente. Ya puedes usarlo en tus entrenamientos."
- [ ] Ejercicio aparece en "Mis ejercicios" con badge "Importado"
- [ ] Puedo editarlo libremente (campo fue_modificado cambia a true)

**Notas Tecnicas:**
- Transaccion atomica (todo o nada)
- Si importacion falla: rollback y mensaje de error

---

### US-027: Valorar contenido del marketplace

**Como** Carlos  
**Quiero** valorar ejercicios/planificaciones que importe  
**Para** ayudar a otros usuarios a elegir contenido de calidad

**Prioridad:** Should-Have (Fase 2) | **Estimacion:** 3 story points

**Criterios de Aceptacion:**
- [ ] En detalle de ejercicio (dentro de "Mis ejercicios" si fue importado): link "Valorar este ejercicio"
- [ ] Modal con: rating (1-5 estrellas), comentario opcional (textarea, max 500 caracteres)
- [ ] Solo puedo valorar ejercicios que he importado y usado al menos 1 vez
- [ ] Si ya valide: puedo editar mi valoracion
- [ ] Al guardar: entrada en tabla marketplace_ratings
- [ ] Sistema actualiza rating_promedio y num_ratings en marketplace_ejercicios (trigger automatico)
- [ ] Mensaje: "Gracias por tu valoracion! Ayudas a mejorar la comunidad."

**Notas Tecnicas:**
- Trigger SQL para recalcular rating_promedio despues de INSERT/UPDATE/DELETE en marketplace_ratings

---

## RESUMEN DE ESTIMACIONES

**Total Story Points (Must-Have):** 124 puntos

**Asumiendo:**
- Velocity: 10-15 puntos por sprint (equipo de 1 persona part-time, sprint de 2 semanas)
- Sprints necesarios: 124 / 12.5 (velocity promedio) = **~10 sprints = 20 semanas = 5 meses**

**Distribucion por Epica:**

| Epica | Stories | Story Points | Prioridad |
|-------|---------|--------------|-----------|
| 1. Autenticacion | 3 | 8 | Must-Have |
| 2. Objetivos | 4 | 13 | Must-Have |
| 3. Editor Visual | 4 | 27 | Must-Have (complejo) |
| 4. Planificador | 5 | 36 | Must-Have (critico) |
| 5. Creador Sesiones | 3 | 16 | Must-Have |
| 6. Visualizador | 3 | 16 | Must-Have |
| 7. Calendario | 2 | 13 | Must-Have |
| 8. Marketplace (lite) | 3 | 11 | Should-Have |

---

## ROADMAP SUGERIDO (5 SPRINTS INICIALES)

### Sprint 1-2: Fundamentos
- US-001 a US-003: Autenticacion
- US-004 a US-007: Gestion de objetivos
- US-012: Crear planificacion basica

### Sprint 3-4: Editor Visual (complejo)
- US-008 a US-011: Editor de ejercicios con canvas y animaciones

### Sprint 5-6: Planificador Inteligente
- US-013 a US-016: Asignacion de objetivos y algoritmo de progresion

### Sprint 7-8: Sesiones y Visualizador
- US-017 a US-022: Creador de sesiones y modo entrenador

### Sprint 9-10: Calendario y Pulido
- US-023 a US-024: Calendario completo
- Refinamiento y testing de todo el flujo

---

**Version:** 1.0  
**Ultima actualizacion:** 2025-11-14  
**Estado:** Completo  
**Siguiente:** AlgoritmoProgresion.md
