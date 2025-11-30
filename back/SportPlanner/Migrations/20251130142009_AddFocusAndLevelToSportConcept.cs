using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddFocusAndLevelToSportConcept : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DevelopmentLevel",
                table: "SportConcepts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalTacticalFocus",
                table: "SportConcepts",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DevelopmentLevel",
                table: "SportConcepts");

            migrationBuilder.DropColumn(
                name: "TechnicalTacticalFocus",
                table: "SportConcepts");
        }
    }
}
