using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class DecoupleTeamSeason : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Create New Structures
            migrationBuilder.CreateTable(
                name: "TeamSeasons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TeamId = table.Column<int>(type: "integer", nullable: false),
                    SeasonId = table.Column<int>(type: "integer", nullable: false),
                    TeamLevelId = table.Column<int>(type: "integer", nullable: true),
                    TeamCategoryId = table.Column<int>(type: "integer", nullable: true),
                    TechnicalLevel = table.Column<int>(type: "integer", nullable: false),
                    TacticalLevel = table.Column<int>(type: "integer", nullable: false),
                    PhotoUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamSeasons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamSeasons_Seasons_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Seasons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamSeasons_TeamCategories_TeamCategoryId",
                        column: x => x.TeamCategoryId,
                        principalTable: "TeamCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_TeamSeasons_TeamLevels_TeamLevelId",
                        column: x => x.TeamLevelId,
                        principalTable: "TeamLevels",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TeamSeasons_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeamSeasons_SeasonId",
                table: "TeamSeasons",
                column: "SeasonId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamSeasons_TeamCategoryId",
                table: "TeamSeasons",
                column: "TeamCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamSeasons_TeamId_SeasonId",
                table: "TeamSeasons",
                columns: new[] { "TeamId", "SeasonId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamSeasons_TeamLevelId",
                table: "TeamSeasons",
                column: "TeamLevelId");

            migrationBuilder.AddColumn<int>(
                name: "SeasonId",
                table: "Plannings",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Plannings_SeasonId",
                table: "Plannings",
                column: "SeasonId");

            migrationBuilder.AddForeignKey(
                name: "FK_Plannings_Seasons_SeasonId",
                table: "Plannings",
                column: "SeasonId",
                principalTable: "Seasons",
                principalColumn: "Id");

            // 2. Data Migration (SQL Injection)
            migrationBuilder.Sql(
                @"INSERT INTO ""TeamSeasons"" (""TeamId"", ""SeasonId"", ""TeamLevelId"", ""TechnicalLevel"", ""TacticalLevel"", ""TeamCategoryId"") 
                  SELECT ""Id"", ""SeasonId"", ""TeamLevelId"", ""CurrentTechnicalLevel"", ""CurrentTacticalLevel"", ""TeamCategoryId"" 
                  FROM ""Teams"" 
                  WHERE ""SeasonId"" IS NOT NULL;");

            migrationBuilder.Sql(
                @"UPDATE ""Plannings"" 
                  SET ""SeasonId"" = (SELECT ""SeasonId"" FROM ""Teams"" WHERE ""Teams"".""Id"" = ""Plannings"".""TeamId"") 
                  WHERE ""SeasonId"" IS NULL OR ""SeasonId"" = 0;");

            // 3. Drop Old Structures
            migrationBuilder.DropForeignKey(
                name: "FK_MethodologicalItineraries_TeamCategories_TeamCategoryId",
                table: "MethodologicalItineraries");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_Seasons_SeasonId",
                table: "Teams");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_TeamCategories_TeamCategoryId",
                table: "Teams");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_TeamLevels_TeamLevelId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_SeasonId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_TeamCategoryId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_TeamLevelId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "CurrentTacticalLevel",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "CurrentTechnicalLevel",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "SeasonId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "TeamCategoryId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "TeamLevelId",
                table: "Teams");

            // 4. Re-add modified FKs
            migrationBuilder.AddForeignKey(
                name: "FK_MethodologicalItineraries_TeamCategories_TeamCategoryId",
                table: "MethodologicalItineraries",
                column: "TeamCategoryId",
                principalTable: "TeamCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MethodologicalItineraries_TeamCategories_TeamCategoryId",
                table: "MethodologicalItineraries");

            migrationBuilder.DropForeignKey(
                name: "FK_Plannings_Seasons_SeasonId",
                table: "Plannings");

            migrationBuilder.DropTable(
                name: "TeamSeasons");

            migrationBuilder.DropIndex(
                name: "IX_Plannings_SeasonId",
                table: "Plannings");

            migrationBuilder.DropColumn(
                name: "SeasonId",
                table: "Plannings");

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
                name: "SeasonId",
                table: "Teams",
                type: "integer",
                nullable: true);

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

            migrationBuilder.CreateIndex(
                name: "IX_Teams_SeasonId",
                table: "Teams",
                column: "SeasonId");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_TeamCategoryId",
                table: "Teams",
                column: "TeamCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_TeamLevelId",
                table: "Teams",
                column: "TeamLevelId");

            migrationBuilder.AddForeignKey(
                name: "FK_MethodologicalItineraries_TeamCategories_TeamCategoryId",
                table: "MethodologicalItineraries",
                column: "TeamCategoryId",
                principalTable: "TeamCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_Seasons_SeasonId",
                table: "Teams",
                column: "SeasonId",
                principalTable: "Seasons",
                principalColumn: "Id");

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
    }
}
