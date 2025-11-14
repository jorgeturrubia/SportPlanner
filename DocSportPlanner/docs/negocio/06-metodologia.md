```markdown
# 6. METODOLOGIA AGIL

---

## Framework propuesto: Scrum ligero / Kanban híbrido

### Sprints
- Duración: 2 semanas (sprint corto para equipo de 1 persona)
- Objetivo por sprint: entregar 8-12 story points (dependiendo del velocity)

### Ceremonias
- Planning (1 hora cada sprint): planificar backlog y dividir epics
- Daily (15 minutos, async): status updates (opcional en un proyecto de 1 persona)
- Review + Demo (30-45 minutos): mostrar lo construido al final de sprint
- Retrospectiva (30 minutos): mejoras de proceso

### Artefactos
- Product Backlog: backlog/backlog.yaml (documentado y priorizado)
- Sprint Backlog: subset de stories por sprint
- Definition of Done (DoD): tests pasan, PR revisado, documentación actualizada, build pasen
- Definition of Ready (DoR): CRs, designs y dependencias listadas

### Roles
- Product Owner: responsable de priorizar (Fundador)
- Tech Lead / Dev: ejecuta el desarrollo (Fundador)
- QA: testing y validación (puede ser el mismo desarrollador en MVP)

### Definition of Ready
- Story con criterios de aceptación claros
- Mockups / wireframes adjuntos (si es UI)
- Dependencias técnicas identificadas

### Definition of Done
- Código mergeado en main 
- Tests unitarios y E2E ejecutados en CI
- Documentación actualizada (docs/) y release notes
- Incremento desplegado en staging

---
**Estado:** borrador — ajustar ceremonias y DoD según disponibilidad del equipo
```
