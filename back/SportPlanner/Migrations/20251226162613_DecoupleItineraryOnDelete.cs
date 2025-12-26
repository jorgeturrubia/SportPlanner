using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class DecoupleItineraryOnDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MethodologicalItineraries_MethodologicalItineraries_SystemS~",
                table: "MethodologicalItineraries");

            migrationBuilder.AddForeignKey(
                name: "FK_MethodologicalItineraries_MethodologicalItineraries_SystemS~",
                table: "MethodologicalItineraries",
                column: "SystemSourceId",
                principalTable: "MethodologicalItineraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MethodologicalItineraries_MethodologicalItineraries_SystemS~",
                table: "MethodologicalItineraries");

            migrationBuilder.AddForeignKey(
                name: "FK_MethodologicalItineraries_MethodologicalItineraries_SystemS~",
                table: "MethodologicalItineraries",
                column: "SystemSourceId",
                principalTable: "MethodologicalItineraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
