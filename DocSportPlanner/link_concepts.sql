-- Link SportConcepts to MethodologicalItineraries based on DevelopmentLevel
-- Run this AFTER running seed_itineraries.sql

UPDATE "SportConcepts" s
SET "MethodologicalItineraryId" = i."Id"
FROM "MethodologicalItineraries" i
WHERE s."DevelopmentLevel" = i."Level";

-- Verification
-- SELECT COUNT(*) FROM "SportConcepts" WHERE "MethodologicalItineraryId" IS NOT NULL;
