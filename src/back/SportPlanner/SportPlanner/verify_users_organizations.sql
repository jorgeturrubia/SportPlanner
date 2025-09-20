-- Script para verificar que los usuarios tienen OrganizationId asignado
SELECT 
    u."Id" as "UserId",
    u."Email",
    u."FirstName",
    u."LastName",
    u."OrganizationId",
    o."Name" as "OrganizationName",
    o."Description" as "OrganizationDescription"
FROM "Users" u
LEFT JOIN "Organizations" o ON u."OrganizationId" = o."Id"
ORDER BY u."Email";

-- Contar usuarios sin OrganizationId
SELECT 
    COUNT(*) as "UsersWithoutOrganization"
FROM "Users" 
WHERE "OrganizationId" IS NULL;

-- Contar usuarios con OrganizationId
SELECT 
    COUNT(*) as "UsersWithOrganization"
FROM "Users" 
WHERE "OrganizationId" IS NOT NULL;