using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddConceptInterpretation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TeamCategoryId",
                table: "Teams",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TeamLevelId",
                table: "Teams",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TeamCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    MinAge = table.Column<int>(type: "integer", nullable: true),
                    MaxAge = table.Column<int>(type: "integer", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TeamLevels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Rank = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamLevels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TeamPreferences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TeamId = table.Column<int>(type: "integer", nullable: false),
                    PreferencesJson = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamPreferences_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ConceptInterpretations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SportConceptId = table.Column<int>(type: "integer", nullable: false),
                    TeamId = table.Column<int>(type: "integer", nullable: true),
                    TeamCategoryId = table.Column<int>(type: "integer", nullable: true),
                    TeamLevelId = table.Column<int>(type: "integer", nullable: true),
                    InterpretedDifficultyLevelId = table.Column<int>(type: "integer", nullable: true),
                    DurationMultiplier = table.Column<decimal>(type: "numeric", nullable: false),
                    PriorityMultiplier = table.Column<decimal>(type: "numeric", nullable: false),
                    IsSuggested = table.Column<bool>(type: "boolean", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConceptInterpretations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConceptInterpretations_DifficultyLevels_InterpretedDifficul~",
                        column: x => x.InterpretedDifficultyLevelId,
                        principalTable: "DifficultyLevels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ConceptInterpretations_SportConcepts_SportConceptId",
                        column: x => x.SportConceptId,
                        principalTable: "SportConcepts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConceptInterpretations_TeamCategories_TeamCategoryId",
                        column: x => x.TeamCategoryId,
                        principalTable: "TeamCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConceptInterpretations_TeamLevels_TeamLevelId",
                        column: x => x.TeamLevelId,
                        principalTable: "TeamLevels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConceptInterpretations_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Teams_TeamCategoryId",
                table: "Teams",
                column: "TeamCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_TeamLevelId",
                table: "Teams",
                column: "TeamLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptInterpretations_InterpretedDifficultyLevelId",
                table: "ConceptInterpretations",
                column: "InterpretedDifficultyLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptInterpretations_SportConceptId",
                table: "ConceptInterpretations",
                column: "SportConceptId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptInterpretations_TeamCategoryId",
                table: "ConceptInterpretations",
                column: "TeamCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptInterpretations_TeamId",
                table: "ConceptInterpretations",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptInterpretations_TeamLevelId",
                table: "ConceptInterpretations",
                column: "TeamLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamPreferences_TeamId",
                table: "TeamPreferences",
                column: "TeamId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_TeamCategories_TeamCategoryId",
                table: "Teams",
                column: "TeamCategoryId",
                principalTable: "TeamCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_TeamLevels_TeamLevelId",
                table: "Teams",
                column: "TeamLevelId",
                principalTable: "TeamLevels",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Teams_TeamCategories_TeamCategoryId",
                table: "Teams");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_TeamLevels_TeamLevelId",
                table: "Teams");

            migrationBuilder.DropTable(
                name: "ConceptInterpretations");

            migrationBuilder.DropTable(
                name: "TeamPreferences");

            migrationBuilder.DropTable(
                name: "TeamCategories");

            migrationBuilder.DropTable(
                name: "TeamLevels");

            migrationBuilder.DropIndex(
                name: "IX_Teams_TeamCategoryId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_TeamLevelId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "TeamCategoryId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "TeamLevelId",
                table: "Teams");
        }
    }
}
