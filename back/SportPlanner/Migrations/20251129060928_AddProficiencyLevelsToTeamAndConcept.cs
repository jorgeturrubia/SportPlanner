using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddProficiencyLevelsToTeamAndConcept : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SportConcepts_DifficultyLevels_DifficultyLevelId",
                table: "SportConcepts");

            migrationBuilder.DropIndex(
                name: "IX_SportConcepts_DifficultyLevelId",
                table: "SportConcepts");

            migrationBuilder.DropColumn(
                name: "DifficultyLevelId",
                table: "SportConcepts");

            migrationBuilder.AddColumn<int>(
                name: "CurrentTacticalLevel",
                table: "Teams",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CurrentTechnicalLevel",
                table: "Teams",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TacticalComplexity",
                table: "SportConcepts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TechnicalDifficulty",
                table: "SportConcepts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentTacticalLevel",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "CurrentTechnicalLevel",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "TacticalComplexity",
                table: "SportConcepts");

            migrationBuilder.DropColumn(
                name: "TechnicalDifficulty",
                table: "SportConcepts");

            migrationBuilder.AddColumn<int>(
                name: "DifficultyLevelId",
                table: "SportConcepts",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SportConcepts_DifficultyLevelId",
                table: "SportConcepts",
                column: "DifficultyLevelId");

            migrationBuilder.AddForeignKey(
                name: "FK_SportConcepts_DifficultyLevels_DifficultyLevelId",
                table: "SportConcepts",
                column: "DifficultyLevelId",
                principalTable: "DifficultyLevels",
                principalColumn: "Id");
        }
    }
}
