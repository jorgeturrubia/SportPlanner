using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePlanningEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlanConcepts_TrainingSchedules_TrainingScheduleId",
                table: "PlanConcepts");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingScheduleDays_TrainingSchedules_TrainingScheduleId",
                table: "TrainingScheduleDays");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingSchedules_Teams_TeamId",
                table: "TrainingSchedules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TrainingSchedules",
                table: "TrainingSchedules");

            migrationBuilder.RenameTable(
                name: "TrainingSchedules",
                newName: "Plannings");

            migrationBuilder.RenameColumn(
                name: "TrainingScheduleId",
                table: "TrainingScheduleDays",
                newName: "PlanningId");

            migrationBuilder.RenameIndex(
                name: "IX_TrainingScheduleDays_TrainingScheduleId_DayOfWeek",
                table: "TrainingScheduleDays",
                newName: "IX_TrainingScheduleDays_PlanningId_DayOfWeek");

            migrationBuilder.RenameColumn(
                name: "TrainingScheduleId",
                table: "PlanConcepts",
                newName: "PlanningId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanConcepts_TrainingScheduleId_SportConceptId",
                table: "PlanConcepts",
                newName: "IX_PlanConcepts_PlanningId_SportConceptId");

            migrationBuilder.RenameIndex(
                name: "IX_TrainingSchedules_TeamId",
                table: "Plannings",
                newName: "IX_Plannings_TeamId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Plannings",
                table: "Plannings",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PlanConcepts_Plannings_PlanningId",
                table: "PlanConcepts",
                column: "PlanningId",
                principalTable: "Plannings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Plannings_Teams_TeamId",
                table: "Plannings",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingScheduleDays_Plannings_PlanningId",
                table: "TrainingScheduleDays",
                column: "PlanningId",
                principalTable: "Plannings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlanConcepts_Plannings_PlanningId",
                table: "PlanConcepts");

            migrationBuilder.DropForeignKey(
                name: "FK_Plannings_Teams_TeamId",
                table: "Plannings");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingScheduleDays_Plannings_PlanningId",
                table: "TrainingScheduleDays");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Plannings",
                table: "Plannings");

            migrationBuilder.RenameTable(
                name: "Plannings",
                newName: "TrainingSchedules");

            migrationBuilder.RenameColumn(
                name: "PlanningId",
                table: "TrainingScheduleDays",
                newName: "TrainingScheduleId");

            migrationBuilder.RenameIndex(
                name: "IX_TrainingScheduleDays_PlanningId_DayOfWeek",
                table: "TrainingScheduleDays",
                newName: "IX_TrainingScheduleDays_TrainingScheduleId_DayOfWeek");

            migrationBuilder.RenameColumn(
                name: "PlanningId",
                table: "PlanConcepts",
                newName: "TrainingScheduleId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanConcepts_PlanningId_SportConceptId",
                table: "PlanConcepts",
                newName: "IX_PlanConcepts_TrainingScheduleId_SportConceptId");

            migrationBuilder.RenameIndex(
                name: "IX_Plannings_TeamId",
                table: "TrainingSchedules",
                newName: "IX_TrainingSchedules_TeamId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TrainingSchedules",
                table: "TrainingSchedules",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PlanConcepts_TrainingSchedules_TrainingScheduleId",
                table: "PlanConcepts",
                column: "TrainingScheduleId",
                principalTable: "TrainingSchedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingScheduleDays_TrainingSchedules_TrainingScheduleId",
                table: "TrainingScheduleDays",
                column: "TrainingScheduleId",
                principalTable: "TrainingSchedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingSchedules_Teams_TeamId",
                table: "TrainingSchedules",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
