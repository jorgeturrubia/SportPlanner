using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsProgressive",
                table: "SportConcepts");

            migrationBuilder.DropColumn(
                name: "ProgressWeight",
                table: "SportConcepts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsProgressive",
                table: "SportConcepts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ProgressWeight",
                table: "SportConcepts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
