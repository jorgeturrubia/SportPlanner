using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddMarketplaceToConceptCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OriginSystemId",
                table: "SportConcepts",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OriginSystemId",
                table: "Exercises",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "Exercises",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsSystem",
                table: "ConceptCategories",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "OriginSystemId",
                table: "ConceptCategories",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "ConceptCategories",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SportConcepts_OriginSystemId",
                table: "SportConcepts",
                column: "OriginSystemId");

            migrationBuilder.CreateIndex(
                name: "IX_SportConcepts_OwnerId",
                table: "SportConcepts",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_OriginSystemId",
                table: "Exercises",
                column: "OriginSystemId");

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_OwnerId",
                table: "Exercises",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptCategories_OriginSystemId",
                table: "ConceptCategories",
                column: "OriginSystemId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptCategories_OwnerId",
                table: "ConceptCategories",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_ConceptCategories_ConceptCategories_OriginSystemId",
                table: "ConceptCategories",
                column: "OriginSystemId",
                principalTable: "ConceptCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Exercises_Exercises_OriginSystemId",
                table: "Exercises",
                column: "OriginSystemId",
                principalTable: "Exercises",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_SportConcepts_SportConcepts_OriginSystemId",
                table: "SportConcepts",
                column: "OriginSystemId",
                principalTable: "SportConcepts",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConceptCategories_ConceptCategories_OriginSystemId",
                table: "ConceptCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_Exercises_Exercises_OriginSystemId",
                table: "Exercises");

            migrationBuilder.DropForeignKey(
                name: "FK_SportConcepts_SportConcepts_OriginSystemId",
                table: "SportConcepts");

            migrationBuilder.DropIndex(
                name: "IX_SportConcepts_OriginSystemId",
                table: "SportConcepts");

            migrationBuilder.DropIndex(
                name: "IX_SportConcepts_OwnerId",
                table: "SportConcepts");

            migrationBuilder.DropIndex(
                name: "IX_Exercises_OriginSystemId",
                table: "Exercises");

            migrationBuilder.DropIndex(
                name: "IX_Exercises_OwnerId",
                table: "Exercises");

            migrationBuilder.DropIndex(
                name: "IX_ConceptCategories_OriginSystemId",
                table: "ConceptCategories");

            migrationBuilder.DropIndex(
                name: "IX_ConceptCategories_OwnerId",
                table: "ConceptCategories");

            migrationBuilder.DropColumn(
                name: "OriginSystemId",
                table: "SportConcepts");

            migrationBuilder.DropColumn(
                name: "OriginSystemId",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "IsSystem",
                table: "ConceptCategories");

            migrationBuilder.DropColumn(
                name: "OriginSystemId",
                table: "ConceptCategories");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "ConceptCategories");
        }
    }
}
