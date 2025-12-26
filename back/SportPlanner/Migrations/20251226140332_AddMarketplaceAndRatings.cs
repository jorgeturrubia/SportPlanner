using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddMarketplaceAndRatings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SportConcepts_MethodologicalItineraries_MethodologicalItine~",
                table: "SportConcepts");

            migrationBuilder.AddColumn<double>(
                name: "AverageRating",
                table: "MethodologicalItineraries",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<bool>(
                name: "IsSystem",
                table: "MethodologicalItineraries",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "MethodologicalItineraries",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RatingCount",
                table: "MethodologicalItineraries",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SystemSourceId",
                table: "MethodologicalItineraries",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "MethodologicalItineraries",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ItineraryConcept",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ItineraryId = table.Column<int>(type: "integer", nullable: false),
                    SportConceptId = table.Column<int>(type: "integer", nullable: false),
                    CustomDescription = table.Column<string>(type: "text", nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItineraryConcept", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItineraryConcept_MethodologicalItineraries_ItineraryId",
                        column: x => x.ItineraryId,
                        principalTable: "MethodologicalItineraries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItineraryConcept_SportConcepts_SportConceptId",
                        column: x => x.SportConceptId,
                        principalTable: "SportConcepts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItineraryRatings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ItineraryId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItineraryRatings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItineraryRatings_MethodologicalItineraries_ItineraryId",
                        column: x => x.ItineraryId,
                        principalTable: "MethodologicalItineraries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MethodologicalItineraries_SystemSourceId",
                table: "MethodologicalItineraries",
                column: "SystemSourceId");

            migrationBuilder.CreateIndex(
                name: "IX_ItineraryConcept_ItineraryId",
                table: "ItineraryConcept",
                column: "ItineraryId");

            migrationBuilder.CreateIndex(
                name: "IX_ItineraryConcept_SportConceptId",
                table: "ItineraryConcept",
                column: "SportConceptId");

            migrationBuilder.CreateIndex(
                name: "IX_ItineraryRatings_ItineraryId_UserId",
                table: "ItineraryRatings",
                columns: new[] { "ItineraryId", "UserId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MethodologicalItineraries_MethodologicalItineraries_SystemS~",
                table: "MethodologicalItineraries",
                column: "SystemSourceId",
                principalTable: "MethodologicalItineraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SportConcepts_MethodologicalItineraries_MethodologicalItine~",
                table: "SportConcepts",
                column: "MethodologicalItineraryId",
                principalTable: "MethodologicalItineraries",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MethodologicalItineraries_MethodologicalItineraries_SystemS~",
                table: "MethodologicalItineraries");

            migrationBuilder.DropForeignKey(
                name: "FK_SportConcepts_MethodologicalItineraries_MethodologicalItine~",
                table: "SportConcepts");

            migrationBuilder.DropTable(
                name: "ItineraryConcept");

            migrationBuilder.DropTable(
                name: "ItineraryRatings");

            migrationBuilder.DropIndex(
                name: "IX_MethodologicalItineraries_SystemSourceId",
                table: "MethodologicalItineraries");

            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "MethodologicalItineraries");

            migrationBuilder.DropColumn(
                name: "IsSystem",
                table: "MethodologicalItineraries");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "MethodologicalItineraries");

            migrationBuilder.DropColumn(
                name: "RatingCount",
                table: "MethodologicalItineraries");

            migrationBuilder.DropColumn(
                name: "SystemSourceId",
                table: "MethodologicalItineraries");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "MethodologicalItineraries");

            migrationBuilder.AddForeignKey(
                name: "FK_SportConcepts_MethodologicalItineraries_MethodologicalItine~",
                table: "SportConcepts",
                column: "MethodologicalItineraryId",
                principalTable: "MethodologicalItineraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
