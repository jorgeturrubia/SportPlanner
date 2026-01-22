#r "nuget: Npgsql, 8.0.0"

using Npgsql;
using System;

var connectionString = "User Id=postgres.uyvcgsjrqgzpsbptmqxp;Password=Mercedes@2604.52;Server=aws-0-eu-west-3.pooler.supabase.com;Port=5432;Database=postgres;Timeout=60;Command Timeout=60";

using (var conn = new NpgsqlConnection(connectionString))
{
    conn.Open();
    using (var cmd = new NpgsqlCommand("SELECT \"Id\", \"Name\" FROM \"Sports\"", conn))
    {
        using (var reader = cmd.ExecuteReader())
        {
            Console.WriteLine("ID | Name");
            Console.WriteLine("---|-----");
            while (reader.Read())
            {
                Console.WriteLine($"{reader.GetInt32(0)} | {reader.GetString(1)}");
            }
        }
    }
}
