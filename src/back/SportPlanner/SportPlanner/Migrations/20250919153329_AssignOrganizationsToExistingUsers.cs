using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AssignOrganizationsToExistingUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Script para asignar organizaciones a usuarios existentes que no tienen una
            migrationBuilder.Sql(@"
                -- Crear organizaciones personales para usuarios que no tienen una
                INSERT INTO ""Organizations"" (""Id"", ""Name"", ""Description"", ""Address"", ""Phone"", ""Email"", ""CreatedAt"", ""UpdatedAt"", ""CreatedByUserId"", ""IsActive"")
                SELECT 
                    gen_random_uuid() as ""Id"",
                    CONCAT(u.""FirstName"", ' ', u.""LastName"", ' - Organización Personal') as ""Name"",
                    'Organización personal creada automáticamente' as ""Description"",
                    'Dirección no especificada' as ""Address"",
                    'Sin teléfono' as ""Phone"",
                    COALESCE(u.""Email"", 'sin-email@ejemplo.com') as ""Email"",
                    NOW() as ""CreatedAt"",
                    NOW() as ""UpdatedAt"",
                    u.""Id"" as ""CreatedByUserId"",
                    true as ""IsActive""
                FROM ""Users"" u
                WHERE u.""OrganizationId"" IS NULL;
                
                -- Actualizar usuarios para asignarles sus organizaciones personales
                UPDATE ""Users""
                SET ""OrganizationId"" = o.""Id""
                FROM ""Organizations"" o
                WHERE o.""Name"" = CONCAT(""Users"".""FirstName"", ' ', ""Users"".""LastName"", ' - Organización Personal')
                AND ""Users"".""OrganizationId"" IS NULL;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revertir los cambios eliminando las organizaciones personales creadas automáticamente
            migrationBuilder.Sql(@"
                -- Remover la asignación de organizaciones de usuarios
                UPDATE ""Users"" 
                SET ""OrganizationId"" = NULL 
                WHERE ""OrganizationId"" IN (
                    SELECT ""Id"" FROM ""Organizations"" 
                    WHERE ""Description"" = 'Organización personal creada automáticamente'
                );
                
                -- Eliminar las organizaciones personales creadas automáticamente
                DELETE FROM ""Organizations"" 
                WHERE ""Description"" = 'Organización personal creada automáticamente';
            ");
        }
    }
}
