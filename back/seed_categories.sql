DO $$
DECLARE
    v_parent_id INT;
BEGIN
    -- 1. Técnica Individual
    INSERT INTO "ConceptCategories" ("Name", "IsActive")
    SELECT 'Técnica Individual', true
    WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Técnica Individual');

    SELECT "Id" INTO v_parent_id FROM "ConceptCategories" WHERE "Name" = 'Técnica Individual';

    INSERT INTO "ConceptCategories" ("Name", "ParentId", "IsActive")
    SELECT 'Cambios Dirección', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Finalizaciones', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Manejo de balón', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Manejo de balón' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Paradas', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Paradas' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Pase', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Pase' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Poste bajo', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Salidas', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Salidas' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Tiro', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Tiro' AND "ParentId" = v_parent_id);

    -- 2. Táctica Individual
    INSERT INTO "ConceptCategories" ("Name", "IsActive")
    SELECT 'Táctica Individual', true
    WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Táctica Individual');

    SELECT "Id" INTO v_parent_id FROM "ConceptCategories" WHERE "Name" = 'Táctica Individual';

    INSERT INTO "ConceptCategories" ("Name", "ParentId", "IsActive")
    SELECT 'Juego con balón', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Juego con balón' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Juego sin balon', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' AND "ParentId" = v_parent_id);

    -- 3. Táctica Colectiva
    INSERT INTO "ConceptCategories" ("Name", "IsActive")
    SELECT 'Táctica Colectiva', true
    WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Táctica Colectiva');

    SELECT "Id" INTO v_parent_id FROM "ConceptCategories" WHERE "Name" = 'Táctica Colectiva';

    INSERT INTO "ConceptCategories" ("Name", "ParentId", "IsActive")
    SELECT 'Bloqueo directo', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Bloqueo indirecto', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Contrataque', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Contrataque' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Juego colectivo', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Juego colectivo' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Mano a mano', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Mano a mano' AND "ParentId" = v_parent_id);

    -- 4. Estrategia
    INSERT INTO "ConceptCategories" ("Name", "IsActive")
    SELECT 'Estrategia', true
    WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Estrategia');

    SELECT "Id" INTO v_parent_id FROM "ConceptCategories" WHERE "Name" = 'Estrategia';

    INSERT INTO "ConceptCategories" ("Name", "ParentId", "IsActive")
    SELECT 'Conceptos de juego', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Conceptos de juego' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Fondos/Bandas', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Fondos/Bandas' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Set VS Individual', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Set VS Individual' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Set VS Zona', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Set VS Zona' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Situaciones especiales ataque', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Situaciones especiales ataque' AND "ParentId" = v_parent_id)
    UNION ALL
    SELECT 'Transición ofensiva', v_parent_id, true WHERE NOT EXISTS (SELECT 1 FROM "ConceptCategories" WHERE "Name" = 'Transición ofensiva' AND "ParentId" = v_parent_id);

END $$;
