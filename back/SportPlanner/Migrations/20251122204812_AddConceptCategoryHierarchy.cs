using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddConceptCategoryHierarchy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentId",
                table: "ConceptCategories",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ConceptCategories_ParentId",
                table: "ConceptCategories",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_ConceptCategories_ConceptCategories_ParentId",
                table: "ConceptCategories",
                column: "ParentId",
                principalTable: "ConceptCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConceptCategories_ConceptCategories_ParentId",
                table: "ConceptCategories");

            migrationBuilder.DropIndex(
                name: "IX_ConceptCategories_ParentId",
                table: "ConceptCategories");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "ConceptCategories");
        }
    }
}
