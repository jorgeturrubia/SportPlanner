Build started...
Build succeeded.
START TRANSACTION;
ALTER TABLE "SportConcepts" ADD "IsSystem" boolean NOT NULL DEFAULT FALSE;

ALTER TABLE "PlanningTemplates" ALTER COLUMN "Code" DROP NOT NULL;

ALTER TABLE "Exercises" ADD "AuthorName" text;

ALTER TABLE "Exercises" ADD "AverageRating" double precision NOT NULL DEFAULT 0.0;

ALTER TABLE "Exercises" ADD "IsSystem" boolean NOT NULL DEFAULT FALSE;

ALTER TABLE "Exercises" ADD "RatingCount" integer NOT NULL DEFAULT 0;

ALTER TABLE "Exercises" ADD "SportId" integer;

CREATE INDEX "IX_Exercises_SportId" ON "Exercises" ("SportId");

ALTER TABLE "Exercises" ADD CONSTRAINT "FK_Exercises_Sports_SportId" FOREIGN KEY ("SportId") REFERENCES "Sports" ("Id");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20251228091034_ActualizarModelo', '9.0.0');

COMMIT;


