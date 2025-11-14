```markdown
# 3. NFRs - Requisitos No Funcionales

---

## Rendimiento
- API p95 latency: < 500ms
- P95 time to first byte (TTFB) en frontend: < 500ms
- Editor Canvas: interacción < 100ms en operaciones comunes (drag/drop)

## Escalabilidad
- Soportar 500 usuarios concurrentes iniciales (MVP)
- Escalar a 5,000 usuarios con configuración mínima (Railway/Supabase Pro)

## Disponibilidad
- Uptime objetivo: 99.5% (MVP)
- RTO/RPO: backups diarios y plan de recuperación básica

## Seguridad
- Autenticación: JWT (Supabase Auth)
- Mitigaciones OWASP Top 10 (XSS, CSRF, injection, etc.)
- Gestión de secretos: variables de entorno protegidas
- Encriptación en tránsito (TLS) y en reposo (storage provisto por Supabase)

## Observabilidad y Telemetría
- Logs estructurados con Serilog/Sentry
- Monitoreo de errores en frontend y backend (Sentry)
- Métricas: request rate, error rate, latency p95

## Mantenibilidad
- Cobertura mínima de tests: 70% (MVP), 80% objetivo
- Lint + CI enforced

## Compliance
- GDPR: solo almacenar datos personales mínimos y permitir export/eliminacion

---
**Estado:** borrador — definir SLIs/SLOs finos y métricas exactas de coste/escala
```
