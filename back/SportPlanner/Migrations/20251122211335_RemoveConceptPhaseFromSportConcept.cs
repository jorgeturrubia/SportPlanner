using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class RemoveConceptPhaseFromSportConcept : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SportConcepts_ConceptPhases_ConceptPhaseId",
                table: "SportConcepts");

            migrationBuilder.DropIndex(
                name: "IX_SportConcepts_ConceptPhaseId",
                table: "SportConcepts");

            migrationBuilder.DropColumn(
                name: "ConceptPhaseId",
                table: "SportConcepts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConceptPhaseId",
                table: "SportConcepts",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SportConcepts_ConceptPhaseId",
                table: "SportConcepts",
                column: "ConceptPhaseId");

            migrationBuilder.AddForeignKey(
                name: "FK_SportConcepts_ConceptPhases_ConceptPhaseId",
                table: "SportConcepts",
                column: "ConceptPhaseId",
                principalTable: "ConceptPhases",
                principalColumn: "Id");
        }
    }
}
