#r "nuget: Npgsql, 8.0.0"

using Npgsql;
using System;

var connectionString = "User Id=postgres.uyvcgsjrqgzpsbptmqxp;Password=Mercedes@2604.52;Server=aws-0-eu-west-3.pooler.supabase.com;Port=5432;Database=postgres;Timeout=60;Command Timeout=60";

using (var conn = new NpgsqlConnection(connectionString))
{
    conn.Open();
    using (var cmd = new NpgsqlCommand("SELECT \"Name\", \"TechnicalTacticalFocus\", \"DevelopmentLevel\" FROM \"SportConcepts\" WHERE \"SportId\" = 6 LIMIT 10", conn))
    {
        using (var reader = cmd.ExecuteReader())
        {
            Console.WriteLine("Name | Focus | Level");
            Console.WriteLine("-----|-------|------");
            while (reader.Read())
            {
                var focus = reader.IsDBNull(1) ? "NULL" : reader.GetInt32(1).ToString();
                var level = reader.IsDBNull(2) ? "NULL" : reader.GetInt32(2).ToString();
                Console.WriteLine($"{reader.GetString(0)} | {focus} | {level}");
            }
        }
    }
}
