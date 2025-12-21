using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddSportToTeamCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Add column as nullable initially
            migrationBuilder.AddColumn<int>(
                name: "SportId",
                table: "TeamCategories",
                type: "integer",
                nullable: true);

            // 2. Set default value for existing rows (using the first available sport)
            migrationBuilder.Sql("UPDATE \"TeamCategories\" SET \"SportId\" = (SELECT \"Id\" FROM \"Sports\" LIMIT 1)");

            // 3. Make column non-nullable
            migrationBuilder.AlterColumn<int>(
                name: "SportId",
                table: "TeamCategories",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamCategories_SportId",
                table: "TeamCategories",
                column: "SportId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamCategories_Sports_SportId",
                table: "TeamCategories",
                column: "SportId",
                principalTable: "Sports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamCategories_Sports_SportId",
                table: "TeamCategories");

            migrationBuilder.DropIndex(
                name: "IX_TeamCategories_SportId",
                table: "TeamCategories");

            migrationBuilder.DropColumn(
                name: "SportId",
                table: "TeamCategories");
        }
    }
}
