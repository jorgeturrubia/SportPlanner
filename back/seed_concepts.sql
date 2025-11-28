DO $$
DECLARE
    v_cat_id INT;
BEGIN
    -- Bote escapatoria
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Bote escapatoria', 'Gesto técnico importante. Cómo se hace: Importante desbloquear la muñeca, para colocar la mano delante del balón, y botar hacia atrás. Pasos cortos y rápidos para poder moverse rápido hacia atrás, con un solo bote. Este bote debo dejarlo libre en la mano, girando el balón en la palma de mano, sin colocar nunca la mano debajo del balón. Cuándo se hace: En situaciones de bloqueo directo cuando me saltan al 2x1 o al show. En situaciones de 2x1 de presión en toda la pista.', 'https://youtu.be/dZRyT-oHN_g', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Bote escapatoria' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Bote lateral
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Bote lateral', 'Para ser capaz de hacer bien el bote lateral es importante dominar varios aspectos: 1. Desbloquear muñeca para poner la mano en una lateral del balón y botar fuerte 2. Disociar bote y pies. Dar el máximo número de apoyos para avanzar. Girar un poco la cadera y cruzar los pies para llegar lo antes posible al punto de destino. No desplazamientos laterales como en defensa. 3. Dejar el bote libre en la palma de la mano para que gire, sin poner la mano debajo del balón.', 'https://youtu.be/oPVTlJwTBUU', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Bote lateral' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Cambio debajo de piernas
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Cambio debajo de piernas', NULL, 'https://youtu.be/dAyxIYeP_PA', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Cambio debajo de piernas' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Cambio por delante
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Cambio por delante', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Cambio por delante' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Cambio por detrás
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Cambio por detrás', NULL, 'https://youtu.be/VVIsHHELmsc', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Cambio por detrás' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Cambio por detrás velocidad
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Cambio por detrás velocidad', 'Cómo se hace: Para hacer este cambio es importante colocar la mano justo detrás del balón. Muchas veces en iniciación se comete el error de poner la mano debajo y no se le da impulso. Importante colocar mano detrás y adelantar el cuerpo. Cuándo se hace: Recurso interesante en campo abierto, contraataque y transiciones. Para evitar un defensor que pretende robar el balón.', 'https://youtu.be/aco0FWDXBCE', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Cambio por detrás velocidad' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Cambios de dirección
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Cambios de dirección', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Cambios de dirección' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Doble cambio. Debajo + delante
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Doble cambio. Debajo + delante', NULL, 'https://youtu.be/2n_uP5teyUA', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Doble cambio. Debajo + delante' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Doble cambio. Debajo / detrás
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Doble cambio. Debajo / detrás', NULL, 'https://youtu.be/rQmSQJH269M', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Doble cambio. Debajo / detrás' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Doble cambio. Detras + delante
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Doble cambio. Detras + delante', NULL, 'https://youtu.be/yc-biQM9C0Q', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Doble cambio. Detras + delante' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Doble por detrás
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Doble por detrás', NULL, 'https://youtu.be/CpLmBw6dqCU', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Doble por detrás' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Doble. Under drag / delante
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Doble. Under drag / delante', NULL, 'https://youtu.be/OmhBJSRWMKo', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Doble. Under drag / delante' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Dobles cambios
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Dobles cambios', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Dobles cambios' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Entre piernas reverse
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Entre piernas reverse', 'Cambio por debajo de las piernas de atrás hacia delante, para volver a la misma mano. Cómo se hace: Pequeño momento de pausa, similar a un stop and go. Con el balón atrás, simulando un pase por detrás de la espalda, se cambia por debajo de las piernas, para que el balón vuelva a la misma mano. Cuándo se hace: En mismas situaciones que un stop and go. De esta manera se hace dudar al defensa, para poder atacar de nuevo. En los cambios defensivos en bloqueo directo es muy utilizado.', 'https://youtu.be/vatQiG8gUJ4', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Entre piernas reverse' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Finta de penetración
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Finta de penetración', NULL, 'https://youtu.be/NFdUx6ivCOg', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Finta de penetración' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- In & out
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'In & out', NULL, 'https://youtu.be/v-g2KdSR3_o', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'In & out' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Jab cross
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Jab cross', 'Cambio de dirección de dificultad media. Cómo se hace: Cambio por delante, a la misma vez que se finta con el cuerpo hacia la dirección contraria. Lo más complicado del cambio es coordinar que el balón vaya a un lado y el cuerpo al otro. Importante separar el balón del cuerpo y dejar todo el peso sobre la finta. A partir de ahí un fuerte impulso para sobrepasar al defensor. Cuándo se puede aplicar: El defensor tiene que estar a cierta distancia del atacante. Ideal para 1x1 en carrera o en cambios de asignación tras bloqueos directos cuando un hay un mismatch y el interior queda hundido.', 'https://youtu.be/1_9nqqanix8', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Jab cross' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Latigo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Latigo', NULL, 'https://youtu.be/in8XqNvTbzE', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Latigo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Reverso
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Reverso', NULL, 'https://youtu.be/M0t_7FnnEtE', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Reverso' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Scissors step
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Scissors step', NULL, 'https://youtu.be/PHGXx4MvmaM', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Scissors step' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Shot fake hesitation
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Shot fake hesitation', 'Vídeo: Xuancar Navarro', 'https://youtu.be/sgV4rjRJpOM', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Shot fake hesitation' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Shoulder hesitation
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Shoulder hesitation', 'Acción similar al stop and go. Cómo se hace: En situaciones de 1x1, girar cadera y pies para orientarnos a línea de banda, con una pequeña parada. Con esto buscamos que el defensor se relaje un segundo. Tras esto, atacar agresivo saliendo con el pie que queda atrás.', 'https://youtu.be/qKm9FZNuMsQ', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Shoulder hesitation' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Skip Step
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Skip Step', 'Acción de juego sobre bote, que consiste en repetir un pie de apoyo, mientas mantenemos el bote vivo en la palma de la mano, sin colocar la mano debajo. Muy habitual para atacar cambios defensivos, obtener momentos de pausa, y tras bloqueo directo. Es una situación sencilla de entrenar, que puede generar ventajas en 1x1, ya que tras el skip step suele existir un cambio de ritmo.', 'https://youtu.be/7qjDQAFTvPI', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Skip Step' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Stop & go
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Cambios Dirección' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Stop & go', 'Acción técnica simple que se puede usar en muchos momentos. Cómo se hace: En situaciones donde se ataca con bote, cambiar el ritmo drásticamente. Parar nuestra velocidad, para que el defensor pare con nosotros, y después volver a arrancar para generar una ventaja. Dejar el bote vivo, simular con el cuerpo que ya no se pretende atacar. Cuándo se hace: Muy común en situaciones de bloqueo directo para atacar al jugador grande. En campo abierto para atacar en 1x1.', 'https://youtu.be/xEB6XKuM3FI', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Stop & go' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Abrazar balón
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Abrazar balón', 'Finalización sencilla de trabajar y muy útil para anotar en situaciones de actividad defensiva. Cómo se hace: En el inicio del ciclo de pasos, colocar la palma de la mano delante de la pelota. Envolver el balón contra el pecho, protegiendo y evitando que los defensores lo puedan tocar.', 'https://youtu.be/Yfa-_diETdc', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Abrazar balón' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Bump Finishing
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Bump Finishing', NULL, 'https://youtu.be/vILg36gK4_Q', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Bump Finishing' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Doble paso rapido
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Doble paso rapido', NULL, 'https://youtu.be/4DyVSW3hnWY', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Doble paso rapido' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Euro step
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Euro step', 'Finalización sencilla. Cómo se hace: Cambiar la dirección de los apoyos en la entrada. Importante cambiar de dirección en el segundo apoyo. A veces se cambia mucho en el primero, y el jugador se queda sin fuerza para el segundo. Pequeño momento de pausa después del primer apoyo. El balón puede ir por encima de la cabeza para evitar defensores. Cuándo se hace: Hay varias situaciones: - Meterme entre dos defensores, evitando ayudas defensivas - Contraataque, con la defensa cerca de mí, para que se pase de frenada en el primer apoyo - Atacando una ayuda defensiva - Si lo hago contra un defensor que está en frente de mí, tiene que estar a cierta distancia.', 'https://youtu.be/Nfp0PGRlfjg', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Euro step' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Fake spin move
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Fake spin move', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Fake spin move' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Finaliza. alrededor cintura
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Finaliza. alrededor cintura', 'Cómo se hace: En el primer apoyo de la entrada, se pasa el balón alrededor de la cintura, comenzando de atrás hacia delante desde la mano que bota. Es una finalización sencilla, pero requiere un poco de coordinación. Cuándo se hace: Es útil para evitar robos de balón. Cuando el defensor quiere anticiparse e ir a robar, o para meterse entre dos defensores y proteger el balón de esta manera.', 'https://youtu.be/Z-0414kODIs', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Finaliza. alrededor cintura' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Finaliza. Aro pasado
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Finaliza. Aro pasado', NULL, 'https://youtu.be/8Frx5HWiekM', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Finaliza. Aro pasado' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Finalización tras pase
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Finalización tras pase', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Finalización tras pase' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Finalizaciones
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Finalizaciones', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Finalizaciones' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Finta de pase
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Finta de pase', 'Cómo se hace: Se puede combinar con eurostep, o hacerla de manera independiente. En el primer paso efectuar la finta de pase, y finalizar tras el segundo apoyo. Hay que tener en cuenta varios aspectos: 1. Estirar los brazos al máximo en la finta 2. Mirar hacia donde se finta 3. No hacerlo excesivamente rápido. Cuándo se hace: Buena opción en contraataque y superioridades. Otra opción muy clara, es cuando desbordo en 1x1 y voy hacia canasta contra la ayuda defensiva.', 'https://youtu.be/4qA1pSBu-_s', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Finta de pase' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Floater
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Floater', 'Cómo se hace: Por la izquierda normalmente se hace con pérdida de paso. Importante bombear mucho el lanzamiento para evitar defensores. Clave el tacto de balón. Por la derecha se suelen hacer dos apoyos rápidos para acabar lanzando con el apoyo de pierna izquierda. Una de las claves es frenar en el último apoyo para que la última batida sea en vertical, no hacia delante. Cuándo se hace: Se suele hacer para evitar el tapón de jugadores más grandes. Debe existir espacio entre atacante y defensor. Importante frenar la carrera para no seguir hacia delante en el salto.', 'https://youtu.be/yPEa9apF7Lk', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Floater' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Parada dos tiempos + giro
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Parada dos tiempos + giro', 'Finalización para fintar el tiro tras 2 apoyos, girar y terminar con la mano contraria. Cómo se hace: Después de marcar los apoyos normales de una entrada, se finta el tiro, levantándolo por encima de la cabeza, se debe girar sobre el pie de pivote, para finalizar con la mano contraria. Importante estar muy flexionado y hacer una buena finta. Cuándo hacerlo: Muy usual que los jugadores diestros lo hagan cuando entran por lado izquierda. El defensor debe estar cerca del atacante, y lateral a este. Con la finta se busca que el defensor salte o se pase de frenada, y conseguir tirar con facilidad tras el giro.', 'https://youtu.be/ET3AnY0muKE', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Parada dos tiempos + giro' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Paradas un tiempo + pivote
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Paradas un tiempo + pivote', NULL, 'https://youtu.be/3M51RdkCjHI', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Paradas un tiempo + pivote' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Paso corto paso largo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Paso corto paso largo', NULL, 'https://youtu.be/t_ydSXi1Xlk', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Paso corto paso largo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Perdida paso
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Perdida paso', 'Cómo se hace: Entrada con un solo apoyo. Saltar sobre la pierna del lado en que se esté botando y terminar con mano contraria. De esta manera la acción es más natural y sencilla. Lanzando con la misma mano, es una acción más complicada de coordinar, y es recomendable para jugadores más expertos. Cuándo se hace: Muy interesante por línea de fondo. El objetivo suele ser sorprender al defensor para evitar el tapón. Por centro, se suele utilizar para evitar a defensores que vienen del lado de ayuda.', 'https://youtu.be/3XmMCYGztrs', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Perdida paso' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pinoy step
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pinoy step', 'Finalización sencilla en la cual en el primer paso, se realiza una finta de tiro levantando el balón por encima de la cabeza.', 'https://youtu.be/6rHbBtbsDzY', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pinoy step' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pro hop
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pro hop', 'Cómo se hace: Coincidir un último bote fuerte con el paso contrario. A partir de ahí pasar el balón por encima de la cabeza, dar un salto fuerte, y caer en un tiempo. Importante no caer sobre el mismo pie de batida ya que serían pasos. Tras caer, salto con ambos pies juntos para finalizar. Cuándo se hace: Recurso técnico para pasar por el espacio entre dos defensores. Importante pasar balón por encima de la cabeza y dar un salto potente que te permita avanzar.', 'https://youtu.be/AcCbOGr_40I', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pro hop' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Slow step finish
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Slow step finish', 'Cómo se hace: El primer paso de la finalización, hacia delante con mucha energía. En el segundo apoyo es importante frenar, y hacer un salto vertical lo más alto que se pueda. Con esto, intentamos que nuestro defensor salte antes que nosotros o se pase de frenada, y poder finalizar con un tiro cercano. En ocasiones se busca el contacto con el defensor y se hace similar a la finalización VEER.', 'https://youtu.be/XkINUe9s_Uk', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Slow step finish' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Spin move
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Spin move', 'Cómo se hace: Entrada en reverso sencilla de efectuar. Para hacerlo bien, es clave hacer coincidir el último bote con el paso contrario. Tras esto, coger el balón con fuerza y girar estando lo más flexionado posible. Se puede dar un apoyo y finalizar o dar dos aprovechando el paso cero. Importante finalizar con la mano contraria para acabar lo más alejado posible de la defensa. Cuándo hacerlo: Para hacer esta entrada el defensor tiene que estar muy cerca del atacante. Lo ideal es hacerlo en carrera cuando el defensor está a un lado del atacante. Una variante a esta finalización es la que hace Tony Parker. En vez de coincidir bote y paso contrario, lo hace tras cambio de dirección por delante.', 'https://youtu.be/NApZ3_Zqzug', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Spin move' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Step thru
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Step thru', 'Cómo se hace: Parada en dos tiempos sobre bote. Tras la parada fintar el tiro, para que la defensa salte o pierda su posición defensiva. Tras ello pivotar sobre el primer apoyo, cruzando el pie, para finalizar. Según el reglamento se puede levantar el pie de pivote para pasar o lanzar.', 'https://youtu.be/UNZthk3tsZw', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Step thru' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Swing step
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Swing step', 'Cómo se hace: Hacer coincidir un último bote fuerte con el apoyo de la pierna contraria. A partir de ahí, llevar el balón por encima de la cabeza, y cruzar el primer paso para cambiar de dirección. El último apoyo hacerlo con fuerza para finalizar. Se puede hacer pasando el balón por encima de la cabeza o por detrás de la espalda. Cuándo se hace: Se suele utilizar para acabar la entrada por el lado contrario por el que se empieza. Útil en contraataque, con bastante espacio entre atacante y defensor. Muy utilizado por jugadores con gran potencia física para aprovechar bien los apoyos.', 'https://youtu.be/tpXmOT-K-Xk', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Swing step' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Veer
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Finalizaciones' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Veer', NULL, 'https://youtu.be/sZu7DoMVg1g', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Veer' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Bote de velocidad
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Manejo de balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Bote de velocidad', NULL, 'https://youtu.be/8PXFc9SbdLM', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Bote de velocidad' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Bote mano no dominante
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Manejo de balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Bote mano no dominante', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Bote mano no dominante' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Bote protección
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Manejo de balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Bote protección', 'Bote que se realiza para evitar que el defensor pueda robarme el balón. Este bote me permite ver lo que está pasando en la pista, sin riesgo de perder el balón. Cómo se hace: Bote muy bajo, con la mano más alejada del defensor, y colocando mi cuerpo entre balón y defensa. Cuándo se puede hacer: En situaciones de mucha presión del defensor, para ver posibilidades de pase o cambio de dirección. También se suele usar cuando se quiere marcar un sistema, o el jugador con balón está esperando movimientos de sus compañeros. Es importante no abusar de este bote, ya que la defensa quita iniciativa al ataque.', 'https://youtu.be/Z94GPkvjb6U', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Bote protección' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Bote Uso hemisferios
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Manejo de balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Bote Uso hemisferios', NULL, 'https://youtu.be/jVWhtDN6KSo', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Bote Uso hemisferios' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Disociar bote y visión
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Manejo de balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Disociar bote y visión', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Disociar bote y visión' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Manejo de balón
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Manejo de balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Manejo de balón', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Manejo de balón' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Ritmos de bote
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Manejo de balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Ritmos de bote', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Ritmos de bote' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Tension bote
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Manejo de balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Tension bote', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Tension bote' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Dos tiempos exterior
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Paradas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Dos tiempos exterior', NULL, 'https://youtu.be/iaIDwhAfKO0', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Dos tiempos exterior' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Dos tiempos interior
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Paradas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Dos tiempos interior', NULL, 'https://youtu.be/Yk8XWQqxRgo', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Dos tiempos interior' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Parada Un tiempo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Paradas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Parada Un tiempo', NULL, 'https://youtu.be/Dz4aBGw0UJY', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Parada Un tiempo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Paradas
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Paradas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Paradas', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Paradas' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Finta de pase
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Pase' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Finta de pase', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Finta de pase' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Mano a mano
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Pase' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Mano a mano', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Mano a mano' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pase
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Pase' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pase', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pase' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pase a poste bajo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Pase' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pase a poste bajo', 'Si el atacante no tiene contacto con el defensor = pase directo, fuerte y tenso. Si el atacante está en contacto con el defensor = pase picado. Lejos de la posición del defensor. Opciones para pasar al poste bajo: - Fintas de pase o de tiro - Bote lateral para generar una línea de pase libre. - Pivote para ganar espacio. - Combinación de todas estas opciones.', 'https://youtu.be/b4VrN0hQ-x8', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pase a poste bajo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pase de bolos
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Pase' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pase de bolos', 'Pase poco utilizado. Se utiliza en situaciones de contraataque, normalmente tras bote. Es una opción de pase largo, cuando no se tiene mucha fuerza. Cómo se hace: Poniendo la mano debajo del balón, y utilizando el gesto de lanzamiento de bolos.', 'https://youtu.be/iryQ0qDOadk', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pase de bolos' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pase de gancho
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Pase' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pase de gancho', NULL, 'https://youtu.be/pPG-J-3OqUQ', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pase de gancho' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pase por detrás espalda
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Pase' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pase por detrás espalda', NULL, 'https://youtu.be/AwY3iHeSQ7E', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pase por detrás espalda' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pase tras bote
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Pase' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pase tras bote', NULL, 'https://youtu.be/b8O6W1NOLrY', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pase tras bote' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pocket pass
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Pase' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pocket pass', NULL, 'https://youtu.be/6hz3uCXGgn8', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pocket pass' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- 1 bote + reverso
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT '1 bote + reverso', NULL, 'https://youtu.be/xzV4qF8vWFs', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = '1 bote + reverso' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Back down
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Back down', NULL, 'https://youtu.be/g0uODB3wzbo', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Back down' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Centro + fondo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Centro + fondo', NULL, 'https://youtu.be/tGC0oXxiUjg', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Centro + fondo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Dos apoyos + extension
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Dos apoyos + extension', NULL, 'https://youtu.be/yrL2TZR0bgw', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Dos apoyos + extension' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Drop step
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Drop step', NULL, 'https://youtu.be/Df8bnmzT4mE', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Drop step' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Duck in
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Duck in', 'Acción de ganar espacio cerca del aro, para recibir y jugar un 1x1. Lo suelen hacer jugadores interiores, pero lo puede jugar cualquier jugador. Consiste en colocarse delante del defensor, flexionado, con un centro de gravedad bajo, y empujar hacia atrás, con el objetivo de recibir cerca de canasta.', 'https://youtu.be/q2rj_Fy91w0', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Duck in' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Fade away
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Fade away', NULL, 'https://youtu.be/gU956iTOIFU', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Fade away' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Fondo + centro
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Fondo + centro', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Fondo + centro' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Gancho
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Gancho', NULL, 'https://youtu.be/jDS3oB5ROsk', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Gancho' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Inverted Up & Under
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Inverted Up & Under', NULL, 'https://youtu.be/NozW-ZLkWKI', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Inverted Up & Under' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Mirotic up & under
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Mirotic up & under', 'Movimiento clásico de Mirotic, con el que consigue generar muchas ventajas. Cómo se hace: Tras recibir en poste bajo, y contactar con el defensor, gira simulando un fade away, para fintar el tiro, y pivotar hacia el aro. Importante subir el balón por encima de la cabeza para que el defensor se crea la finta, y estar muy flexionado. Se repiten dos pivotes sobre el mismo pie, el primero para fintar el tiro, y el segundo para atacar al aro tras la finta.', 'https://youtu.be/6KaglEDamHY', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Mirotic up & under' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Nowitzki shot
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Nowitzki shot', NULL, 'https://youtu.be/z_ISAZ5oF0g', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Nowitzki shot' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Paradas + pivotes
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Paradas + pivotes', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Paradas + pivotes' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pivote exterior
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pivote exterior', 'Consiste en pivotar para encarar el aro. Normalmente, se pivota sobre el pie que está más cerca del defensor, para separarme de él y generar espacio. Tras esto es posible tirar, leer lo que sucede en la pista o atacar con bote. Cuidado con no hacer pasos. Al pivotar para encarar el aro, ya hemos movido el pie de pivote. No podré cambiarlo y salir sobre la otra pierna.', 'https://youtu.be/ojsgOPPRIOQ', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pivote exterior' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Poste bajo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Poste bajo', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Poste bajo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Quick spin
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Quick spin', NULL, 'https://youtu.be/xgwTC0PBAz4', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Quick spin' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Shimmy hook
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Shimmy hook', NULL, 'https://youtu.be/OzBEfFQ1jhQ', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Shimmy hook' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Shoulder spin
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Shoulder spin', NULL, 'https://youtu.be/z46VYVbd31o', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Shoulder spin' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Up & under
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Poste bajo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Up & under', 'Gesto técnico en poste bajo. Cómo se hace: Es un gesto sencillo. Consiste en fintar el tiro, para después cruzar el pie y terminar con una finalización. Importante estar flexionado, levantar el balón por encima de la cabeza, y mirar al aro, para que el defensor se crea la finta. Tras esto, cruzar el pie, para terminar.', 'https://youtu.be/lE7ahKxdUWk', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Up & under' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Abierta mano cambiada
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Salidas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Abierta mano cambiada', 'Esta salida es una alternativa sencilla para no cometer pasos en salidas abiertas. Cómo se hace: Lanzar el balón con la mano contraria a la del primer paso de salida. Importante lanzarla fuerte y hacia delante. Una opción para atacar closeout, es colocar las manos como si fueras a tirar, y en ese momento lanzar la pelota hacia delante con la mano de tiro. Cuándo se hace: Para atacar closeout, en situaciones de salidas de bloqueo indirecto, o cualquier situación en las que quiera hacer una salida abierta sin riesgo de hacer pasos.', 'https://youtu.be/H4w7YmP7YbE', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Abierta mano cambiada' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Finta de salida
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Salidas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Finta de salida', 'Finta de salida o jab step. Es un movimiento simple, que se utiliza para generar pequeñas ventajas en el 1x1. Finta de salida abierta, con un movimiento corto y explosivo para acabar haciendo una salida cruzada.', 'https://youtu.be/Cl3DnfdbE90', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Finta de salida' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Finta salida abierta + cambio delante
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Salidas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Finta salida abierta + cambio delante', NULL, 'https://youtu.be/MR2O1U4yCII', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Finta salida abierta + cambio delante' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Karate kid
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Salidas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Karate kid', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Karate kid' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Negative step
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Salidas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Negative step', NULL, 'https://youtu.be/qO7xfSPpt14', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Negative step' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Parada 1T + salida cruzada. Causeur
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Salidas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Parada 1T + salida cruzada. Causeur', 'Cómo se hace: Control de balón sobre el pie exterior, y parada en un tiempo posterior. Este pequeño salto que realiza antes de la parada le permite ganar tiempo para leer el juego y ganar explosividad. Tras esto salida cruzada a izquierda o derecha. Gran recurso técnico. Video: Coach Sergio Lopez.', 'https://youtu.be/1VmKJAkrWnI', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Parada 1T + salida cruzada. Causeur' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Salida abierta
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Salidas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Salida abierta', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Salida abierta' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Salida abierta con bote previo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Salidas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Salida abierta con bote previo', 'Salida que consiste en dar un bote bajo y vertical, para poder liberar los pasos, y hacer una salida abierta sin riesgo de cometer pasos de salida. Se suele hacer precedida de una finta de tiro, desbloqueo de muñeca, para hacer un bote muy bajo de adelante hacia atrás, para colocar la mano justo detrás del balón y poder atacar agresivo hacia delante.', 'https://youtu.be/I8qtq2upI3Q', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Salida abierta con bote previo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Salida cruzada
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Salidas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Salida cruzada', NULL, 'https://youtu.be/mHdMmlyK5CY', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Salida cruzada' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Salida cruzada + cambio por detras
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Salidas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Salida cruzada + cambio por detras', NULL, 'https://youtu.be/3VAdZnpUL_I', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Salida cruzada + cambio por detras' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Salida en reverso
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Salidas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Salida en reverso', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Salida en reverso' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Salidas
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Salidas' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Salidas', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Salidas' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Finta de tiro
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Finta de tiro', NULL, 'https://youtu.be/x9w5uQ_H3zM', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Finta de tiro' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Hop
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Hop', 'Gesto importante para conseguir fluidez en el tiro. Consiste en una pequeña parada en un tiempo, antes de recibir el balón. Este gesto nos ayuda a transmitir la fuerza de las piernas al lanzamiento y de esta manera hacer un tiro biomecánicamente más eficiente. Esta parada, se utiliza cuando el tirador tiene poco tiempo para armar el lanzamiento. También nos permite salir cruzado hacia ambos lados, lo que es una gran ventaja.', 'https://youtu.be/F4Wm73EVWSs', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Hop' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Inverted drag
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Inverted drag', NULL, 'https://youtu.be/Os4Irqju6RI', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Inverted drag' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Mecanica tiro
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Mecanica tiro', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Mecanica tiro' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Punch drag
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Punch drag', 'Es una acción para generarse espacio y tirar tras bote. Consiste en adelantar el paso del mismo lado del bote. Tras esto rápidamente retroceder ese mismo paso, para generar espacio para tirar. Para tener éxito, hay que coincidir un bote fuerte y agresivo con ese último paso, para que el defensor se vaya un poco para atrás.', 'https://youtu.be/oq97z_vcGZ8', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Punch drag' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Selección de tiro
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Selección de tiro', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Selección de tiro' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Side step
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Side step', NULL, 'https://youtu.be/Tf2qmZF9zgs', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Side step' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Step back
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Step back', 'Cómo se hace: Coincidir bote y paso contrario muy agresivo, para que el defensor vaya un poco hacia atrás. Tras esto un pequeño salto hacia atrás o lateral para conseguir espacio suficiente para tirar. Importante que el salto no sea muy grande, para no perder fuerza en las piernas para el siguiente salto. Esta situación es más cómoda para los jugadores cuando la hacen hacia lado NO dominante. En jugadores diestros, es un gesto natural botando hacia izquierda.', 'https://youtu.be/xxoC4LrVlV0', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Step back' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Tiro
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Tiro', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Tiro' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Tiro libre
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Tiro libre', NULL, 'https://youtu.be/OPTmkIjH0OQ', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Tiro libre' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Tiro tras bote
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Tiro tras bote', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Tiro tras bote' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Under drag
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Under drag', 'Gesto técnico para generarse un espacio para tirar tras bote. Cómo se hace: Cambio por debajo de la pierna del lado de bote, yendo de adelante hacia atrás. Importante estar muy flexionado, para que la defensa piense que el atacante sigue la carrera hacia el aro. Tras este cambio, parada en uno o dos tiempos para poder tirar. Cuándo: Para hacer este gesto, el defensor en un inicio debe estar cerca, para caer en la finta del under drag.', 'https://youtu.be/vUV2fjIXBFU', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Under drag' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Volumen de tiro
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Tiro' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Volumen de tiro', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Volumen de tiro' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- 1x1
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego con balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT '1x1', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = '1x1' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- 1x1 en carrera
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego con balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT '1x1 en carrera', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = '1x1 en carrera' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Atacar closeout
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego con balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Atacar closeout', NULL, 'https://youtu.be/yljitJ1tP8w', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Atacar closeout' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Atacar la recepción. Estampida
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego con balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Atacar la recepción. Estampida', NULL, 'https://youtu.be/RyMeBjwcP7Y', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Atacar la recepción. Estampida' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Penetrar y pasar
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego con balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Penetrar y pasar', 'Acción básica del juego colectivo. Consiste en atacar 1x1 para fijar o atraer defensores, y pasar el balón a un jugador liberado.', 'https://youtu.be/57vVI-ZUxDY', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Penetrar y pasar' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Si def esta cerca ataco
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego con balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Si def esta cerca ataco', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Si def esta cerca ataco' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Si def esta lejos tiro
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego con balón' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Si def esta lejos tiro', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Si def esta lejos tiro' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Cambio chip defensa/ataque
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Cambio chip defensa/ataque', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Cambio chip defensa/ataque' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Corte a canasta
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Corte a canasta', NULL, 'https://youtu.be/xjcFgK4ch84', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Corte a canasta' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Danilovic cut
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Danilovic cut', 'Corte a canasta que se realiza desde la esquina del lado fuerte del ataque. En situaciones donde el defensor está mirando el balón, el atacante realiza un corte agresivo por delante de su defensa, para adelantarse y conseguir canasta. Corte típico, en situaciones de cuernos o similares.', 'https://youtu.be/wMB9unuRw4I', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Danilovic cut' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- JSB ante 1x1. Exterior
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'JSB ante 1x1. Exterior', NULL, 'https://youtu.be/jSXi23WvkBQ', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'JSB ante 1x1. Exterior' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- JSB ante 1x1. Interior
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'JSB ante 1x1. Interior', NULL, 'https://youtu.be/HWwa9luUgG0', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'JSB ante 1x1. Interior' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- JSB para recibir
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'JSB para recibir', NULL, 'https://youtu.be/Qro2_nQWk-w', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'JSB para recibir' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Juego sin balón
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Juego sin balón', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Juego sin balón' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Ocupación espacios
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Ocupación espacios', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Ocupación espacios' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pasar y moverse
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pasar y moverse', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pasar y moverse' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Puerta atrás
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Puerta atrás', 'Jugada ofensiva en la que un jugador en el perímetro se aleja de la canasta, arrastrando al defensor y luego de repente corta a la canasta detrás del defensor para dar un pase. Importante acercarme al pasador para engañar al defensor, y tras esto hacer un cambio de ritmo fuerte en dirección a la canasta.', 'https://youtu.be/QklsVZIBu6k', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Puerta atrás' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Rebote ofensivo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Rebote ofensivo', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Rebote ofensivo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Respeto espacios
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego sin balon' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Respeto espacios', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Respeto espacios' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Atacar cambio defensivo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Atacar cambio defensivo', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Atacar cambio defensivo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Atacar lado no bloqueo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Atacar lado no bloqueo', NULL, 'https://youtu.be/jIRRUHfrxGA', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Atacar lado no bloqueo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Bloqueador
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Bloqueador', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Bloqueador' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Bloqueo directo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Bloqueo directo', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Bloqueo directo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Boomerang pass
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Boomerang pass', 'Acción táctica ante cambio en bloqueo directo. El jugador con balón pasa a un compañero tras el bloqueo directo, para inmediatamente volver a recibir y atacar en 1x1 al cambio defensivo. Es muy común, que tras el cambio, el jugador grande, se relaje tras el pase del atacante. El boomerang pass, nos da la opción de castigar este 1x1. Es interesante que el receptor del pase, se vaya un poco hacia atrás para atacar en carrera al defensor.', 'https://youtu.be/xnbwnQn4ENk', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Boomerang pass' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Bote atras + giro + pase
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Bote atras + giro + pase', NULL, 'https://youtu.be/VQuMBKdeqMo', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Bote atras + giro + pase' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Fintar bloqueo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Fintar bloqueo', 'Slip o fintar bloqueo. Se trata de una acción muy común en la actualidad. Se trata de fintar un bloqueo directo, para que se active la defensa del bloqueo y atacar 1x1 o el pase a jugador que bloquea. Antes de que llegue a existir el contacto entre bloqueador y defensor, este se aleja rápido para crear una ventaja.', 'https://youtu.be/uwikTfaNRh0', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Fintar bloqueo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Gortat screen
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Gortat screen', NULL, 'https://youtu.be/CfFDgaYbSSM', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Gortat screen' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- In the jail
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'In the jail', NULL, 'https://youtu.be/XBJ2NLtVmxM', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'In the jail' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Meter def en el bloqueo con bote
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Meter def en el bloqueo con bote', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Meter def en el bloqueo con bote' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pick and pop
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pick and pop', NULL, 'https://youtu.be/omGrFbU0ls4', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pick and pop' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pick and roll
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pick and roll', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pick and roll' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- preuba tag1
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'preuba tag1', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'preuba tag1' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Repick
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Repick', 'Situación táctica, que consiste en volver a bloquear a un defensor después de un primer bloqueo. Normalmente se hace cuando el defensor decide pasar por debajo o cuando no hay contacto en el primer bloqueo. El bloqueador debe girar su cuerpo, para poner el 2º bloqueo un poco más cerca del aro. El jugador con balón, debe tener pausa en el bote, dejar pasar al defensor, y cambiar rápidamente de dirección.', 'https://youtu.be/UhfqL1GDhwk', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Repick' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Roll corto
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Roll corto', NULL, 'https://youtu.be/GAIpEDqYdQM', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Roll corto' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Snake
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Snake', NULL, 'https://youtu.be/B1fRnRtklwc', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Snake' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Split
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Split', NULL, 'https://youtu.be/hE5FU07pPo0', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Split' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- tag 2
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'tag 2', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'tag 2' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- tag 3
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'tag 3', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'tag 3' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Triangulación
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo directo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Triangulación', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Triangulación' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Abrise si def recorta
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Abrise si def recorta', NULL, 'https://youtu.be/3kfhJX1Zh_Y', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Abrise si def recorta' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Bloqueo Ciego
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Bloqueo Ciego', 'Video: Juan Carlos Garcia', 'https://youtu.be/8Zi6FHvF1yM', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Bloqueo Ciego' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Bloqueo indirecto
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Bloqueo indirecto', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Bloqueo indirecto' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Continuacion del bloqueador
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Continuacion del bloqueador', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Continuacion del bloqueador' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Cross screen
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Cross screen', 'Bloqueo que se hace paralelo a línea de fondo. Normalmente de un jugador exterior a un interior, para recibir en poste bajo.', 'https://youtu.be/7akhpHLWBRU', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Cross screen' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Flare screen
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Flare screen', NULL, 'https://youtu.be/T4iyYag8974', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Flare screen' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Hammer screen
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Hammer screen', NULL, 'https://youtu.be/hWDBFIfFTG0', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Hammer screen' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Juego sin balon. Meter def en bi
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Juego sin balon. Meter def en bi', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Juego sin balon. Meter def en bi' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pin down
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pin down', NULL, 'https://youtu.be/wTVBv-Nz_lQ', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pin down' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Ricky screen
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Ricky screen', 'Acción en la que un jugador sin balón recibe de manera consecutiva dos bloqueos indirectos en sentido opuesto por parte de un mismo jugador. El jugador que tiene intención de recibir, utiliza un bloqueo indirecto y aprovecha la inercia de su defensor al perseguirle para cambiar de sentido bruscamente', 'https://youtu.be/zUbajGCPafQ', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Ricky screen' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Rizo
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Rizo', NULL, 'https://youtu.be/co7e9Iwi_50', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Rizo' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Stagger
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Stagger', NULL, 'https://youtu.be/cfDWOPP5wdw', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Stagger' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Ucla
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Bloqueo indirecto' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Ucla', NULL, 'https://youtu.be/Yo-XLUZTtlQ', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Ucla' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Atacar por centro
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Contrataque' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Atacar por centro', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Atacar por centro' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Calles contrataque
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Contrataque' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Calles contrataque', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Calles contrataque' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Contrataque
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Contrataque' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Contrataque', NULL, 'https://youtu.be/_lpdZPl5B_8', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Contrataque' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- CTQ. Atacar por banda
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Contrataque' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'CTQ. Atacar por banda', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'CTQ. Atacar por banda' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pase apertura
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Contrataque' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pase apertura', NULL, 'https://youtu.be/mq50jydCwQ0', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pase apertura' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Superioridades
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Contrataque' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Superioridades', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Superioridades' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Touchdown pass
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Contrataque' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Touchdown pass', NULL, 'https://youtu.be/gxbDyyUShnM', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Touchdown pass' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Trailer
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Contrataque' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Trailer', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Trailer' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Transicion
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Contrataque' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Transicion', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Transicion' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Ataque a zona
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego colectivo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Ataque a zona', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Ataque a zona' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Extra pass
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego colectivo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Extra pass', NULL, 'https://youtu.be/gAaXFvqQQ70', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Extra pass' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Higw-low
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego colectivo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Higw-low', NULL, 'https://youtu.be/O_l27IMQ8pc', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Higw-low' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Inversión de balón
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego colectivo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Inversión de balón', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Inversión de balón' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Ocupacion esquina
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego colectivo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Ocupacion esquina', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Ocupacion esquina' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Pasar y cortar
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego colectivo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Pasar y cortar', NULL, 'https://youtu.be/eFjAAlEegIU', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Pasar y cortar' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Remplazar posiciones
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego colectivo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Remplazar posiciones', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Remplazar posiciones' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Repost
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego colectivo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Repost', 'Situación táctica que consiste en volver a jugar un balón interior, después de que el jugador interior saque el balón fuera. Normalmente el defensor interior se suele relajar tras el pase hacia afuera, y es un buen momento para que el atacante gane la posición más cerca del aro, y pueda volver a recibir.', 'https://youtu.be/-Wj8QcTeUJY', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Repost' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Salida de presión
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Juego colectivo' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Salida de presión', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Salida de presión' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Fintar mano a mano + cambio dirección
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Mano a mano' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Fintar mano a mano + cambio dirección', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Fintar mano a mano + cambio dirección' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Mano a mano
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Mano a mano' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Mano a mano', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Mano a mano' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Mano a mano + atacar
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Mano a mano' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Mano a mano + atacar', NULL, 'https://youtu.be/lpd_sfRcivg', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Mano a mano + atacar' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Puerta atrás mano a mano
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Mano a mano' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Puerta atrás mano a mano', NULL, 'https://youtu.be/kcgcsvySCZ8', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Puerta atrás mano a mano' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Romper mano a mano con bote
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Mano a mano' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Romper mano a mano con bote', NULL, 'https://youtu.be/6YE_NusAtlw', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Romper mano a mano con bote' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- Tiro tras mano a mano
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Mano a mano' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'Tiro tras mano a mano', NULL, 'https://youtu.be/yZxWEhWDBoo', v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'Tiro tras mano a mano' AND "ConceptCategoryId" = v_cat_id);
    END IF;
    -- ATO. Saras FCB. Iverson, UCLA, postup
    SELECT "Id" INTO v_cat_id FROM "ConceptCategories" WHERE "Name" = 'Situaciones especiales ataque' LIMIT 1;
    IF v_cat_id IS NOT NULL THEN
        INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")
        SELECT 'ATO. Saras FCB. Iverson, UCLA, postup', NULL, NULL, v_cat_id, true
        WHERE NOT EXISTS (SELECT 1 FROM "SportConcepts" WHERE "Name" = 'ATO. Saras FCB. Iverson, UCLA, postup' AND "ConceptCategoryId" = v_cat_id);
    END IF;
END $$;
