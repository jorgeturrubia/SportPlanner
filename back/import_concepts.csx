#r "nuget: Npgsql, 8.0.0"
#r "nuget: CsvHelper, 30.0.1"

using Npgsql;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using System.IO;

var connectionString = "User Id=postgres.uyvcgsjrqgzpsbptmqxp;Password=Mercedes@2604.52;Server=aws-0-eu-west-3.pooler.supabase.com;Port=5432;Database=postgres;Timeout=60;Command Timeout=60";
var csvPath = @"c:\Proyectos\SportPlanner\DocSportPlanner\Conceptos.Basquet.v3 - nuevo3.csv";
var sportId = 6; // Baloncesto

var categoryMap = new Dictionary<string, int>(); // "ParentName|Name" -> Id

using (var conn = new NpgsqlConnection(connectionString))
{
    conn.Open();

    var config = new CsvConfiguration(CultureInfo.InvariantCulture)
    {
        HasHeaderRecord = true,
        Delimiter = ",",
        TrimOptions = TrimOptions.Trim
    };

    using (var reader = new StreamReader(csvPath))
    using (var csv = new CsvReader(reader, config))
    {
        var records = csv.GetRecords<dynamic>();
        int count = 0;
        foreach (var record in records)
        {
            var row = (IDictionary<string, object>)record;
            
            string seccion = row["Seccion"].ToString();
            string categoria = row["Categoría"].ToString();
            string subcategoria = row["Subcategoría"].ToString();
            string concepto = row["Concepto"].ToString();
            string descripcion = row["Descripción"].ToString();
            string url = row["Url"].ToString();
            int techDifficulty = int.Parse(row["Complejidad tecnica"].ToString());
            int tactComplexity = int.Parse(row["Complejidad tactica"].ToString());
            string focusText = row["Enfoque Tecnico/Tactico"].ToString();
            int nivel = int.Parse(row["Nivel"].ToString());

            // 1. Ensure Seccion exists
            int parentId = GetOrCreateCategory(conn, seccion, null);
            
            // 2. Ensure Categoria exists
            int catId = GetOrCreateCategory(conn, categoria, parentId);
            
            // 3. Ensure Subcategoria exists
            int subCatId = GetOrCreateCategory(conn, subcategoria, catId);

            // 4. Insert Concept
            if (!ConceptExists(conn, concepto, subCatId))
            {
                InsertConcept(conn, concepto, descripcion, url, subCatId, techDifficulty, tactComplexity, focusText, nivel);
                count++;
            }
        }
        Console.WriteLine($"Importación completada. Se añadieron {count} conceptos.");
    }
}

int GetOrCreateCategory(NpgsqlConnection conn, string name, int? parentId)
{
    string key = $"{(parentId?.ToString() ?? "null")}|{name}";
    if (categoryMap.TryGetValue(key, out int id)) return id;

    // Check DB
    using (var cmd = new NpgsqlCommand())
    {
        cmd.Connection = conn;
        if (parentId == null)
        {
            cmd.CommandText = "SELECT \"Id\" FROM \"ConceptCategories\" WHERE \"Name\" = @name AND \"ParentId\" IS NULL AND \"IsSystem\" = TRUE";
            cmd.Parameters.AddWithValue("name", name);
        }
        else
        {
            cmd.CommandText = "SELECT \"Id\" FROM \"ConceptCategories\" WHERE \"Name\" = @name AND \"ParentId\" = @parentId AND \"IsSystem\" = TRUE";
            cmd.Parameters.AddWithValue("name", name);
            cmd.Parameters.AddWithValue("parentId", parentId.Value);
        }

        var result = cmd.ExecuteScalar();
        if (result != null)
        {
            id = (int)result;
        }
        else
        {
            // Create
            using var insertCmd = new NpgsqlCommand("INSERT INTO \"ConceptCategories\" (\"Name\", \"ParentId\", \"IsSystem\", \"IsActive\") VALUES (@name, @parentId, TRUE, TRUE) RETURNING \"Id\"", conn);
            insertCmd.Parameters.AddWithValue("name", name);
            insertCmd.Parameters.AddWithValue("parentId", (object)parentId ?? DBNull.Value);
            id = (int)insertCmd.ExecuteScalar();
        }
    }

    categoryMap[key] = id;
    return id;
}

bool ConceptExists(NpgsqlConnection conn, string name, int subCatId)
{
    using var cmd = new NpgsqlCommand("SELECT COUNT(*) FROM \"SportConcepts\" WHERE \"Name\" = @name AND \"ConceptCategoryId\" = @catId AND \"SportId\" = @sportId", conn);
    cmd.Parameters.AddWithValue("name", name);
    cmd.Parameters.AddWithValue("catId", subCatId);
    cmd.Parameters.AddWithValue("sportId", sportId);
    return (long)cmd.ExecuteScalar() > 0;
}

void InsertConcept(NpgsqlConnection conn, string name, string desc, string url, int catId, int tech, int tact, string focusText, int nivel)
{
    // Note: We don't have a clear mapping for focusText to int, so we'll store it in Description or a new field if existed.
    // But since the model only has int?, and focusText is long, we'll ignore it for now or prepend it to description.
    string finalDesc = desc;
    if (!string.IsNullOrEmpty(focusText) && focusText != "(Sin descripción específica)")
    {
        finalDesc = $"{focusText}\n\n{desc}";
    }

    using var cmd = new NpgsqlCommand(@"
        INSERT INTO ""SportConcepts"" 
        (""Name"", ""Description"", ""Url"", ""ConceptCategoryId"", ""TechnicalDifficulty"", ""TacticalComplexity"", ""DevelopmentLevel"", ""SportId"", ""IsSystem"", ""IsActive"") 
        VALUES 
        (@name, @desc, @url, @catId, @tech, @tact, @nivel, @sportId, TRUE, TRUE)", conn);
    
    cmd.Parameters.AddWithValue("name", name);
    cmd.Parameters.AddWithValue("desc", (object)finalDesc ?? DBNull.Value);
    cmd.Parameters.AddWithValue("url", (object)url ?? DBNull.Value);
    cmd.Parameters.AddWithValue("catId", catId);
    cmd.Parameters.AddWithValue("tech", tech);
    cmd.Parameters.AddWithValue("tact", tact);
    cmd.Parameters.AddWithValue("nivel", nivel);
    cmd.Parameters.AddWithValue("sportId", sportId);
    
    cmd.ExecuteNonQuery();
}
