using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class LinkConceptsToItinerary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MethodologicalItineraryId",
                table: "SportConcepts",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SportConcepts_MethodologicalItineraryId",
                table: "SportConcepts",
                column: "MethodologicalItineraryId");

            migrationBuilder.AddForeignKey(
                name: "FK_SportConcepts_MethodologicalItineraries_MethodologicalItine~",
                table: "SportConcepts",
                column: "MethodologicalItineraryId",
                principalTable: "MethodologicalItineraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SportConcepts_MethodologicalItineraries_MethodologicalItine~",
                table: "SportConcepts");

            migrationBuilder.DropIndex(
                name: "IX_SportConcepts_MethodologicalItineraryId",
                table: "SportConcepts");

            migrationBuilder.DropColumn(
                name: "MethodologicalItineraryId",
                table: "SportConcepts");
        }
    }
}
