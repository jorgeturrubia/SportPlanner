# 1. VISION Y OBJETIVOS DE NEGOCIO

---

## 1.1. Proposito del Producto

**SportPlanner** es una plataforma de planificacion deportiva que permite a entrenadores de nivel amateur crear planificaciones progresivas y entrenamientos visuales de forma rapida y eficiente, con acceso a un marketplace de contenidos validados por la comunidad, eliminando la complejidad de herramientas profesionales costosas.

### Elevator Pitch

"Una herramienta de planificacion deportiva para entrenadores amateurs que crea entrenamientos progresivos en minutos (no horas), con un editor visual de ejercicios tipo 'cancha digital' y acceso a contenidos validados por la comunidad, por una suscripcion accesible."

### Problema que Resuelve

Los entrenadores amateurs enfrentan:
- **Tiempo excesivo:** 4+ horas semanales planificando entrenamientos en Excel/papel
- **Falta de visualizacion:** Dificultad para explicar ejercicios sin herramientas visuales
- **Herramientas caras:** Apps profesionales cuestan 100+ euros/mes (inalcanzable para amateurs)
- **Perdida de informacion:** Planificaciones en papel se pierden, sin historial
- **Reinventar la rueda:** Crear ejercicios desde cero cada semana

### Solucion Propuesta

SportPlanner ofrece:
- **Creacion rapida:** De 4 horas a 30 minutos (87% reduccion)
- **Editor visual:** Canvas tipo "cancha digital" con drag & drop
- **Marketplace:** Ejercicios, sesiones y planificaciones validadas para importar
- **Progresion inteligente:** Algoritmo que distribuye objetivos por semanas
- **Precio accesible:** Desde 5,99 euros/mes (vs 100+ euros de competencia)
- **Todo en la nube:** Nunca pierdes tu trabajo

### Usuario Objetivo

**Primario:** Entrenadores amateurs de deportes de equipo (futbol, baloncesto, balonmano)
- Edad: 25-50 anos
- Entrenan equipos base/juveniles (2-3 veces/semana)
- No tienen presupuesto para software profesional
- Nivel tecnologico: Medio (usan apps comunes)
- Trabajan part-time como entrenadores

**Secundario (Fase 3):** Directores deportivos de clubs pequenos
- Gestionan 3-8 equipos
- Necesitan supervisar planificaciones de entrenadores
- Buscan estandarizacion

---

## 1.2. Objetivos de Negocio y KPIs

| # | Objetivo | KPI | Meta | Plazo | Metodo de Medicion |
|---|----------|-----|------|-------|--------------------|
| 1 | Reducir tiempo de creacion de planificaciones | Tiempo promedio de creacion de planificacion mensual | De 4 horas a 30 minutos | 6 meses | Timestamp inicio sesion - timestamp guardado final |
| 2 | Captar entrenadores amateurs | Usuarios registrados activos | 500 entrenadores | 12 meses | Usuarios con minimo 1 planificacion creada en ultimos 30 dias |
| 3 | Validar modelo de negocio | Tasa de conversion free a premium | 15% de usuarios free | 9 meses | (Suscripciones activas / Total usuarios) * 100 |
| 4 | Crear comunidad de contenidos | Ejercicios/planificaciones en marketplace | 200 items validados | 12 meses | Count de items con rating minimo 4/5 estrellas |
| 5 | Retencion de usuarios | Tasa de retencion a 3 meses | Minimo 70% | 6 meses | Usuarios activos mes 3 / Usuarios registrados mes 0 |

### Metricas Secundarias

- **Engagement:** Tiempo promedio en app por sesion > 15 minutos
- **Calidad:** Rating promedio de app > 4.2/5 estrellas
- **Viralizacion:** NPS (Net Promoter Score) > 40
- **Marketplace:** 30% de usuarios importan contenido del marketplace

---

## 1.3. Alcance y Funcionalidades Core (MVP - Fase 1)

### Must-Have (Critico para Lanzamiento)

#### 1. Gestion de Usuarios
- Registro y login con autenticacion segura (Supabase Auth)
- Perfiles de entrenador con deportes especializados
- Gestion de suscripcion (free/premium)

#### 2. Creador de Conceptos/Objetivos
- CRUD de objetivos con estructura jerarquica (objetivo padre a sub-objetivos)
- Asignacion de nivel de dificultad (1-10) y dependencias
- Tags por categoria (tecnica, tactica, fisica, psicologica)
- Vinculacion de objetivos "padre" para progresion

#### 3. Editor Visual de Ejercicios
- Canvas digital tipo "cancha" con plantillas por deporte (baloncesto, futbol, balonmano)
- Elementos arrastrables: jugadores, conos, balones, lineas
- Animaciones basicas: movimiento de jugadores, pases, trayectorias
- Sistema de numeracion de secuencias (1, 2, 3...)
- Exportar ejercicio como imagen o animacion
- Preview de animacion (reproducir movimientos)

#### 4. Planificador de Temporada
- Creacion de planificacion con: fecha inicio/fin, dias entrenamiento/semana, duracion sesion
- Seleccion de objetivos para la temporada
- Algoritmo de distribucion automatica de objetivos por semanas (progresion)
- Vista de planificacion mensual/semanal (calendario)
- Indicadores de progreso (% completado)

#### 5. Creador de Sesiones de Entrenamiento
- Construccion de sesion: Calentamiento + Parte principal + Vuelta a la calma
- Anadir ejercicios a cada parte con duracion y repeticiones
- Vista previa de la sesion completa
- Validacion de duracion total vs tiempo disponible
- Asociacion automatica de objetivos trabajados

#### 6. Visualizador de Entrenamientos (Modo Entrenador)
- Modo presentacion: Cronometro + ejercicio actual (canvas) + objetivos
- Navegacion: Siguiente/Anterior/Pausar/Finalizar
- Vista en pantalla completa optimizada para tablet/movil
- Reproducir animaciones de ejercicios
- Marcar sesion como completada

#### 7. Calendario de Entrenamientos
- Vista mensual con entrenamientos programados
- Estados visuales: sin planificar / planificado / completado
- Click en dia para ver detalle o crear sesion
- Navegacion entre meses

### Should-Have (Importante, no bloqueante MVP)

#### 8. Marketplace de Contenidos (Fase 2 lite en MVP)
- Navegacion de ejercicios y planificaciones publicas del sistema
- Sistema de valoracion (1-5 estrellas)
- Funcion "Importar a mi biblioteca"
- Filtros por deporte, categoria, dificultad

#### 9. Estadisticas Basicas
- Dashboard con progreso de la planificacion (% completado)
- Objetivos trabajados esta semana vs planificados
- Horas de entrenamiento acumuladas
- Grafica de progresion temporal

### Could-Have (Nice-to-have)

- Exportar planificacion a PDF
- Compartir planificacion via enlace publico
- Duplicar planificaciones de temporadas anteriores
- Notificaciones push para proximos entrenamientos
- Modo offline (PWA)

---

## 1.4. Exclusiones (Fuera de Alcance - MVP)

### Funcionalidades Excluidas de la Fase 1 (MVP)

| # | Funcionalidad | Razon | Fase Planeada |
|---|---------------|-------|---------------|
| 1 | Marketplace completo con creacion de contenidos por usuarios | Necesita moderacion, sistema de pagos/creditos, y masa critica de usuarios | Fase 2 (meses 6-12) |
| 2 | Seccion Director Deportivo | Requiere jerarquia de usuarios (club - director - entrenadores) y flujos de aprobacion | Fase 3 (meses 12-18) |
| 3 | CRM Completo de Club | Scope muy amplio (gestion economica, instalaciones, subvenciones). Necesita validacion de Fases 1-3 primero | Fase 4 (meses 18-24) |
| 4 | App Movil Nativa (iOS/Android) | Angular responsive cubre dispositivos moviles. Nativa necesita recursos adicionales | Post-MVP (meses 12+) |
| 5 | Integraciones con Terceros | Google Calendar, Strava, plataformas de video. No critico para validacion del core value | No planificado Fase 1 |
| 6 | Multi-idioma (i18n) | Lanzamiento en espanol primero. i18n cuando haya traccion | Fase 2 (si hay demanda) |
| 7 | Sistema de Pagos (Suscripciones) | MVP sera free para validar. Pasarela de pago se anade tras validacion | Fase 1.5 (mes 9-10) |
| 8 | Comunicacion en tiempo real (chat) | No esencial para MVP. Director-entrenador puede usar WhatsApp temporalmente | Fase 3 |
| 9 | Gestion de asistencia de jugadores | Feature interesante pero no core. Puede hacerse manual | Fase 2-3 |
| 10 | Generacion automatica de ejercicios con IA | Muy complejo. Marketplace cubre necesidad de contenido | Investigacion futura |

---

## 1.5. Stakeholders y Roles Clave

### Equipo del Proyecto

| Rol | Nombre | Contacto | Responsabilidad | Disponibilidad |
|-----|--------|----------|-----------------|----------------|
| Product Owner / Fundador | [Tu Nombre] | [Tu Email] | Vision de producto, decisiones de negocio, priorizacion | Part-time (~20h/semana) |
| Tech Lead / Arquitecto | [Tu Nombre] | [Tu Email] | Arquitectura tecnica, decision de stack, code reviews | Part-time (~20h/semana) |
| Frontend Developer (Angular) | [Tu Nombre] | [Tu Email] | UI/UX con Angular 20+, Tailwind 4, animaciones | Part-time (~15h/semana) |
| Backend Developer (.NET) | [Tu Nombre] | [Tu Email] | API REST, logica de negocio, algoritmos de progresion | Part-time (~15h/semana) |
| UX/UI Designer | [Freelance / Plantillas] | - | Wireframes, mockups, design system | Segun necesidad |
| QA / Tester | [Tu Nombre] | [Tu Email] | Testing manual, validacion de algoritmos | Part-time (~5h/semana) |

**Nota:** Como equipo de 1 persona part-time, el fundador asume todos los roles.

### Matriz de Decisiones (RACI)

| Decision | Product Owner | Tech Lead | Developers | Designer |
|----------|---------------|-----------|------------|----------|
| Priorizacion de features | **A** | C | C | I |
| Arquitectura tecnica | C | **A** | R | I |
| Diseno de algoritmo de progresion | **A** | **A** | R | I |
| Diseno visual de interfaces | C | I | I | **A** |
| Definicion de modelo de datos | C | **A** | R | I |
| Eleccion de stack tecnologico | **A** | **A** | C | I |
| Aprobacion de lanzamiento | **A** | C | I | I |

**Leyenda:**
- **R** = Responsible (Ejecuta)
- **A** = Accountable (Decide y aprueba)
- **C** = Consulted (Se le consulta)
- **I** = Informed (Se le informa)

---

## 1.6. Restricciones del Proyecto

### Restricciones de Recursos

| Tipo | Restriccion | Impacto |
|------|-------------|---------|
| **Tiempo** | Desarrollo part-time (~20h/semana) | Timeline extendido (12-18 meses para MVP completo) |
| **Presupuesto** | Minimo (servicios managed gratuitos/baratos) | Stack basado en Supabase (free tier), Vercel (free), Railway (low cost) |
| **Equipo** | 1 persona | Priorizacion extrema, MVP muy reducido, usar servicios managed |
| **Conocimiento** | Aprendizaje de Angular 20+ y .NET 10 | Curva de aprendizaje incluida en timeline |

### Restricciones Tecnicas

- **Infraestructura:** Debe usar servicios managed (sin DevOps complejo)
- **Escalabilidad inicial:** Optimizar para 100-500 usuarios (no premature optimization)
- **Compatibilidad:** Web responsive (no apps nativas en MVP)
- **Base de datos:** PostgreSQL (via Supabase) - sin migraciones complejas

### Restricciones de Negocio

- **Modelo de negocio:** Freemium (no ventas B2B enterprise en Fase 1)
- **Mercado inicial:** Espana (no internacionalizacion en MVP)
- **Legal:** Cumplir GDPR basico (sin asesoria legal profesional inicial)

---

**Version:** 1.0  
**Ultima actualizacion:** 2025-11-14  
**Estado:** Completo  
**Proxima seccion:** [User Personas](02-user-personas.md)