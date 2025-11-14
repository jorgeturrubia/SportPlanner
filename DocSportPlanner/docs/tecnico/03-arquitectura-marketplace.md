```markdown
# 3. ARQUITECTURA MARKETPLACE

---

## Resumen
El marketplace contiene recursos compartidos (ejercicios, sesiones, planificaciones) que los usuarios pueden importar. La arquitectura requiere trazabilidad, versionado y control de importaciones.

## Flujos principales
1. Publicación (Admin/Verificado): crear recurso en `marketplace_*`
2. Visualización: lista y detalle público en el marketplace
3. Importación: usuario pulsa "Importar" → copia atomica a `user_*` con `source_marketplace_id` y `fecha_importacion`
4. Modificación: si el usuario edita, `fue_modificado = true` (no sincronizar desde marketplace)
5. Versionado (Fase 2): mantener `marketplace_versions` para poder revertir

## Estrategia de importación
- Transacción atomica: crear recursos en user_* y relaciones (user_ejercicio_objetivos, user_planificacion_objetivos)
- Guardar log en `user_marketplace_imports` (usuario, tipo, marketplace_id, user_resource_id, fecha)
- Si el recurso es actualizado en marketplace: notificar a usuarios que importaron y opcionalmente ofrecer sincronización (merge preview)

## Seguridad y permisos
- Marketplace es read-only para usuarios (solo admin escribe)
- Validación y verificación por admin (is_verified flag)

## Versionado y rollbacks
- Para cada recurso, mantener `version` y `changelog` si es editable por admins
- Implementar endpoints /sync para re-importar o actualizar resources (con merge vs overwrite)

## Consideraciones de performance
- Index en `marketplace_*` para `tags`, `deporte`, `dificultad` y `rating_promedio`
- Paginación y caching CDN para thumbnails

---
**Estado:** borrador — Detallar endpoints de sincronización y UI/UX de importación en vistas del marketplace
```
