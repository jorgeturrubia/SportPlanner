```markdown
# DIAGRAMAS DE ARQUITECTURA

---

## C4 - Context
```mermaid
graph TB
    Usuario((Usuario))
    APP["Frontend: SportPlanner (Angular)"]
    API["Backend: API (.NET)"]
    DB[(PostgreSQL - Supabase)]
    STORAGE["Supabase Storage"]
    APP -->|HTTPS| API
    API -->|SQL| DB
    API -->|Storage| STORAGE
    Usuario -->|Interaccion| APP
```

## C4 - Contenedores
```mermaid
graph TB
  subgraph Frontend
    SPA["Angular SPA"]
  end
  subgraph Backend
    API["ASP.NET Core API"]
    SVC["Services / Domain Logic"]
  end
  DB[(Supabase PostgreSQL)]
  STORAGE["Supabase Storage"]
  SPA -->|REST/GraphQL| API
  API --> DB
  API --> STORAGE
```

## Diagrama ER
Ver `docs/tecnico/ModeloDatos.md` para un ER completo (Mermaid incluido en ese archivo)

---
**Estado:** borrador — Exportar archivos de imagen en `diagrams/` y referenciarlos desde aquí
```
