DO $$
DECLARE
    v_sport_id INT;
    v_itinerary_id INT;
    
    -- Category IDs
    v_cat_ataque INT;
    v_cat_defensa INT;
    
    v_cat_ata_tec INT;
    v_cat_ata_tac_ind INT;
    v_cat_ata_tac_col INT;
    v_cat_ata_est INT;
    
    v_cat_def_tec INT;
    v_cat_def_tac_ind INT;
    v_cat_def_tac_col INT;
    v_cat_def_est INT;
    
    -- Template IDs
    v_tmpl_benjamin INT;
    v_tmpl_alevin INT;
    v_tmpl_infantil INT;
    v_tmpl_cadete INT;
    v_tmpl_junior INT;
    
    -- Temp IDs for linking
    v_concept_id INT;
BEGIN
    -- =================================================================================================
    -- 0. CONFIGURACIÓN INICIAL Y LIMPIEZA
    -- =================================================================================================
    
    -- Obtener o crear Sport ID (Baloncesto)
    -- Sports tiene CreatedAt y UpdatedAt
    SELECT "Id" INTO v_sport_id FROM "Sports" WHERE "Name" = 'Baloncesto';
    IF v_sport_id IS NULL THEN
        INSERT INTO "Sports" ("Name", "IsActive", "CreatedAt", "UpdatedAt") VALUES ('Baloncesto', true, NOW(), NOW()) RETURNING "Id" INTO v_sport_id;
    END IF;

    -- Limpieza de datos anteriores (Itinerario específico)
    SELECT "Id" INTO v_itinerary_id FROM "MethodologicalItineraries" WHERE "Name" = 'Itinerario Baloncesto 2025';
    
    IF v_itinerary_id IS NOT NULL THEN
        -- Eliminar relaciones Template-Concept
        DELETE FROM "PlanningTemplateConcept" WHERE "PlanningTemplateId" IN (SELECT "Id" FROM "PlanningTemplates" WHERE "MethodologicalItineraryId" = v_itinerary_id);
        -- Eliminar Templates
        DELETE FROM "PlanningTemplates" WHERE "MethodologicalItineraryId" = v_itinerary_id;
        -- Eliminar Itinerario
        DELETE FROM "MethodologicalItineraries" WHERE "Id" = v_itinerary_id;
    END IF;

    -- Limpieza de Conceptos "Huerfanos" o mal categorizados (Solo aquellos sin categoría válidos para Baloncesto o creados recientemente)
    -- Para seguridad, borramos los que tengan NULL category id para este deporte
    DELETE FROM "SportConcepts" WHERE "ConceptCategoryId" IS NULL AND "SportId" = v_sport_id;


    -- =================================================================================================
    -- 1. ESTRUCTURA DE CATEGORÍAS (Padres: Ataque/Defensa)
    -- =================================================================================================
    -- ConceptCategories NO tiene CreatedAt/UpdatedAt

    -- ATAQUE
    SELECT "Id" INTO v_cat_ataque FROM "ConceptCategories" WHERE "Name" = 'Ataque' AND "ParentId" IS NULL;
    IF v_cat_ataque IS NULL THEN
        INSERT INTO "ConceptCategories" ("Name", "IsActive", "IsSystem") VALUES ('Ataque', true, true) RETURNING "Id" INTO v_cat_ataque;
    END IF;

    -- DEFENSA
    SELECT "Id" INTO v_cat_defensa FROM "ConceptCategories" WHERE "Name" = 'Defensa' AND "ParentId" IS NULL;
    IF v_cat_defensa IS NULL THEN
        INSERT INTO "ConceptCategories" ("Name", "IsActive", "IsSystem") VALUES ('Defensa', true, true) RETURNING "Id" INTO v_cat_defensa;
    END IF;

    -- Subcategorías ATAQUE
    -- Técnica
    SELECT "Id" INTO v_cat_ata_tec FROM "ConceptCategories" WHERE "Name" = 'Técnica Individual' AND "ParentId" = v_cat_ataque;
    IF v_cat_ata_tec IS NULL THEN INSERT INTO "ConceptCategories" ("Name", "ParentId", "IsActive", "IsSystem") VALUES ('Técnica Individual', v_cat_ataque, true, true) RETURNING "Id" INTO v_cat_ata_tec; END IF;
    -- Táctica Ind
    SELECT "Id" INTO v_cat_ata_tac_ind FROM "ConceptCategories" WHERE "Name" = 'Táctica Individual' AND "ParentId" = v_cat_ataque;
    IF v_cat_ata_tac_ind IS NULL THEN INSERT INTO "ConceptCategories" ("Name", "ParentId", "IsActive", "IsSystem") VALUES ('Táctica Individual', v_cat_ataque, true, true) RETURNING "Id" INTO v_cat_ata_tac_ind; END IF;
    -- Táctica Col
    SELECT "Id" INTO v_cat_ata_tac_col FROM "ConceptCategories" WHERE "Name" = 'Táctica Colectiva' AND "ParentId" = v_cat_ataque;
    IF v_cat_ata_tac_col IS NULL THEN INSERT INTO "ConceptCategories" ("Name", "ParentId", "IsActive", "IsSystem") VALUES ('Táctica Colectiva', v_cat_ataque, true, true) RETURNING "Id" INTO v_cat_ata_tac_col; END IF;
    -- Estrategia
    SELECT "Id" INTO v_cat_ata_est FROM "ConceptCategories" WHERE "Name" = 'Estrategia' AND "ParentId" = v_cat_ataque;
    IF v_cat_ata_est IS NULL THEN INSERT INTO "ConceptCategories" ("Name", "ParentId", "IsActive", "IsSystem") VALUES ('Estrategia', v_cat_ataque, true, true) RETURNING "Id" INTO v_cat_ata_est; END IF;

    -- Subcategorías DEFENSA
    -- Técnica
    SELECT "Id" INTO v_cat_def_tec FROM "ConceptCategories" WHERE "Name" = 'Técnica Individual' AND "ParentId" = v_cat_defensa;
    IF v_cat_def_tec IS NULL THEN INSERT INTO "ConceptCategories" ("Name", "ParentId", "IsActive", "IsSystem") VALUES ('Técnica Individual', v_cat_defensa, true, true) RETURNING "Id" INTO v_cat_def_tec; END IF;
    -- Táctica Ind
    SELECT "Id" INTO v_cat_def_tac_ind FROM "ConceptCategories" WHERE "Name" = 'Táctica Individual' AND "ParentId" = v_cat_defensa;
    IF v_cat_def_tac_ind IS NULL THEN INSERT INTO "ConceptCategories" ("Name", "ParentId", "IsActive", "IsSystem") VALUES ('Táctica Individual', v_cat_defensa, true, true) RETURNING "Id" INTO v_cat_def_tac_ind; END IF;
    -- Táctica Col
    SELECT "Id" INTO v_cat_def_tac_col FROM "ConceptCategories" WHERE "Name" = 'Táctica Colectiva' AND "ParentId" = v_cat_defensa;
    IF v_cat_def_tac_col IS NULL THEN INSERT INTO "ConceptCategories" ("Name", "ParentId", "IsActive", "IsSystem") VALUES ('Táctica Colectiva', v_cat_defensa, true, true) RETURNING "Id" INTO v_cat_def_tac_col; END IF;
    -- Estrategia
    SELECT "Id" INTO v_cat_def_est FROM "ConceptCategories" WHERE "Name" = 'Estrategia' AND "ParentId" = v_cat_defensa;
    IF v_cat_def_est IS NULL THEN INSERT INTO "ConceptCategories" ("Name", "ParentId", "IsActive", "IsSystem") VALUES ('Estrategia', v_cat_defensa, true, true) RETURNING "Id" INTO v_cat_def_est; END IF;


    -- =================================================================================================
    -- 2. CREACIÓN ITINERARIO
    -- =================================================================================================
    -- MethodologicalItineraries NO tiene CreatedAt/UpdatedAt
    INSERT INTO "MethodologicalItineraries" ("Name", "SportId", "IsSystem", "IsActive", "Version", "AverageRating", "RatingCount", "Description")
    VALUES ('Itinerario Baloncesto 2025', v_sport_id, true, true, 1, 5.0, 1, 'Itinerario completo desde Benjamin hasta Junior con enfoque en progresividad táctica y técnica.')
    RETURNING "Id" INTO v_itinerary_id;


    -- =================================================================================================
    -- 3. TEMPLATES Y CONCEPTOS
    -- =================================================================================================
    -- PlanningTemplates NO tiene CreatedAt/UpdatedAt
    -- SportConcepts NO tiene CreatedAt/UpdatedAt

    -- -------------------------------------------------------------------------------------------------
    -- 3.1 BENJAMIN (Level 1)
    -- -------------------------------------------------------------------------------------------------
    INSERT INTO "PlanningTemplates" ("Name", "Code", "Level", "MethodologicalItineraryId", "IsSystem", "IsActive", "Version", "Description")
    VALUES ('Benjamin (8-9 años)', 'BENJAMIN', 1, v_itinerary_id, true, true, 1, 'Iniciación al baloncesto.')
    RETURNING "Id" INTO v_tmpl_benjamin;

    -- Conceptos Benjamin (8)
    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Bote de Protección', 'Uso del cuerpo para proteger el balón del defensor.', v_cat_ata_tec, v_sport_id, 2, 1, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_benjamin, v_concept_id, 1);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Bote de Velocidad', 'Desplazamiento rápido con balón.', v_cat_ata_tec, v_sport_id, 2, 1, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_benjamin, v_concept_id, 2);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Pase de Pecho', 'Pase básico a dos manos directo.', v_cat_ata_tec, v_sport_id, 1, 1, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_benjamin, v_concept_id, 3);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Entrada a Canasta', 'Pasos de aproximación (derecha e izquierda).', v_cat_ata_tec, v_sport_id, 3, 2, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_benjamin, v_concept_id, 4);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Posición Básica Defensiva', 'Flexión de rodillas y equilibrio.', v_cat_def_tec, v_sport_id, 2, 1, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_benjamin, v_concept_id, 5);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Desplazamiento Lateral', 'Movimiento defensivo sin cruzar pies.', v_cat_def_tec, v_sport_id, 2, 1, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_benjamin, v_concept_id, 6);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('1x0 (Toma de decisiones)', 'Atacar el aro libre.', v_cat_ata_tac_ind, v_sport_id, 1, 2, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_benjamin, v_concept_id, 7);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Ocupación de Espacios', 'No agruparse alrededor del balón.', v_cat_ata_tac_col, v_sport_id, 1, 2, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_benjamin, v_concept_id, 8);


    -- -------------------------------------------------------------------------------------------------
    -- 3.2 ALEVIN (Level 2)
    -- -------------------------------------------------------------------------------------------------
    INSERT INTO "PlanningTemplates" ("Name", "Code", "Level", "ParentTemplateId", "MethodologicalItineraryId", "IsSystem", "IsActive", "Version", "Description")
    VALUES ('Alevín (10-11 años)', 'ALEVIN', 2, v_tmpl_benjamin, v_itinerary_id, true, true, 1, 'Desarrollo de fundamentos y juego colectivo básico.')
    RETURNING "Id" INTO v_tmpl_alevin;

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Cambios de Mano (Frontal/Piernas)', 'Fundamentos de dribbling avanzado.', v_cat_ata_tec, v_sport_id, 3, 2, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_alevin, v_concept_id, 1);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Pase de Béisbol', 'Pase de contraataque a una mano.', v_cat_ata_tec, v_sport_id, 3, 2, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_alevin, v_concept_id, 2);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Pasar y Cortar', 'Movimiento básico sin balón.', v_cat_ata_tac_col, v_sport_id, 2, 3, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_alevin, v_concept_id, 3);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Defensa Línea de Pase', 'Negar la recepción del balón.', v_cat_def_tac_ind, v_sport_id, 2, 3, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_alevin, v_concept_id, 4);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Cierre de Rebote', 'Bloquear al atacante para asegurar el balón.', v_cat_def_tac_ind, v_sport_id, 2, 2, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_alevin, v_concept_id, 5);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Ayuda lado débil', 'Concepto de triángulo defensivo.', v_cat_def_tac_col, v_sport_id, 2, 3, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_alevin, v_concept_id, 6);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Tiro tras recepción', 'Parada en un tiempo y tiro.', v_cat_ata_tec, v_sport_id, 3, 2, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_alevin, v_concept_id, 7);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('1x1 con Balón', 'Superar al defensor desde el bote.', v_cat_ata_tac_ind, v_sport_id, 3, 3, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_alevin, v_concept_id, 8);


    -- -------------------------------------------------------------------------------------------------
    -- 3.3 INFANTIL (Level 3)
    -- -------------------------------------------------------------------------------------------------
    INSERT INTO "PlanningTemplates" ("Name", "Code", "Level", "ParentTemplateId", "MethodologicalItineraryId", "IsSystem", "IsActive", "Version", "Description")
    VALUES ('Infantil (12-13 años)', 'INFANTIL', 3, v_tmpl_alevin, v_itinerary_id, true, true, 1, 'Introducción al juego estructurado y táctica grupal.')
    RETURNING "Id" INTO v_tmpl_infantil;

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Reversos y Fajas', 'Cambios de dirección avanzados.', v_cat_ata_tec, v_sport_id, 4, 2, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_infantil, v_concept_id, 1);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Tiro tras bote', 'Pull-up jumper.', v_cat_ata_tec, v_sport_id, 4, 3, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_infantil, v_concept_id, 2);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Bloqueo Directo (Iniciación)', 'Mecánica y uso básico.', v_cat_ata_tac_col, v_sport_id, 3, 4, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_infantil, v_concept_id, 3);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Aclarados', 'Generar espacio para 1x1.', v_cat_ata_tac_col, v_sport_id, 2, 4, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_infantil, v_concept_id, 4);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Defensa del P&R (Pasar)', 'Conceptos básicos de defensa de bloqueo.', v_cat_def_tac_col, v_sport_id, 3, 4, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_infantil, v_concept_id, 5);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Fintas Defensivas', 'Simular ayudas para recuperar.', v_cat_def_tac_ind, v_sport_id, 3, 3, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_infantil, v_concept_id, 6);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Contraataque (Carriles)', 'Estructura de salida rápida.', v_cat_ata_tac_col, v_sport_id, 2, 3, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_infantil, v_concept_id, 7);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Balance Defensivo', 'Transición defensa-ataque organizada.', v_cat_def_tac_col, v_sport_id, 2, 3, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_infantil, v_concept_id, 8);


    -- -------------------------------------------------------------------------------------------------
    -- 3.4 CADETE (Level 4)
    -- -------------------------------------------------------------------------------------------------
    INSERT INTO "PlanningTemplates" ("Name", "Code", "Level", "ParentTemplateId", "MethodologicalItineraryId", "IsSystem", "IsActive", "Version", "Description")
    VALUES ('Cadete (14-15 años)', 'CADETE', 4, v_tmpl_infantil, v_itinerary_id, true, true, 1, 'Especialización táctica y lectura de juego.')
    RETURNING "Id" INTO v_tmpl_cadete;

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Triple Amenaza Efectiva', 'Uso avanzado de pies y fintas.', v_cat_ata_tec, v_sport_id, 4, 3, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_cadete, v_concept_id, 1);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Bloqueo Indirecto', 'Pin down, carretones.', v_cat_ata_tac_col, v_sport_id, 4, 5, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_cadete, v_concept_id, 2);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Lectura P&R', 'Tomar decisiones según la defensa.', v_cat_ata_tac_col, v_sport_id, 4, 6, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_cadete, v_concept_id, 3);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Defensa de Zonas', 'Conceptos de zona 2-3, 3-2.', v_cat_def_est, v_sport_id, 3, 5, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_cadete, v_concept_id, 4);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Ataque contra Zona', 'Sobrecarga y movimiento de balón.', v_cat_ata_est, v_sport_id, 3, 5, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_cadete, v_concept_id, 5);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Trap / 2x1', 'Defensa agresiva y rotaciones.', v_cat_def_tac_col, v_sport_id, 4, 6, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_cadete, v_concept_id, 6);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Euro Step / Paso Cero', 'Finalizaciones modernas.', v_cat_ata_tec, v_sport_id, 5, 3, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_cadete, v_concept_id, 7);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Sistemas de Fondo/Banda', 'Jugadas de pizarra (SLOB/BLOB).', v_cat_ata_est, v_sport_id, 2, 5, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_cadete, v_concept_id, 8);


    -- -------------------------------------------------------------------------------------------------
    -- 3.5 JUNIOR (Level 5)
    -- -------------------------------------------------------------------------------------------------
    INSERT INTO "PlanningTemplates" ("Name", "Code", "Level", "ParentTemplateId", "MethodologicalItineraryId", "IsSystem", "IsActive", "Version", "Description")
    VALUES ('Junior (16-17 años)', 'JUNIOR', 5, v_tmpl_cadete, v_itinerary_id, true, true, 1, 'Rendimiento y complejidad estratégica.')
    RETURNING "Id" INTO v_tmpl_junior;

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Lecturas Avanzadas P&R', 'Re-pick, reject, split.', v_cat_ata_tac_col, v_sport_id, 5, 7, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_junior, v_concept_id, 1);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Ajustes Defensivos (Switch)', 'Cambio defensivo y mismatch.', v_cat_def_est, v_sport_id, 4, 7, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_junior, v_concept_id, 2);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Sistemas Complejos', 'Horns, Diamond, Zipper.', v_cat_ata_est, v_sport_id, 3, 7, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_junior, v_concept_id, 3);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Tiro Rango Extendido', 'Mecánica para tiro de 3 lejano.', v_cat_ata_tec, v_sport_id, 6, 3, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_junior, v_concept_id, 4);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Gestión Final Partido', 'Uso de faltas y reloj.', v_cat_ata_est, v_sport_id, 1, 8, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_junior, v_concept_id, 5);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Scouting Rival', 'Adaptación del plan de juego.', v_cat_def_est, v_sport_id, 1, 8, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_junior, v_concept_id, 6);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Juego de Contactos', 'Absorber contacto en finalizaciones.', v_cat_ata_tec, v_sport_id, 5, 4, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_junior, v_concept_id, 7);

    INSERT INTO "SportConcepts" ("Name", "Description", "ConceptCategoryId", "SportId", "TechnicalDifficulty", "TacticalComplexity", "IsSystem", "IsActive") VALUES
    ('Transición Llegar Jugando', 'Early offense.', v_cat_ata_tac_col, v_sport_id, 3, 6, true, true) RETURNING "Id" INTO v_concept_id;
    INSERT INTO "PlanningTemplateConcept" ("PlanningTemplateId", "SportConceptId", "Order") VALUES (v_tmpl_junior, v_concept_id, 8);

END $$;
