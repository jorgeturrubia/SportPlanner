using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddHierarchicalSessionExercises : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrainingSessionConcepts_SportConcepts_SportConceptId",
                table: "TrainingSessionConcepts");

            migrationBuilder.AddColumn<int>(
                name: "TrainingSessionConceptId",
                table: "TrainingSessionExercises",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "SportConceptId",
                table: "TrainingSessionConcepts",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "CustomName",
                table: "TrainingSessionConcepts",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSessionExercises_TrainingSessionConceptId",
                table: "TrainingSessionExercises",
                column: "TrainingSessionConceptId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingSessionConcepts_SportConcepts_SportConceptId",
                table: "TrainingSessionConcepts",
                column: "SportConceptId",
                principalTable: "SportConcepts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingSessionExercises_TrainingSessionConcepts_TrainingSe~",
                table: "TrainingSessionExercises",
                column: "TrainingSessionConceptId",
                principalTable: "TrainingSessionConcepts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrainingSessionConcepts_SportConcepts_SportConceptId",
                table: "TrainingSessionConcepts");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingSessionExercises_TrainingSessionConcepts_TrainingSe~",
                table: "TrainingSessionExercises");

            migrationBuilder.DropIndex(
                name: "IX_TrainingSessionExercises_TrainingSessionConceptId",
                table: "TrainingSessionExercises");

            migrationBuilder.DropColumn(
                name: "TrainingSessionConceptId",
                table: "TrainingSessionExercises");

            migrationBuilder.DropColumn(
                name: "CustomName",
                table: "TrainingSessionConcepts");

            migrationBuilder.AlterColumn<int>(
                name: "SportConceptId",
                table: "TrainingSessionConcepts",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingSessionConcepts_SportConcepts_SportConceptId",
                table: "TrainingSessionConcepts",
                column: "SportConceptId",
                principalTable: "SportConcepts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
