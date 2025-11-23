using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddTrainingPlanning : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ConceptCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConceptCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ConceptPhases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConceptPhases", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Courts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DifficultyLevels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Rank = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DifficultyLevels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrainingSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    TeamId = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingSchedules_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SportConcepts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    ConceptCategoryId = table.Column<int>(type: "integer", nullable: true),
                    ConceptPhaseId = table.Column<int>(type: "integer", nullable: true),
                    DifficultyLevelId = table.Column<int>(type: "integer", nullable: true),
                    ProgressWeight = table.Column<int>(type: "integer", nullable: false),
                    IsProgressive = table.Column<bool>(type: "boolean", nullable: false),
                    SportId = table.Column<int>(type: "integer", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportConcepts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SportConcepts_ConceptCategories_ConceptCategoryId",
                        column: x => x.ConceptCategoryId,
                        principalTable: "ConceptCategories",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SportConcepts_ConceptPhases_ConceptPhaseId",
                        column: x => x.ConceptPhaseId,
                        principalTable: "ConceptPhases",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SportConcepts_DifficultyLevels_DifficultyLevelId",
                        column: x => x.DifficultyLevelId,
                        principalTable: "DifficultyLevels",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SportConcepts_Sports_SportId",
                        column: x => x.SportId,
                        principalTable: "Sports",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TrainingScheduleDays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TrainingScheduleId = table.Column<int>(type: "integer", nullable: false),
                    DayOfWeek = table.Column<int>(type: "integer", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "interval", nullable: true),
                    CourtId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingScheduleDays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingScheduleDays_Courts_CourtId",
                        column: x => x.CourtId,
                        principalTable: "Courts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TrainingScheduleDays_TrainingSchedules_TrainingScheduleId",
                        column: x => x.TrainingScheduleId,
                        principalTable: "TrainingSchedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrainingSessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TrainingScheduleId = table.Column<int>(type: "integer", nullable: true),
                    StartAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Duration = table.Column<TimeSpan>(type: "interval", nullable: false),
                    CourtId = table.Column<int>(type: "integer", nullable: true)
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
                name: "PlanConcepts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TrainingScheduleId = table.Column<int>(type: "integer", nullable: false),
                    SportConceptId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanConcepts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlanConcepts_SportConcepts_SportConceptId",
                        column: x => x.SportConceptId,
                        principalTable: "SportConcepts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PlanConcepts_TrainingSchedules_TrainingScheduleId",
                        column: x => x.TrainingScheduleId,
                        principalTable: "TrainingSchedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SessionConcepts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TrainingSessionId = table.Column<int>(type: "integer", nullable: false),
                    SportConceptId = table.Column<int>(type: "integer", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    PlannedDurationMinutes = table.Column<int>(type: "integer", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    PlanConceptId = table.Column<int>(type: "integer", nullable: true)
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
                name: "IX_PlanConcepts_SportConceptId",
                table: "PlanConcepts",
                column: "SportConceptId");

            migrationBuilder.CreateIndex(
                name: "IX_PlanConcepts_TrainingScheduleId_SportConceptId",
                table: "PlanConcepts",
                columns: new[] { "TrainingScheduleId", "SportConceptId" },
                unique: true);

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
                name: "IX_SportConcepts_ConceptCategoryId",
                table: "SportConcepts",
                column: "ConceptCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_SportConcepts_ConceptPhaseId",
                table: "SportConcepts",
                column: "ConceptPhaseId");

            migrationBuilder.CreateIndex(
                name: "IX_SportConcepts_DifficultyLevelId",
                table: "SportConcepts",
                column: "DifficultyLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_SportConcepts_Name_SportId",
                table: "SportConcepts",
                columns: new[] { "Name", "SportId" });

            migrationBuilder.CreateIndex(
                name: "IX_SportConcepts_SportId",
                table: "SportConcepts",
                column: "SportId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingScheduleDays_CourtId",
                table: "TrainingScheduleDays",
                column: "CourtId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingScheduleDays_TrainingScheduleId_DayOfWeek",
                table: "TrainingScheduleDays",
                columns: new[] { "TrainingScheduleId", "DayOfWeek" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSchedules_TeamId",
                table: "TrainingSchedules",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSessions_CourtId",
                table: "TrainingSessions",
                column: "CourtId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSessions_TrainingScheduleId",
                table: "TrainingSessions",
                column: "TrainingScheduleId");

            // Seed default phases and difficulty levels
            migrationBuilder.InsertData(
                table: "ConceptPhases",
                columns: new[] { "Id", "Name", "Description", "IsActive" },
                values: new object[,]
                {
                    { 1, "Offense", "Offensive concepts", true },
                    { 2, "Defense", "Defensive concepts", true },
                    { 3, "Both", "Applicable to both offense and defense", true }
                });

            migrationBuilder.InsertData(
                table: "DifficultyLevels",
                columns: new[] { "Id", "Name", "Rank", "IsActive" },
                values: new object[,]
                {
                    { 1, "Beginner", 1, true },
                    { 2, "Easy", 2, true },
                    { 3, "Medium", 3, true },
                    { 4, "Hard", 4, true },
                    { 5, "Expert", 5, true }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SessionConcepts");

            migrationBuilder.DropTable(
                name: "TrainingScheduleDays");

            migrationBuilder.DropTable(
                name: "PlanConcepts");

            migrationBuilder.DropTable(
                name: "TrainingSessions");

            migrationBuilder.DropTable(
                name: "SportConcepts");

            migrationBuilder.DropTable(
                name: "Courts");

            migrationBuilder.DropTable(
                name: "TrainingSchedules");

            migrationBuilder.DropTable(
                name: "ConceptCategories");

            migrationBuilder.DropTable(
                name: "ConceptPhases");

            migrationBuilder.DropTable(
                name: "DifficultyLevels");
        }
    }
}
