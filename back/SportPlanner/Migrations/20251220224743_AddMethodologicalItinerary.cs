using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddMethodologicalItinerary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MethodologicalItineraries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false),
                    ParentItineraryId = table.Column<int>(type: "integer", nullable: true),
                    TeamCategoryId = table.Column<int>(type: "integer", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MethodologicalItineraries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MethodologicalItineraries_MethodologicalItineraries_ParentI~",
                        column: x => x.ParentItineraryId,
                        principalTable: "MethodologicalItineraries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MethodologicalItineraries_TeamCategories_TeamCategoryId",
                        column: x => x.TeamCategoryId,
                        principalTable: "TeamCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MethodologicalItineraries_Code",
                table: "MethodologicalItineraries",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MethodologicalItineraries_ParentItineraryId",
                table: "MethodologicalItineraries",
                column: "ParentItineraryId");

            migrationBuilder.CreateIndex(
                name: "IX_MethodologicalItineraries_TeamCategoryId",
                table: "MethodologicalItineraries",
                column: "TeamCategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MethodologicalItineraries");
        }
    }
}
