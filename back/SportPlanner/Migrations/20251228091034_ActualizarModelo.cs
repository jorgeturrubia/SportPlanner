using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class ActualizarModelo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSystem",
                table: "SportConcepts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "PlanningTemplates",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "AuthorName",
                table: "Exercises",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "AverageRating",
                table: "Exercises",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<bool>(
                name: "IsSystem",
                table: "Exercises",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "RatingCount",
                table: "Exercises",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SportId",
                table: "Exercises",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_SportId",
                table: "Exercises",
                column: "SportId");

            migrationBuilder.AddForeignKey(
                name: "FK_Exercises_Sports_SportId",
                table: "Exercises",
                column: "SportId",
                principalTable: "Sports",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exercises_Sports_SportId",
                table: "Exercises");

            migrationBuilder.DropIndex(
                name: "IX_Exercises_SportId",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "IsSystem",
                table: "SportConcepts");

            migrationBuilder.DropColumn(
                name: "AuthorName",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "IsSystem",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "RatingCount",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "SportId",
                table: "Exercises");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "PlanningTemplates",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
