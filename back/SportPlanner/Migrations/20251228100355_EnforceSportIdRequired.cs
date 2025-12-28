using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class EnforceSportIdRequired : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SportConcepts_Sports_SportId",
                table: "SportConcepts");

            migrationBuilder.AlterColumn<int>(
                name: "SportId",
                table: "SportConcepts",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SportConcepts_Sports_SportId",
                table: "SportConcepts",
                column: "SportId",
                principalTable: "Sports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SportConcepts_Sports_SportId",
                table: "SportConcepts");

            migrationBuilder.AlterColumn<int>(
                name: "SportId",
                table: "SportConcepts",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_SportConcepts_Sports_SportId",
                table: "SportConcepts",
                column: "SportId",
                principalTable: "Sports",
                principalColumn: "Id");
        }
    }
}
