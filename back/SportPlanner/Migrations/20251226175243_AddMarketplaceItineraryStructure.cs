using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddMarketplaceItineraryStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlanningTemplateRatings");

            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "PlanningTemplates");

            migrationBuilder.DropColumn(
                name: "RatingCount",
                table: "PlanningTemplates");

            migrationBuilder.AddColumn<int>(
                name: "MethodologicalItineraryId",
                table: "PlanningTemplates",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "MethodologicalItineraries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    SportId = table.Column<int>(type: "integer", nullable: false),
                    IsSystem = table.Column<bool>(type: "boolean", nullable: false),
                    OwnerId = table.Column<string>(type: "text", nullable: true),
                    Version = table.Column<int>(type: "integer", nullable: false),
                    AverageRating = table.Column<double>(type: "double precision", nullable: false),
                    RatingCount = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    SystemSourceId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MethodologicalItineraries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MethodologicalItineraries_MethodologicalItineraries_SystemS~",
                        column: x => x.SystemSourceId,
                        principalTable: "MethodologicalItineraries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_MethodologicalItineraries_Sports_SportId",
                        column: x => x.SportId,
                        principalTable: "Sports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MethodologicalItineraryRatings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MethodologicalItineraryId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MethodologicalItineraryRatings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MethodologicalItineraryRatings_MethodologicalItineraries_Me~",
                        column: x => x.MethodologicalItineraryId,
                        principalTable: "MethodologicalItineraries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlanningTemplates_MethodologicalItineraryId",
                table: "PlanningTemplates",
                column: "MethodologicalItineraryId");

            migrationBuilder.CreateIndex(
                name: "IX_MethodologicalItineraries_SportId",
                table: "MethodologicalItineraries",
                column: "SportId");

            migrationBuilder.CreateIndex(
                name: "IX_MethodologicalItineraries_SystemSourceId",
                table: "MethodologicalItineraries",
                column: "SystemSourceId");

            migrationBuilder.CreateIndex(
                name: "IX_MethodologicalItineraryRatings_MethodologicalItineraryId_Us~",
                table: "MethodologicalItineraryRatings",
                columns: new[] { "MethodologicalItineraryId", "UserId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningTemplates_MethodologicalItineraries_MethodologicalI~",
                table: "PlanningTemplates",
                column: "MethodologicalItineraryId",
                principalTable: "MethodologicalItineraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlanningTemplates_MethodologicalItineraries_MethodologicalI~",
                table: "PlanningTemplates");

            migrationBuilder.DropTable(
                name: "MethodologicalItineraryRatings");

            migrationBuilder.DropTable(
                name: "MethodologicalItineraries");

            migrationBuilder.DropIndex(
                name: "IX_PlanningTemplates_MethodologicalItineraryId",
                table: "PlanningTemplates");

            migrationBuilder.DropColumn(
                name: "MethodologicalItineraryId",
                table: "PlanningTemplates");

            migrationBuilder.AddColumn<double>(
                name: "AverageRating",
                table: "PlanningTemplates",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "RatingCount",
                table: "PlanningTemplates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "PlanningTemplateRatings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PlanningTemplateId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanningTemplateRatings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlanningTemplateRatings_PlanningTemplates_PlanningTemplateId",
                        column: x => x.PlanningTemplateId,
                        principalTable: "PlanningTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlanningTemplateRatings_PlanningTemplateId_UserId",
                table: "PlanningTemplateRatings",
                columns: new[] { "PlanningTemplateId", "UserId" },
                unique: true);
        }
    }
}
