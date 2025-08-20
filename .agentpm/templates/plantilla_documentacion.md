# Plantilla para Documentación Consistente

Esta plantilla sirve como fuente de verdad para la documentación del proyecto. Debe usarse siempre con la misma estructura, adaptando el contenido al stack tecnológico, necesidades específicas y versiones recientes de las herramientas.

## 1. Descripción del Producto
- Objetivos principales.
- Funcionalidades clave.
- Público objetivo.
- Requisitos no funcionales (rendimiento, seguridad, etc.).

## 2. Stack Tecnológico
- Lenguajes y frameworks (especifica versiones exactas, e.g., Angular 20, Tailwind CSS v4).
- Bases de datos y servicios.
- Herramientas de desarrollo y deployment.
- Justificaciones para cada elección.

## 3. Arquitectura
- Diagrama textual o descripción de componentes.
- Patrones de diseño (e.g., MVC, Microservicios).
- Flujos de datos.
- Estructura de carpetas y organización del código.

## 4. Buenas Prácticas y Patrones por Tecnología
- **Código General:** Principios SOLID (incluyendo SRP), código limpio.
- **Testing:** TDD recomendado, estrategias de testing específicas.
- **Por Framework/Librería:** 
  - Angular: Mejores prácticas de la versión específica
  - Tailwind: Uso de clases utilitarias, patrones de diseño
  - React: Hooks, componentes funcionales, etc.
  - [Agregar según stack usado]

## 5. Documentación Actualizada y Referencias
- **IMPORTANTE:** Usar FETCH para obtener documentación oficial actualizada
- Enlaces directos a documentación oficial de versiones específicas:
  - Framework principal: [URL oficial]
  - CSS Framework: [URL oficial] 
  - Base de datos: [URL oficial]
  - Otras herramientas: [URLs oficiales]
- Guías de migración si aplica
- Changelog de versiones importantes

## 6. Desarrollo Incremental
- **Metodología:** Desarrollo paso a paso obligatorio
- **Verificación:** Cada cambio debe probarse antes de continuar
- **Estructura:** Orden recomendado de implementación
- **Checkpoints:** Puntos de verificación críticos

## 7. Riesgos y Mitigaciones
- Posibles problemas con versiones recientes.
- Estrategias para mantener consistencia.
- Plan de rollback si es necesario.

## 8. Verificación de Archivos Existentes
- **Antes de crear:** Siempre verificar si existe funcionalidad similar
- **Backend vs Frontend:** Identificar qué partes ya están implementadas
- **Reutilización:** Priorizar extensión sobre creación nueva

**NOTA CRÍTICA:** Esta documentación debe actualizarse usando FETCH para obtener información actualizada de las tecnologías. Nunca asumir prácticas obsoletas.