DO $$
DECLARE
    itinerary_id INT;
    t1_id INT;
    t2_id INT;
    t3_id INT;
    c_id INT;
BEGIN
    -- 1. Create Itinerary
    INSERT INTO "MethodologicalItineraries" ("Name", "Description", "SportId", "IsSystem", "Version", "AverageRating", "RatingCount", "IsActive")
    VALUES ('Itinerario Base Baloncesto', 'Itinerario completo para el desarrollo de jugadores de baloncesto.', 101, true, 1, 0, 0, true)
    RETURNING "Id" INTO itinerary_id;

    -- 2. Create Templates
    -- Template 1
    INSERT INTO "PlanningTemplates" ("Name", "Level", "Description", "IsSystem", "Version", "MethodologicalItineraryId", "IsActive")
    VALUES ('Etapa de Iniciación', 1, 'Fundamentos básicos para principiantes.', true, 1, itinerary_id, true)
    RETURNING "Id" INTO t1_id;

    -- Template 2
    INSERT INTO "PlanningTemplates" ("Name", "Level", "Description", "IsSystem", "Version", "MethodologicalItineraryId", "IsActive")
    VALUES ('Etapa de Tecnificación', 2, 'Desarrollo de habilidades técnicas avanzadas.', true, 1, itinerary_id, true)
    RETURNING "Id" INTO t2_id;

    -- Template 3
    INSERT INTO "PlanningTemplates" ("Name", "Level", "Description", "IsSystem", "Version", "MethodologicalItineraryId", "IsActive")
    VALUES ('Etapa de Rendimiento', 3, 'Preparación para la competición de alto nivel.', true, 1, itinerary_id, true)
    RETURNING "Id" INTO t3_id;

    -- 3. Create Concepts and Link to Templates
    
    -- Concepts for Template 1 (Iniciación)
    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Bote de Protección', 'Bote bajo para proteger el balón del defensor.', 101, true, true, 2, 2) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t1_id, c_id, 1);
    
    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Pase de Pecho', 'Pase directo al pecho del compañero.', 101, true, true, 1, 1) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t1_id, c_id, 2);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Tiro Libre', 'Mecánica básica de tiro desde la línea.', 101, true, true, 2, 1) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t1_id, c_id, 3);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Entrada a Canasta', 'Pasos de aproximación y finalización.', 101, true, true, 3, 2) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t1_id, c_id, 4);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Defensa Individual', 'Posición básica defensiva.', 101, true, true, 2, 3) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t1_id, c_id, 5);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Rebote Defensivo', 'Bloqueo y captura del rebote.', 101, true, true, 2, 2) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t1_id, c_id, 6);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Pase Picado', 'Pase con bote previo.', 101, true, true, 2, 2) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t1_id, c_id, 7);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Cambio de Mano por Delante', 'Cambio de dirección básico.', 101, true, true, 3, 2) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t1_id, c_id, 8);


    -- Concepts for Template 2 (Tecnificación)
    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Bote de Velocidad', 'Avance rápido con el balón.', 101, true, true, 4, 3) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t2_id, c_id, 1);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Pase de Beisbol', 'Pase largo a una mano.', 101, true, true, 5, 3) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t2_id, c_id, 2);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Tiro tras Bote', 'Parada y tiro en movimiento.', 101, true, true, 6, 4) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t2_id, c_id, 3);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Eurostep', 'Cambio de dirección en la entrada.', 101, true, true, 7, 5) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t2_id, c_id, 4);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Ayudas Defensivas', 'Rotaciones y ayudas.', 101, true, true, 5, 6) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t2_id, c_id, 5);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Bloqueo Directo (Pick & Roll)', 'Conceptos básicos del bloqueo directo.', 101, true, true, 6, 7) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t2_id, c_id, 6);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Reverso', 'Movimiento de espaldas para superar al defensor.', 101, true, true, 6, 5) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t2_id, c_id, 7);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Finta de Tiro', 'Engaño para desequilibrar al defensor.', 101, true, true, 4, 4) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t2_id, c_id, 8);


    -- Concepts for Template 3 (Rendimiento)
    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Lectura de Bloqueo Indirecto', 'Salir del bloqueo para tirar o penetrar.', 101, true, true, 8, 8) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t3_id, c_id, 1);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Defensa en Zona Press', 'Presión toda la pista.', 101, true, true, 7, 9) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t3_id, c_id, 2);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Tiro de 3 Puntos', 'Mecánica y rango de tiro lejano.', 101, true, true, 8, 6) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t3_id, c_id, 3);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Step Back', 'Generación de espacio para el tiro.', 101, true, true, 9, 7) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t3_id, c_id, 4);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Defensa del Pick & Roll', 'Diferentes estrategias (Flash, Hedge, Switch).', 101, true, true, 8, 9) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t3_id, c_id, 5);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Contraataque Organizado', 'Transición rápida con calles definidas.', 101, true, true, 7, 8) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t3_id, c_id, 6);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Movimientos de Poste Bajo', 'Juego de pies en la pintura.', 101, true, true, 8, 7) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t3_id, c_id, 7);

    INSERT INTO "SportConcepts" ("Name", "Description", "SportId", "IsSystem", "IsActive", "TechnicalDifficulty", "TacticalComplexity") VALUES 
    ('Lectura de Juego', 'Toma de decisiones en tiempo real.', 101, true, true, 9, 10) RETURNING "Id" INTO c_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (t3_id, c_id, 8);

END $$;