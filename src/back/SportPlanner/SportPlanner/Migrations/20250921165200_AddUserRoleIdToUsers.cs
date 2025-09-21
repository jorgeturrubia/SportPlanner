using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRoleIdToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Primero, asegurar que existe al menos un UserRole
            migrationBuilder.Sql(@"
                INSERT INTO ""UserRoles"" (""Name"", ""Description"", ""IsActive"", ""CreatedAt"", ""UpdatedAt"")
                SELECT 'Default', 'Default user role', true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM ""UserRoles"" WHERE ""IsActive"" = true);
            ");

            // Agregar la columna UserRoleId a la tabla Users como nullable primero
            migrationBuilder.AddColumn<int>(
                name: "UserRoleId",
                table: "Users",
                type: "integer",
                nullable: true);

            // Actualizar todos los registros existentes con un valor válido
            migrationBuilder.Sql(@"
                UPDATE ""Users"" 
                SET ""UserRoleId"" = (
                    SELECT ""Id"" 
                    FROM ""UserRoles"" 
                    WHERE ""IsActive"" = true 
                    ORDER BY ""Id"" 
                    LIMIT 1
                )
                WHERE ""UserRoleId"" IS NULL;
            ");

            // Ahora hacer la columna NOT NULL
            migrationBuilder.AlterColumn<int>(
                name: "UserRoleId",
                table: "Users",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            // Crear el foreign key hacia UserRoles
            migrationBuilder.CreateIndex(
                name: "IX_Users_UserRoleId",
                table: "Users",
                column: "UserRoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_UserRoles_UserRoleId",
                table: "Users",
                column: "UserRoleId",
                principalTable: "UserRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remover el foreign key
            migrationBuilder.DropForeignKey(
                name: "FK_Users_UserRoles_UserRoleId",
                table: "Users");

            // Remover el índice
            migrationBuilder.DropIndex(
                name: "IX_Users_UserRoleId",
                table: "Users");

            // Remover la columna
            migrationBuilder.DropColumn(
                name: "UserRoleId",
                table: "Users");
        }
    }
}