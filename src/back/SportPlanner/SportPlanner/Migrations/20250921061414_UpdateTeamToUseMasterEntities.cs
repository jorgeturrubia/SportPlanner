using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTeamToUseMasterEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Sport",
                table: "Teams");

            migrationBuilder.RenameColumn(
                name: "Level",
                table: "Teams",
                newName: "SportId");

            migrationBuilder.RenameColumn(
                name: "Gender",
                table: "Teams",
                newName: "SportGenderId");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Teams",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LevelId",
                table: "Teams",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Teams_CategoryId",
                table: "Teams",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_LevelId",
                table: "Teams",
                column: "LevelId");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_SportGenderId",
                table: "Teams",
                column: "SportGenderId");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_SportId",
                table: "Teams",
                column: "SportId");

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_Categories_CategoryId",
                table: "Teams",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_Levels_LevelId",
                table: "Teams",
                column: "LevelId",
                principalTable: "Levels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_SportGenders_SportGenderId",
                table: "Teams",
                column: "SportGenderId",
                principalTable: "SportGenders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_Sports_SportId",
                table: "Teams",
                column: "SportId",
                principalTable: "Sports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Teams_Categories_CategoryId",
                table: "Teams");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_Levels_LevelId",
                table: "Teams");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_SportGenders_SportGenderId",
                table: "Teams");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_Sports_SportId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_CategoryId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_LevelId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_SportGenderId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_SportId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "LevelId",
                table: "Teams");

            migrationBuilder.RenameColumn(
                name: "SportId",
                table: "Teams",
                newName: "Level");

            migrationBuilder.RenameColumn(
                name: "SportGenderId",
                table: "Teams",
                newName: "Gender");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Teams",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Sport",
                table: "Teams",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }
    }
}
