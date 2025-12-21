using Microsoft.EntityFrameworkCore;
using SportPlanner.Models;

namespace SportPlanner.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // 1. Ensure Itineraries exist
        if (!await context.MethodologicalItineraries.AnyAsync())
        {
            var escuela = new MethodologicalItinerary { Name = "Itinerario Escuela", Code = "ESCUELA", Level = 1, Description = "Conceptos básicos para iniciación (≤8 años)" };
            context.MethodologicalItineraries.Add(escuela);
            await context.SaveChangesAsync();

            var premini = new MethodologicalItinerary { Name = "Itinerario Pre-Mini", Code = "PREMINI", Level = 2, ParentItineraryId = escuela.Id, Description = "Desarrollo técnico inicial (9-10 años)" };
            context.MethodologicalItineraries.Add(premini);
            await context.SaveChangesAsync();

            var alevin = new MethodologicalItinerary { Name = "Itinerario Alevín", Code = "ALEVIN", Level = 3, ParentItineraryId = premini.Id, Description = "Consolidación técnica y primeros conceptos tácticos (11-12 años)" };
            context.MethodologicalItineraries.Add(alevin);
            await context.SaveChangesAsync();

            var infantil = new MethodologicalItinerary { Name = "Itinerario Infantil", Code = "INFANTIL", Level = 4, ParentItineraryId = alevin.Id, Description = "Equilibrio técnico-táctico (13-14 años)" };
            context.MethodologicalItineraries.Add(infantil);
            await context.SaveChangesAsync();

            var cadete = new MethodologicalItinerary { Name = "Itinerario Cadete", Code = "CADETE", Level = 5, ParentItineraryId = infantil.Id, Description = "Profundización táctica (15-16 años)" };
            context.MethodologicalItineraries.Add(cadete);
            await context.SaveChangesAsync();

            var junior = new MethodologicalItinerary { Name = "Itinerario Junior/Senior", Code = "JUNIOR", Level = 6, ParentItineraryId = cadete.Id, Description = "Juego completo y especialización (≥17 años)" };
            context.MethodologicalItineraries.Add(junior);
            await context.SaveChangesAsync();
        }

        // 2. Link concepts if not linked
        bool anyUnlinked = await context.SportConcepts.AnyAsync(c => c.MethodologicalItineraryId == null && c.DevelopmentLevel != null);
        if (anyUnlinked)
        {
            // Execute raw SQL update for performance or use batch updates if possible. 
            // Given EF Core usually does one-by-one, raw SQL is vastly superior here.
            await context.Database.ExecuteSqlRawAsync(@"
                UPDATE ""SportConcepts"" s
                SET ""MethodologicalItineraryId"" = i.""Id""
                FROM ""MethodologicalItineraries"" i
                WHERE s.""MethodologicalItineraryId"" IS NULL
                AND s.""DevelopmentLevel"" = i.""Level""
            ");
        }
    }
}
