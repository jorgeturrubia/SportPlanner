using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConceptInterpretations");

            migrationBuilder.DropTable(
                name: "SessionConcepts");

            migrationBuilder.DropTable(
                name: "TeamPreferences");

            migrationBuilder.DropTable(
                name: "TrainingSessions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ConceptInterpretations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InterpretedDifficultyLevelId = table.Column<int>(type: "integer", nullable: true),
                    SportConceptId = table.Column<int>(type: "integer", nullable: false),
                    TeamCategoryId = table.Column<int>(type: "integer", nullable: true),
                    TeamId = table.Column<int>(type: "integer", nullable: true),
                    TeamLevelId = table.Column<int>(type: "integer", nullable: true),
                    DurationMultiplier = table.Column<decimal>(type: "numeric", nullable: false),
                    IsSuggested = table.Column<bool>(type: "boolean", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    PriorityMultiplier = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConceptInterpretations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConceptInterpretations_DifficultyLevels_InterpretedDifficul~",
                        column: x => x.InterpretedDifficultyLevelId,
                        principalTable: "DifficultyLevels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ConceptInterpretations_SportConcepts_SportConceptId",
                        column: x => x.SportConceptId,
                        principalTable: "SportConcepts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConceptInterpretations_TeamCategories_TeamCategoryId",
                        column: x => x.TeamCategoryId,
                        principalTable: "TeamCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConceptInterpretations_TeamLevels_TeamLevelId",
                        column: x => x.TeamLevelId,
                        principalTable: "TeamLevels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConceptInterpretations_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TeamPreferences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TeamId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PreferencesJson = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamPreferences_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrainingSessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CourtId = table.Column<int>(type: "integer", nullable: true),
                    TrainingScheduleId = table.Column<int>(type: "integer", nullable: true),
                    Duration = table.Column<TimeSpan>(type: "interval", nullable: false),
                    StartAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingSessions_Courts_CourtId",
                        column: x => x.CourtId,
                        principalTable: "Courts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TrainingSessions_TrainingSchedules_TrainingScheduleId",
                        column: x => x.TrainingScheduleId,
                        principalTable: "TrainingSchedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "SessionConcepts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PlanConceptId = table.Column<int>(type: "integer", nullable: true),
                    SportConceptId = table.Column<int>(type: "integer", nullable: false),
                    TrainingSessionId = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    PlannedDurationMinutes = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionConcepts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SessionConcepts_PlanConcepts_PlanConceptId",
                        column: x => x.PlanConceptId,
                        principalTable: "PlanConcepts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_SessionConcepts_SportConcepts_SportConceptId",
                        column: x => x.SportConceptId,
                        principalTable: "SportConcepts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionConcepts_TrainingSessions_TrainingSessionId",
                        column: x => x.TrainingSessionId,
                        principalTable: "TrainingSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConceptInterpretations_InterpretedDifficultyLevelId",
                table: "ConceptInterpretations",
                column: "InterpretedDifficultyLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptInterpretations_SportConceptId",
                table: "ConceptInterpretations",
                column: "SportConceptId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptInterpretations_TeamCategoryId",
                table: "ConceptInterpretations",
                column: "TeamCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptInterpretations_TeamId",
                table: "ConceptInterpretations",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptInterpretations_TeamLevelId",
                table: "ConceptInterpretations",
                column: "TeamLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionConcepts_PlanConceptId",
                table: "SessionConcepts",
                column: "PlanConceptId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionConcepts_SportConceptId",
                table: "SessionConcepts",
                column: "SportConceptId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionConcepts_TrainingSessionId_Order",
                table: "SessionConcepts",
                columns: new[] { "TrainingSessionId", "Order" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamPreferences_TeamId",
                table: "TeamPreferences",
                column: "TeamId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSessions_CourtId",
                table: "TrainingSessions",
                column: "CourtId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSessions_TrainingScheduleId",
                table: "TrainingSessions",
                column: "TrainingScheduleId");
        }
    }
}
