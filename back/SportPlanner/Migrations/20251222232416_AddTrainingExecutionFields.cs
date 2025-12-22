using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddTrainingExecutionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FeedbackNotes",
                table: "TrainingSessions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FeedbackRating",
                table: "TrainingSessions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FinishedAt",
                table: "TrainingSessions",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartedAt",
                table: "TrainingSessions",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "TrainingSessions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ActualDurationMinutes",
                table: "TrainingSessionExercises",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FeedbackNotes",
                table: "TrainingSessionExercises",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "TrainingSessionExercises",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FeedbackNotes",
                table: "TrainingSessions");

            migrationBuilder.DropColumn(
                name: "FeedbackRating",
                table: "TrainingSessions");

            migrationBuilder.DropColumn(
                name: "FinishedAt",
                table: "TrainingSessions");

            migrationBuilder.DropColumn(
                name: "StartedAt",
                table: "TrainingSessions");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "TrainingSessions");

            migrationBuilder.DropColumn(
                name: "ActualDurationMinutes",
                table: "TrainingSessionExercises");

            migrationBuilder.DropColumn(
                name: "FeedbackNotes",
                table: "TrainingSessionExercises");

            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "TrainingSessionExercises");
        }
    }
}
