using System;
using System.IO;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;
using Dapper;
using System.Text.RegularExpressions;

namespace ExerciseImporter
{
    public class Program
    {
        private const string ConnectionString = "User Id=postgres.uyvcgsjrqgzpsbptmqxp;Password=Mercedes@2604.52;Server=aws-0-eu-west-3.pooler.supabase.com;Port=5432;Database=postgres;Timeout=60;Command Timeout=60";
        private const string JsonPath = @"c:\Proyectos\SportPlanner\DocSportPlanner\ejercicios_basketiq_v3 (1).json";
        private const string CsvPath = @"c:\Proyectos\SportPlanner\DocSportPlanner\Conceptos.Basquet.v3 - nuevo3.csv";

        public static async Task Main(string[] args)
        {
            Console.WriteLine("Starting Exercise Import...");

            if (!File.Exists(JsonPath))
            {
                Console.WriteLine($"Error: File not found at {JsonPath}");
                return;
            }

            if (!File.Exists(CsvPath))
            {
                Console.WriteLine($"Error: File not found at {CsvPath}");
                return;
            }

            // Load Mapping from CSV
            // CSV Structure: Seccion,Categoría,Subcategoría,Concepto,...
            // We assume Tag "X" corresponds to the X-th row (1-based index) in the data (excluding header).
            // Or X-th row including header? Previous analysis suggested 1-based index of data rows.
            // Row 2 in file = Item 1. Tag 1 -> Item 1.
            var csvLines = await File.ReadAllLinesAsync(CsvPath);
            var tagMapping = new Dictionary<string, string>();

            // Regex to split by comma, ignoring commas inside quotes
            var csvSplitRegex = new Regex("(?:^|,)(\"(?:[^\"]|\"\")*\"|[^,]*)", RegexOptions.Compiled);

            // Skip header (row 0), start from row 1 (Item 1)
            for (int i = 1; i < csvLines.Length; i++)
            {
                var line = csvLines[i];
                if (string.IsNullOrWhiteSpace(line)) continue;

                var matches = csvSplitRegex.Matches(line);
                if (matches.Count >= 4)
                {
                    // Column 3 is Concepto (0-based index)
                    var conceptName = matches[3].Groups[1].Value.Trim().Trim('"');
                    tagMapping[i.ToString()] = conceptName; // Tag "1" -> Name of Row 2
                }
            }

            Console.WriteLine($"Loaded {tagMapping.Count} mappings from CSV.");

            var jsonContent = await File.ReadAllTextAsync(JsonPath);
            var exercises = JsonSerializer.Deserialize<List<ExerciseJsonModel>>(jsonContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (exercises == null || !exercises.Any())
            {
                Console.WriteLine("No exercises found in JSON.");
                return;
            }

            Console.WriteLine($"Found {exercises.Count} exercises in JSON.");

            using var connection = new NpgsqlConnection(ConnectionString);
            await connection.OpenAsync();

            // Load existing SportConcepts for tag matching
            var concepts = await connection.QueryAsync<SportConcept>("SELECT \"Id\", \"Name\" FROM \"SportConcepts\"");
            var conceptDict = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            foreach (var c in concepts)
            {
                var key = c.Name.Trim();
                if (!conceptDict.ContainsKey(key))
                {
                    conceptDict[key] = c.Id;
                }
            }

            Console.WriteLine($"Loaded {conceptDict.Count} sport concepts from DB.");

            int addedCount = 0;
            int updatedCount = 0;
            int skippedCount = 0;

            foreach (var ex in exercises)
            {
                // Check for duplicate by Title
                var existingId = await connection.QueryFirstOrDefaultAsync<int?>("SELECT \"Id\" FROM \"Exercises\" WHERE \"Name\" = @Name", new { Name = ex.Title });
                int exerciseId;

                if (existingId.HasValue)
                {
                    // Update existing
                    exerciseId = existingId.Value;
                    // Update metadata? No, just link concepts.
                    // But assume we want to fix concepts, so clear existing ones.
                    await connection.ExecuteAsync("DELETE FROM \"ExerciseConcepts\" WHERE \"ExercisesId\" = @ExerciseId", new { ExerciseId = exerciseId });
                    updatedCount++;
                }
                else
                {
                    // Insert Exercise
                    var insertSql = @"
                    INSERT INTO ""Exercises"" (""Name"", ""Description"", ""MediaUrl"", ""IsActive"", ""CreatedAt"", ""Tags"")
                    VALUES (@Name, @Description, @MediaUrl, true, NOW(), @Tags)
                    RETURNING ""Id"";";

                    try
                    {
                        exerciseId = await connection.QuerySingleAsync<int>(insertSql, new
                        {
                            Name = ex.Title,
                            Description = ex.Description,
                            MediaUrl = string.IsNullOrWhiteSpace(ex.VideoUrl) ? null : ex.VideoUrl,
                            Tags = ex.Tags ?? new List<string>()
                        });
                        addedCount++;
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine($"Error inserting '{ex.Title}': {e.Message}");
                        continue;
                    }
                }

                // Process Tags (Link to SportConcepts)
                if (ex.Tags != null)
                {
                    foreach (var tag in ex.Tags)
                    {
                        var tagKey = tag.Trim();
                        string? conceptName = null;

                        // Try to find name from CSV mapping
                        if (tagMapping.TryGetValue(tagKey, out var name))
                        {
                            conceptName = name;
                        }

                        // If no name found (maybe tag IS the name?), use tagKey
                        if (conceptName == null) conceptName = tagKey;

                        if (conceptDict.TryGetValue(conceptName, out var conceptId))
                        {
                            // Avoid duplicates in mapping
                            var exists = await connection.QueryFirstOrDefaultAsync<int?>("SELECT 1 FROM \"ExerciseConcepts\" WHERE \"ExercisesId\" = @ExId AND \"ConceptsId\" = @CId", new { ExId = exerciseId, CId = conceptId });
                            if (!exists.HasValue)
                            {
                                await connection.ExecuteAsync(
                                    "INSERT INTO \"ExerciseConcepts\" (\"ExercisesId\", \"ConceptsId\") VALUES (@ExerciseId, @ConceptId)",
                                    new { ExerciseId = exerciseId, ConceptId = conceptId });
                            }
                        }
                        else
                        {
                            Console.WriteLine($"Warning: Tag '{tag}' (Name: {conceptName}) not found in SportConcepts for exercise '{ex.Title}'.");
                        }
                    }
                }

                if ((addedCount + updatedCount) % 10 == 0) Console.Write(".");
            }

            Console.WriteLine();
            Console.WriteLine($"Import complete. Added: {addedCount}, Updated: {updatedCount}, Skipped: {skippedCount}");
        }
    }

    public class ExerciseJsonModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string> Tags { get; set; }
        public string VideoUrl { get; set; }
    }

    public class SportConcept
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
