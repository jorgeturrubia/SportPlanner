# Track Specification: Marketplace & Itineraries Management

## Overview
Implementación de un ecosistema de Itinerarios Metodológicos que permite a los usuarios (Entrenadores) descubrir contenido profesional en un Marketplace, "descargarlo" (vincularlo) a su espacio personal y utilizarlo en sus planificaciones. Se garantiza la integridad del contenido original mediante un sistema de referencia (Shadowing) y versionado inmutable.

## Functional Requirements

### 1. Marketplace (Nueva Sección Sidebar)
- **Visualización:** Nueva pestaña principal "Marketplace".
- **Exploración:** Listado de Itinerarios marcados como `IsSystem = true`.
- **Filtros:** Búsqueda por Autor, Valoración (estrellas) y Categoría.
- **Detalle:** Previsualización de conceptos incluidos y autoría profesional.
- **Acción "Descargar":** Vincula el itinerario al usuario actual (crea una entrada en `UserItineraries`).

### 2. Gestión de Itinerarios de Usuario ("Mis Itinerarios")
- **Sección Personal:** Espacio para ver itinerarios propios e itinerarios del sistema vinculados.
- **Distinción Visual:** Los itinerarios del sistema tendrán un badge de "Verificado/Sistema" y el nombre del Autor Original.
- **Edición Controlada (Shadowing):**
  - **Campos Bloqueos:** Nombre, GUID y Categoría (deben ser idénticos al sistema).
  - **Campos Editables:** El usuario puede personalizar la `Descripción` local, añadir `Notas` y asignar sus propios `Ejercicios`.
- **Eliminación:** El usuario puede "desvincular" un itinerario, lo cual lo elimina de su panel sin afectar a la base global.

### 3. Sistema de Valoraciones (Ratings)
- **Regla de Negocio:** 1 voto (1-5 estrellas) por usuario por itinerario.
- **Persistencia:** Tabla `ItineraryRatings` para el histórico.
- **Optimización:** Campos `AverageRating` y `RatingCount` en la tabla principal de Itinerarios, actualizados mediante procesos asíncronos/background tras cada voto.

### 4. Integración con Planificación
- Al crear una planificación, el usuario podrá seleccionar tanto sus conceptos propios como los conceptos de los itinerarios vinculados (Sistema).

## Technical Requirements (Architecture & Infrastructure)

### Data Model
- **Itinerary (Entity):** Añadir `IsSystem (bool)`, `OwnerId (FK)`, `Version (int)`, `SystemSourceId (FK)`, `AverageRating`, `RatingCount`.
- **ItineraryShadow (Entity):** Almacenará las personalizaciones del usuario (Descripción, Ejercicios extra) referenciando al `ItineraryId` y `UserId`.
- **Versionado:** Los Itinerarios del sistema son inmutables. Si se crea una nueva versión en el Marketplace, el usuario mantiene su referencia a la versión original hasta que decida actualizar.

### Backend (.NET 10)
- **Servicios:** MarketplaceService (lectura/filtros), ItineraryService (gestión de copias/sombras).
- **Patrones:** Repository Pattern, DTOs para transferencia de datos y Mappers para la transformación entre entidades de sistema y de usuario.

### Frontend (Angular)
- **Componentes:** 
  - `MarketplaceComponent`: Grid de itinerarios con filtros.
  - `UserItineraryListComponent`: Panel de gestión personal.
  - `ItineraryDetailComponent`: Vista compartida con lógica de edición condicional (read-only en campos core si es de sistema).

## Acceptance Criteria
- [ ] Un usuario puede filtrar itinerarios por autor profesional.
- [ ] Un usuario puede "descargar" un itinerario y verlo en su panel personal.
- [ ] Los campos Nombre y GUID de un itinerario de sistema no son editables por el usuario.
- [ ] Las valoraciones actualizan el promedio global correctamente.
- [ ] Al borrar un itinerario personal, el original del Marketplace permanece intacto.
