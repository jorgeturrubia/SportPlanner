# Plan: Sistema de Privacidad, Propiedad y Marketplace

Este plan establece la transición de un modelo de datos global a uno basado en propiedad (propietario vs sistema), incluyendo la lógica de clonación profunda para el Marketplace.

## Fase 1: Infraestructura y Modelado de Datos (Backend)
Configuración de las bases de datos y entidades para soportar multi-tenancy básico.

- [ ] Task: Actualizar Entidades Base y DTOs
  - Añadir `OwnerId`, `IsSystem` y `OriginSystemId` a `SportConcept`, `ConceptCategory`, `MethodologicalItinerary`, `PlanningTemplate` y `Exercise`.
  - Actualizar los DTOs de creación y respuesta para incluir estos campos.
- [ ] Task: Migraciones de Base de Datos
  - Crear y aplicar migración de EF Core para añadir las nuevas columnas.
  - Actualizar `AppDbContext` para configurar índices en `OwnerId` y `OriginSystemId`.
- [ ] Task: Refactorizar Servicio de Usuario Autenticado
  - Asegurar que el `AuthenticatedUserMiddleware` o servicio equivalente extraiga correctamente el `UserId` del JWT para inyectarlo en las peticiones.
- [ ] Task: Conductor - User Manual Verification 'Infraestructura y Modelado de Datos' (Protocol in workflow.md)

## Fase 2: Lógica de Clonación Profunda (Backend - TDD)
Implementación del servicio que permite "descargar" contenido del sistema al área del usuario.

- [ ] Task: TDD - Pruebas Unitarias para Servicio de Clonación
  - Escribir pruebas que verifiquen la copia de un Itinerario con sus Conceptos y Categorías dependientes.
- [ ] Task: Implementar `ICloningService`
  - Lógica para realizar el "Deep Copy" asegurando que se mantengan los `OriginSystemId`.
  - Evitar duplicados si el usuario ya tiene descargada una dependencia (ej. la misma categoría).
- [ ] Task: Actualizar Repositorios y Especificaciones de Consulta
  - Modificar las consultas base para filtrar por `(OwnerId == CurrentUser || IsSystem == true)` según el contexto (Mis Datos vs Marketplace).
- [ ] Task: Conductor - User Manual Verification 'Lógica de Clonación Profunda' (Protocol in workflow.md)

## Fase 3: Marketplace y Flag de Descarga (Backend)
Optimización del API del Marketplace para informar sobre el estado de los ítems.

- [ ] Task: TDD - Pruebas para Flag `IsDownloaded`
  - Verificar que el endpoint del Marketplace marca correctamente los ítems ya existentes en el espacio del usuario.
- [ ] Task: Implementar Lógica `IsDownloaded` en MarketplaceController
  - Optimizar la consulta para cruzar los ítems de sistema con las descargas del usuario actual.
- [ ] Task: Conductor - User Manual Verification 'Marketplace y Flag de Descarga' (Protocol in workflow.md)

## Fase 4: Integración Frontend (Angular)
Actualización de la UI para reflejar la propiedad y habilitar la descarga.

- [ ] Task: Actualizar Modelos y Servicios Angular
  - Sincronizar interfaces TypeScript con los nuevos DTOs del backend.
- [ ] Task: Actualizar Vista de Marketplace
  - Implementar lógica en el componente para deshabilitar botones de descarga basados en `isDownloaded`.
  - Añadir feedback visual de "Copiando..." durante el proceso.
- [ ] Task: Refinar Filtros en Vistas de Configuración
  - Asegurar que en "Mis Conceptos", "Mis Itinerarios", etc., solo se muestren los ítems propiedad del usuario.
- [ ] Task: Conductor - User Manual Verification 'Integración Frontend' (Protocol in workflow.md)

## Fase 5: Verificación Final y Limpieza
- [ ] Task: Pruebas de Integración End-to-End
  - Flujo completo: Usuario ve ítem -> Descarga -> Edita copia local -> Verifica que original sigue intacto.
- [ ] Task: Conductor - User Manual Verification 'Verificación Final y Limpieza' (Protocol in workflow.md)
