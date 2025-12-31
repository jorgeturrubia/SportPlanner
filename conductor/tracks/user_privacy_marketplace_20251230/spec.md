# Spec: Sistema de Privacidad, Propiedad y Marketplace (V2)

## 1. Descripción General
Este track implementa un sistema robusto de propiedad de datos para permitir que el contenido (Conceptos, Categorías, Itinerarios, Templates y Ejercicios) pueda ser tanto del **Sistema** (disponible para todos a través de un Marketplace) como **Privado** del usuario. Los usuarios podrán "descargar" (clonar) contenido del sistema a su área personal para personalizarlo.

## 2. Requerimientos Funcionales

### 2.1 Modelo de Propiedad (Database & Entidades)
- **Campos de Control:** Se añadirá `OwnerId` (UUID/String) e `IsSystem` (Boolean) a las entidades: `SportConcept`, `ConceptCategory`, `MethodologicalItinerary`, `PlanningTemplate` y `Exercise`.
- **Rastreo de Origen:** Se añadirá un campo `OriginSystemId` (del tipo de la PK correspondiente) en las mismas entidades para vincular una copia privada con su versión original del sistema.
- **Separación de Vistas:**
    - **Área Privada:** Los usuarios solo ven ítems donde `OwnerId == CurrentUserId`.
    - **Marketplace:** Los usuarios ven ítems donde `IsSystem == true`.

### 2.2 Mecanismo de "Descarga" (Deep Copy)
- Al descargar un ítem (ej. Itinerario), el sistema realizará una **copia profunda**:
    1. Se crea el nuevo registro con el `OwnerId` del usuario actual.
    2. Se asigna el ID del ítem original al campo `OriginSystemId`.
    3. **Cascada de Dependencias:** Si un Itinerario depende de Conceptos o Categorías, estos también se clonarán al espacio del usuario (si no existen ya como copias del mismo origen) para asegurar la integridad total y permitir edición independiente.

### 2.3 Lógica del Marketplace
- **Estado de Descarga:** El API del Marketplace calculará dinámicamente si un ítem ya ha sido descargado por el usuario (verificando si existe un registro con ese `OriginSystemId` y el `OwnerId` del usuario).
- **Interfaz:** Los ítems ya descargados aparecerán marcados como "Ya descargado" y el botón de descarga se deshabilitará.

### 2.4 Restricciones de Edición
- El contenido del Sistema (`IsSystem == true`) es **solo lectura** para los usuarios normales. 
- Para editar algo del sistema, el usuario debe descargarlo primero.

## 3. Criterios de Aceptación
- [ ] Un usuario A no puede ver las categorías o conceptos creados por el usuario B.
- [ ] El Marketplace muestra correctamente el contenido global.
- [ ] Al descargar un itinerario, se crean copias locales de todos sus conceptos asociados.
- [ ] El API del Marketplace devuelve el flag `IsDownloaded` correctamente.
- [ ] En el frontend, los botones de descarga se bloquean si `IsDownloaded` es true.

## 4. Fuera de Alcance
- Sesiones de entrenamiento, Temporadas y Equipos (seguirán siendo puramente privados por ahora).
- Sincronización automática de cambios del sistema hacia copias de usuario (las copias son independientes tras la descarga).
