using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddPlanningIdToTraining : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PlanningId",
                table: "TrainingSessions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OverrideDescription",
                table: "TrainingSessionConcepts",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSessions_PlanningId",
                table: "TrainingSessions",
                column: "PlanningId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingSessions_Plannings_PlanningId",
                table: "TrainingSessions",
                column: "PlanningId",
                principalTable: "Plannings",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrainingSessions_Plannings_PlanningId",
                table: "TrainingSessions");

            migrationBuilder.DropIndex(
                name: "IX_TrainingSessions_PlanningId",
                table: "TrainingSessions");

            migrationBuilder.DropColumn(
                name: "PlanningId",
                table: "TrainingSessions");

            migrationBuilder.DropColumn(
                name: "OverrideDescription",
                table: "TrainingSessionConcepts");
        }
    }
}
