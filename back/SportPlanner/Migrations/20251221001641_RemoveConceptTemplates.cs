using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class RemoveConceptTemplates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SportConcepts_ConceptTemplates_ConceptTemplateId",
                table: "SportConcepts");

            migrationBuilder.DropTable(
                name: "ConceptTemplates");

            migrationBuilder.DropIndex(
                name: "IX_SportConcepts_ConceptTemplateId",
                table: "SportConcepts");

            migrationBuilder.DropColumn(
                name: "ConceptTemplateId",
                table: "SportConcepts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConceptTemplateId",
                table: "SportConcepts",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ConceptTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ConceptCategoryId = table.Column<int>(type: "integer", nullable: true),
                    SportId = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    TacticalComplexity = table.Column<int>(type: "integer", nullable: false),
                    TechnicalComplexity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConceptTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConceptTemplates_ConceptCategories_ConceptCategoryId",
                        column: x => x.ConceptCategoryId,
                        principalTable: "ConceptCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ConceptTemplates_Sports_SportId",
                        column: x => x.SportId,
                        principalTable: "Sports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SportConcepts_ConceptTemplateId",
                table: "SportConcepts",
                column: "ConceptTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptTemplates_ConceptCategoryId",
                table: "ConceptTemplates",
                column: "ConceptCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptTemplates_Name_SportId",
                table: "ConceptTemplates",
                columns: new[] { "Name", "SportId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ConceptTemplates_SportId",
                table: "ConceptTemplates",
                column: "SportId");

            migrationBuilder.AddForeignKey(
                name: "FK_SportConcepts_ConceptTemplates_ConceptTemplateId",
                table: "SportConcepts",
                column: "ConceptTemplateId",
                principalTable: "ConceptTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
