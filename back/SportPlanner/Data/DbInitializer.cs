using Microsoft.EntityFrameworkCore;
using SportPlanner.Models;

namespace SportPlanner.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // 1. Ensure Templates exist
        if (!await context.PlanningTemplates.AnyAsync())
        {
            var escuela = new PlanningTemplate { Name = "Itinerario Escuela", Code = "ESCUELA", Level = 1, Description = "Conceptos básicos para iniciación (≤8 años)" };
            context.PlanningTemplates.Add(escuela);
            await context.SaveChangesAsync();

            var premini = new PlanningTemplate { Name = "Itinerario Pre-Mini", Code = "PREMINI", Level = 2, ParentTemplateId = escuela.Id, Description = "Desarrollo técnico inicial (9-10 años)" };
            context.PlanningTemplates.Add(premini);
            await context.SaveChangesAsync();

            var alevin = new PlanningTemplate { Name = "Itinerario Alevín", Code = "ALEVIN", Level = 3, ParentTemplateId = premini.Id, Description = "Consolidación técnica y primeros conceptos tácticos (11-12 años)" };
            context.PlanningTemplates.Add(alevin);
            await context.SaveChangesAsync();

            var infantil = new PlanningTemplate { Name = "Itinerario Infantil", Code = "INFANTIL", Level = 4, ParentTemplateId = alevin.Id, Description = "Equilibrio técnico-táctico (13-14 años)" };
            context.PlanningTemplates.Add(infantil);
            await context.SaveChangesAsync();

            var cadete = new PlanningTemplate { Name = "Itinerario Cadete", Code = "CADETE", Level = 5, ParentTemplateId = infantil.Id, Description = "Profundización táctica (15-16 años)" };
            context.PlanningTemplates.Add(cadete);
            await context.SaveChangesAsync();

            var junior = new PlanningTemplate { Name = "Itinerario Junior/Senior", Code = "JUNIOR", Level = 6, ParentTemplateId = cadete.Id, Description = "Juego completo y especialización (≥17 años)" };
            context.PlanningTemplates.Add(junior);
            await context.SaveChangesAsync();
        }

        // 2. Link concepts if not linked
        bool anyUnlinked = await context.SportConcepts.AnyAsync(c => c.PlanningTemplateId == null && c.DevelopmentLevel != null);
        if (anyUnlinked)
        {
            // Update using PlanningTemplates table
            await context.Database.ExecuteSqlRawAsync(@"
                UPDATE ""SportConcepts"" s
                SET ""PlanningTemplateId"" = i.""Id""
                FROM ""PlanningTemplates"" i
                WHERE s.""PlanningTemplateId"" IS NULL
                AND s.""DevelopmentLevel"" = i.""Level""
            ");
        }
    }
}
