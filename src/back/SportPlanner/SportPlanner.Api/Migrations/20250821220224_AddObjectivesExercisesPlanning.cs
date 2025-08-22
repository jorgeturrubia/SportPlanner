using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SportPlanner.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddObjectivesExercisesPlanning : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Objectives",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    Difficulty = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    EstimatedDuration = table.Column<int>(type: "integer", nullable: false),
                    TargetAgeGroup = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Sport = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Tags = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    Prerequisites = table.Column<string>(type: "text", nullable: true),
                    EquipmentNeeded = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    MaxParticipants = table.Column<int>(type: "integer", nullable: false),
                    MinParticipants = table.Column<int>(type: "integer", nullable: false),
                    IsPublic = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Rating = table.Column<decimal>(type: "numeric", nullable: false),
                    UsageCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Objectives", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlanningTemplates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Sport = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    SessionsPerWeek = table.Column<int>(type: "integer", nullable: false),
                    TargetLevel = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Objectives = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    SessionTemplates = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    IsPublic = table.Column<bool>(type: "boolean", nullable: false),
                    Rating = table.Column<decimal>(type: "numeric", nullable: false),
                    UsageCount = table.Column<int>(type: "integer", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanningTemplates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DefaultMaxPlayers = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sports", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Exercises",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    Difficulty = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    MinParticipants = table.Column<int>(type: "integer", nullable: false),
                    MaxParticipants = table.Column<int>(type: "integer", nullable: false),
                    TargetAgeGroup = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    Sport = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Objectives = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    Instructions = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    SafetyNotes = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    Equipment = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    Variations = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    Tags = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    SpaceRequired = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsPublic = table.Column<bool>(type: "boolean", nullable: false),
                    IsVerified = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UsageCount = table.Column<int>(type: "integer", nullable: false),
                    Rating = table.Column<decimal>(type: "numeric", nullable: false),
                    ObjectiveId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exercises", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Exercises_Objectives_ObjectiveId",
                        column: x => x.ObjectiveId,
                        principalTable: "Objectives",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Teams",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SportId = table.Column<Guid>(type: "uuid", nullable: false),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Gender = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Level = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    MaxPlayers = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Teams_Sports_SportId",
                        column: x => x.SportId,
                        principalTable: "Sports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ExerciseMedia",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ExerciseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Caption = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExerciseMedia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExerciseMedia_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExerciseReviews",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ExerciseId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    Comment = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExerciseReviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExerciseReviews_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Plannings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    TeamId = table.Column<Guid>(type: "uuid", nullable: false),
                    Sport = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TotalSessions = table.Column<int>(type: "integer", nullable: false),
                    CompletedSessions = table.Column<int>(type: "integer", nullable: false),
                    Objectives = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    Tags = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    IsTemplate = table.Column<bool>(type: "boolean", nullable: false),
                    TemplateName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ProgressPercentage = table.Column<decimal>(type: "numeric", nullable: false),
                    CompletedObjectives = table.Column<int>(type: "integer", nullable: false),
                    TotalObjectives = table.Column<int>(type: "integer", nullable: false),
                    AverageAttendance = table.Column<decimal>(type: "numeric", nullable: false),
                    LastSessionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plannings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Plannings_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TeamMembers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TeamId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UserEmail = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    JerseyNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Position = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Notes = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamMembers_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrainingSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PlanningId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StartTime = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    Location = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Objectives = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    Exercises = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Attendance = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    CompletionNotes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Weather = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingSessions_Plannings_PlanningId",
                        column: x => x.PlanningId,
                        principalTable: "Plannings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Sports",
                columns: new[] { "Id", "Category", "CreatedAt", "DefaultMaxPlayers", "Description", "IsActive", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Deportes de Equipo", new DateTime(2025, 8, 21, 22, 2, 23, 544, DateTimeKind.Utc).AddTicks(5838), 25, "Deporte de equipo jugado entre dos conjuntos de once jugadores", true, "Fútbol", new DateTime(2025, 8, 21, 22, 2, 23, 544, DateTimeKind.Utc).AddTicks(5839) },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Deportes de Equipo", new DateTime(2025, 8, 21, 22, 2, 23, 544, DateTimeKind.Utc).AddTicks(5845), 15, "Deporte de equipo jugado entre dos conjuntos de cinco jugadores", true, "Baloncesto", new DateTime(2025, 8, 21, 22, 2, 23, 544, DateTimeKind.Utc).AddTicks(5845) },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "Deportes de Equipo", new DateTime(2025, 8, 21, 22, 2, 23, 544, DateTimeKind.Utc).AddTicks(5852), 12, "Deporte de equipo jugado entre dos conjuntos de seis jugadores", true, "Voleibol", new DateTime(2025, 8, 21, 22, 2, 23, 544, DateTimeKind.Utc).AddTicks(5852) },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "Deportes Individuales", new DateTime(2025, 8, 21, 22, 2, 23, 544, DateTimeKind.Utc).AddTicks(5875), 4, "Deporte individual o de parejas", true, "Tenis", new DateTime(2025, 8, 21, 22, 2, 23, 544, DateTimeKind.Utc).AddTicks(5876) },
                    { new Guid("55555555-5555-5555-5555-555555555555"), "Deportes Individuales", new DateTime(2025, 8, 21, 22, 2, 23, 544, DateTimeKind.Utc).AddTicks(5883), 30, "Conjunto de disciplinas deportivas que comprenden carreras, saltos y lanzamientos", true, "Atletismo", new DateTime(2025, 8, 21, 22, 2, 23, 544, DateTimeKind.Utc).AddTicks(5884) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExerciseMedia_ExerciseId",
                table: "ExerciseMedia",
                column: "ExerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_ExerciseReviews_ExerciseId_UserId",
                table: "ExerciseReviews",
                columns: new[] { "ExerciseId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_Category",
                table: "Exercises",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_IsPublic",
                table: "Exercises",
                column: "IsPublic");

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_IsVerified",
                table: "Exercises",
                column: "IsVerified");

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_ObjectiveId",
                table: "Exercises",
                column: "ObjectiveId");

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_Sport",
                table: "Exercises",
                column: "Sport");

            migrationBuilder.CreateIndex(
                name: "IX_Objectives_Category",
                table: "Objectives",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_Objectives_IsPublic",
                table: "Objectives",
                column: "IsPublic");

            migrationBuilder.CreateIndex(
                name: "IX_Objectives_Sport",
                table: "Objectives",
                column: "Sport");

            migrationBuilder.CreateIndex(
                name: "IX_Plannings_IsTemplate",
                table: "Plannings",
                column: "IsTemplate");

            migrationBuilder.CreateIndex(
                name: "IX_Plannings_Status",
                table: "Plannings",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Plannings_TeamId",
                table: "Plannings",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_PlanningTemplates_IsPublic",
                table: "PlanningTemplates",
                column: "IsPublic");

            migrationBuilder.CreateIndex(
                name: "IX_PlanningTemplates_Sport",
                table: "PlanningTemplates",
                column: "Sport");

            migrationBuilder.CreateIndex(
                name: "IX_PlanningTemplates_Type",
                table: "PlanningTemplates",
                column: "Type");

            migrationBuilder.CreateIndex(
                name: "IX_Sports_Name",
                table: "Sports",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_TeamId_JerseyNumber",
                table: "TeamMembers",
                columns: new[] { "TeamId", "JerseyNumber" },
                unique: true,
                filter: "\"JerseyNumber\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_TeamId_UserId",
                table: "TeamMembers",
                columns: new[] { "TeamId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Teams_Name_CreatedByUserId",
                table: "Teams",
                columns: new[] { "Name", "CreatedByUserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Teams_SportId",
                table: "Teams",
                column: "SportId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSessions_Date",
                table: "TrainingSessions",
                column: "Date");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSessions_IsCompleted",
                table: "TrainingSessions",
                column: "IsCompleted");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSessions_PlanningId",
                table: "TrainingSessions",
                column: "PlanningId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExerciseMedia");

            migrationBuilder.DropTable(
                name: "ExerciseReviews");

            migrationBuilder.DropTable(
                name: "PlanningTemplates");

            migrationBuilder.DropTable(
                name: "TeamMembers");

            migrationBuilder.DropTable(
                name: "TrainingSessions");

            migrationBuilder.DropTable(
                name: "Exercises");

            migrationBuilder.DropTable(
                name: "Plannings");

            migrationBuilder.DropTable(
                name: "Objectives");

            migrationBuilder.DropTable(
                name: "Teams");

            migrationBuilder.DropTable(
                name: "Sports");
        }
    }
}
