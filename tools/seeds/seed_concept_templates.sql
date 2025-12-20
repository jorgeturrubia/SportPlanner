-- Seed data for ConceptTemplates
-- This script creates example templates based on the complexity criteria defined by the user

-- NOTE: Replace {BASKETBALL_SPORT_ID} with the actual Sport ID for Basketball in your database
-- You can find it by running: SELECT "Id" FROM "Sports" WHERE "Name" = 'Basketball';

-- ============================================================================
-- TÉCNICA INDIVIDUAL (Tactical Complexity = 0)
-- ============================================================================

-- Nivel Básico (Technical: 1-3, Tactical: 0)
INSERT INTO "ConceptTemplates" ("Name", "Description", "TechnicalComplexity", "TacticalComplexity", "ConceptCategoryId", "SportId", "IsActive")
VALUES 
('Movimientos Naturales', 'Movimientos que siguen la biomecánica natural del cuerpo. Requieren poca manipulación y coordinación básica. Ejemplos: correr hacia delante, saltar, cambio por delante.', 2, 0, NULL, {BASKETBALL_SPORT_ID}, true),
('Pase Básico', 'Pases fundamentales con técnica simple y natural. Ejemplo: pase de pecho.', 1, 0, NULL, {BASKETBALL_SPORT_ID}, true);

-- Nivel Intermedio (Technical: 4-6, Tactical: 0)
INSERT INTO "ConceptTemplates" ("Name", "Description", "TechnicalComplexity", "TacticalComplexity", "ConceptCategoryId", "SportId", "IsActive")
VALUES 
('Disociación y Engaño', 'Requieren coordinar partes del cuerpo haciendo cosas distintas o involucran fintas. Ejemplos: In & Out, pase tras bote.', 5, 0, NULL, {BASKETBALL_SPORT_ID}, true),
('Bote con Cambio de Dirección', 'Técnicas de bote que requieren cambios coordinados de dirección y velocidad.', 4, 0, NULL, {BASKETBALL_SPORT_ID}, true);

-- Nivel Avanzado (Technical: 7-8, Tactical: 0)
INSERT INTO "ConceptTemplates" ("Name", "Description", "TacticalComplexity", "ConceptCategoryId", "SportId", "IsActive")
VALUES 
('Movimientos Contranatura', 'Movimientos que requieren perder contacto visual con el balón, giros de 360°, o finalizaciones en desequilibrio. Ejemplos: cambio por detrás, Eurostep.', 7, 0, NULL, {BASKETBALL_SPORT_ID}, true);

-- Nivel Élite (Technical: 9-10, Tactical: 0)
INSERT INTO "ConceptTemplates" ("Name", "Description", "TechnicalComplexity", "TacticalComplexity", "ConceptCategoryId", "SportId", "IsActive")
VALUES 
('Combos de Alta Velocidad', 'Combinación de dos o más movimientos avanzados ejecutados a máxima velocidad en espacios reducidos. Ejemplos: doble cambio Under Drag, tiro Fade Away a una pierna.', 10, 0, NULL, {BASKETBALL_SPORT_ID}, true);

-- ============================================================================
-- FINALIZACIONES (Balance entre Técnica y Táctica)
-- ============================================================================

INSERT INTO "ConceptTemplates" ("Name", "Description", "TechnicalComplexity", "TacticalComplexity", "ConceptCategoryId", "SportId", "IsActive")
VALUES 
('Bandeja Básica', 'Finalización fundamental en carrera. Técnica simple con lectura básica del defensor.', 1, 3, NULL, {BASKETBALL_SPORT_ID}, true),
('Aro Pasado', 'Requiere cálculo espacial sin ver el aro directamente y uso del efecto en el tablero.', 6, 5, NULL, {BASKETBALL_SPORT_ID}, true),
('Floater (Bomba)', 'Requiere "soft touch" específico y soltar el balón en punto muerto de gravedad. Muy difícil de replicar consistentemente.', 8, 6, NULL, {BASKETBALL_SPORT_ID}, true);

-- ============================================================================
-- PASES
-- ============================================================================

INSERT INTO "ConceptTemplates" ("Name", "Description", "TechnicalComplexity", "TacticalComplexity", "ConceptCategoryId", "SportId", "IsActive")
VALUES 
('Pase de Pecho', 'Pase simétrico y estable. Base de todos los pases.', 1, 2, NULL, {BASKETBALL_SPORT_ID}, true),
('Pase de Béisbol (Contraataque)', 'Requiere fuerza, cálculo de trayectoria larga y anticipación del movimiento del receptor a distancia.', 7, 5, NULL, {BASKETBALL_SPORT_ID}, true);

-- ============================================================================
-- TÁCTICA - JUEGO CON BALÓN (Alta complejidad táctica)
-- ============================================================================

INSERT INTO "ConceptTemplates" ("Name", "Description", "TechnicalComplexity", "TacticalComplexity", "ConceptCategoryId", "SportId", "IsActive")
VALUES 
('Atacar Closeout', 'Requiere leer velocidad y mano del defensor que cierra. Decisión binaria: frenar o seguir.', 4, 5, NULL, {BASKETBALL_SPORT_ID}, true),
('Corte a Canasta', 'Timing espacial crítico. Requiere leer la defensa y timing perfecto.', 3, 7, NULL, {BASKETBALL_SPORT_ID}, true),
('Pick and Roll Básico', 'Requiere coordinar bote/pase con lectura simultánea de defensa. Nivel medio de lectura táctica.', 4, 8, NULL, {BASKETBALL_SPORT_ID}, true),
('Atacar Cambio Defensivo (Bloqueo Directo)', 'Requiere leer mismatch, spacing de compañeros y ayudas del lado débil. Lectura global del 5x5.', 6, 9, NULL, {BASKETBALL_SPORT_ID}, true),
('Situación ATO (After Time Out)', 'Situaciones especiales diseñadas. Máxima complejidad táctica por múltiples opciones y lecturas.', 5, 10, NULL, {BASKETBALL_SPORT_ID}, true);

-- ============================================================================
-- DEFENSA (Technical Complexity = 0, foco en posicionamiento)
-- ============================================================================

INSERT INTO "ConceptTemplates" ("Name", "Description", "TechnicalComplexity", "TacticalComplexity", "ConceptCategoryId", "SportId", "IsActive")
VALUES 
('Posición Defensiva Básica', 'Fundamentos de posición defensiva. Foco en stance y desplazamiento básico.', 0, 3, NULL, {BASKETBALL_SPORT_ID}, true),
('Defensa de Ayuda', 'Requiere lectura de líneas de pase y posicionamiento anticipado.', 0, 6, NULL, {BASKETBALL_SPORT_ID}, true),
('Defensa de Bloqueos Directos', 'Múltiples opciones defensivas (show, hedge, switch, ice). Requiere comunicación y lectura global.', 0, 8, NULL, {BASKETBALL_SPORT_ID}, true);

-- ============================================================================
-- TIRO
-- ============================================================================

INSERT INTO "ConceptTemplates" ("Name", "Description", "TechnicalComplexity", "TacticalComplexity", "ConceptCategoryId", "SportId", "IsActive")
VALUES 
('Tiro Estático', 'Tiro desde posición estática. Mecánica básica y repetición.', 3, 4, NULL, {BASKETBALL_SPORT_ID}, true),
('Tiro en Suspensión (Jump Shot)', 'Requiere coordinación de salto y liberación. Timing preciso.', 6, 5, NULL, {BASKETBALL_SPORT_ID}, true),
('Tiro Fade Away', 'Tiro cayendo hacia atrás, desequilibrio controlado. Muy alta dificultad técnica.', 9, 6, NULL, {BASKETBALL_SPORT_ID}, true);
