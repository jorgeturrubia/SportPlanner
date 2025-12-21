-- Script de Verificación de Itinerarios y Relaciones
-- Ejecuta esto en tu SQL Editor de Supabase para ver si los datos están correctos.

-- 1. Verificar si existen los Itinerarios
SELECT "Id", "Name", "Code", "Level", "ParentItineraryId" 
FROM "MethodologicalItineraries"
ORDER BY "Level";

-- 2. Resumen de Conceptos vinculados vs no vinculados
SELECT 
    COUNT(*) as TotalConceptos,
    SUM(CASE WHEN "MethodologicalItineraryId" IS NOT NULL THEN 1 ELSE 0 END) as Vinculados,
    SUM(CASE WHEN "MethodologicalItineraryId" IS NULL THEN 1 ELSE 0 END) as SinVincular
FROM "SportConcepts";

-- 3. Muestra de conceptos vinculados por Itinerario
SELECT 
    i."Name" as Itinerario,
    COUNT(c."Id") as CantidadConceptos,
    STRING_AGG(c."Name", ', ') as EjemploConceptos
FROM "MethodologicalItineraries" i
LEFT JOIN "SportConcepts" c ON c."MethodologicalItineraryId" = i."Id"
GROUP BY i."Name", i."Level"
ORDER BY i."Level";
