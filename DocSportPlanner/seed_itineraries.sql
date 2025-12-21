-- Seed data for MethodologicalItineraries
-- These represent the methodological progression from Escuela to Junior

-- First, insert without parent references (to avoid FK issues)
INSERT INTO "MethodologicalItineraries" ("Name", "Code", "Level", "ParentItineraryId", "TeamCategoryId", "Description", "IsActive")
VALUES 
    ('Itinerario Escuela', 'ESCUELA', 1, NULL, NULL, 'Conceptos básicos para iniciación (≤8 años)', true);

INSERT INTO "MethodologicalItineraries" ("Name", "Code", "Level", "ParentItineraryId", "TeamCategoryId", "Description", "IsActive")
VALUES 
    ('Itinerario Pre-Mini', 'PREMINI', 2, 
     (SELECT "Id" FROM "MethodologicalItineraries" WHERE "Code" = 'ESCUELA'), 
     NULL, 'Desarrollo técnico inicial (9-10 años)', true);

INSERT INTO "MethodologicalItineraries" ("Name", "Code", "Level", "ParentItineraryId", "TeamCategoryId", "Description", "IsActive")
VALUES 
    ('Itinerario Alevín', 'ALEVIN', 3, 
     (SELECT "Id" FROM "MethodologicalItineraries" WHERE "Code" = 'PREMINI'), 
     NULL, 'Consolidación técnica y primeros conceptos tácticos (11-12 años)', true);

INSERT INTO "MethodologicalItineraries" ("Name", "Code", "Level", "ParentItineraryId", "TeamCategoryId", "Description", "IsActive")
VALUES 
    ('Itinerario Infantil', 'INFANTIL', 4, 
     (SELECT "Id" FROM "MethodologicalItineraries" WHERE "Code" = 'ALEVIN'), 
     NULL, 'Equilibrio técnico-táctico (13-14 años)', true);

INSERT INTO "MethodologicalItineraries" ("Name", "Code", "Level", "ParentItineraryId", "TeamCategoryId", "Description", "IsActive")
VALUES 
    ('Itinerario Cadete', 'CADETE', 5, 
     (SELECT "Id" FROM "MethodologicalItineraries" WHERE "Code" = 'INFANTIL'), 
     NULL, 'Profundización táctica (15-16 años)', true);

INSERT INTO "MethodologicalItineraries" ("Name", "Code", "Level", "ParentItineraryId", "TeamCategoryId", "Description", "IsActive")
VALUES 
    ('Itinerario Junior/Senior', 'JUNIOR', 6, 
     (SELECT "Id" FROM "MethodologicalItineraries" WHERE "Code" = 'CADETE'), 
     NULL, 'Juego completo y especialización (≥17 años)', true);

-- Link to TeamCategories if they exist (optional - run after teams are seeded)
-- UPDATE "MethodologicalItineraries" SET "TeamCategoryId" = (SELECT "Id" FROM "TeamCategories" WHERE "Name" LIKE '%U10%' LIMIT 1) WHERE "Code" = 'PREMINI';
-- UPDATE "MethodologicalItineraries" SET "TeamCategoryId" = (SELECT "Id" FROM "TeamCategories" WHERE "Name" LIKE '%U12%' LIMIT 1) WHERE "Code" = 'ALEVIN';
-- etc.
