using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    public partial class AddDemoTeamData_Manual : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Insert a demo user
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "SupabaseId", "Email", "Name", "CreatedAt" },
                values: new object[] { "43ccbcfc-5fc1-47b4-a9ce-bd8ed0356c75", "demo@example.com", "Demo User", DateTime.UtcNow }
            );

            // Demo sport
            migrationBuilder.InsertData(
                table: "Sports",
                columns: new[] { "Id", "Name", "Slug", "Description", "IsActive", "CreatedAt", "UpdatedAt" },
                values: new object[] { 101, "DemoSport", "demo-sport", "Demo sport used by local seed data", true, DateTime.UtcNow, DateTime.UtcNow }
            );

            // Subscription plan
            migrationBuilder.InsertData(
                table: "SubscriptionPlans",
                columns: new[] { "Id", "Name", "Level", "Price", "MaxTeams", "MaxMembersPerTeam", "Features", "IsActive", "CreatedAt", "UpdatedAt" },
                values: new object[] { 101, "Demo Plan", 0, 0m, 10, 25, "Demo plan for seeded data", true, DateTime.UtcNow, DateTime.UtcNow }
            );

            // Active subscription for demo user & sport
            migrationBuilder.InsertData(
                table: "Subscriptions",
                columns: new[] { "Id", "UserSupabaseId", "OrganizationId", "PlanId", "SportId", "StartDate", "EndDate", "IsActive", "Status", "AutoRenew", "CreatedAt", "UpdatedAt" },
                values: new object[] { 101, "43ccbcfc-5fc1-47b4-a9ce-bd8ed0356c75", null, 101, 101, DateTime.UtcNow, null, true, 1, false, DateTime.UtcNow, DateTime.UtcNow }
            );

            // Team category and level
            migrationBuilder.InsertData(
                table: "TeamCategories",
                columns: new[] { "Id", "Name", "MinAge", "MaxAge", "Description", "IsActive" },
                values: new object[] { 101, "U12", 10, 12, "Under 12 demo category", true }
            );

            migrationBuilder.InsertData(
                table: "TeamLevels",
                columns: new[] { "Id", "Name", "Rank", "Description", "IsActive" },
                values: new object[] { 101, "A", 3, "Top demo level A", true }
            );

            // Create a demo team
            migrationBuilder.InsertData(
                table: "Teams",
                columns: new[] { "Id", "Name", "OwnerUserSupabaseId", "OrganizationId", "SubscriptionId", "SportId", "TeamCategoryId", "TeamLevelId", "IsActive", "CreatedAt", "UpdatedAt" },
                values: new object[] { 101, "Demo Team", "43ccbcfc-5fc1-47b4-a9ce-bd8ed0356c75", null, 101, 101, 101, 101, true, DateTime.UtcNow, DateTime.UtcNow }
            );

            // Concept categories and concepts for demo sport
            migrationBuilder.InsertData(
                table: "ConceptCategories",
                columns: new[] { "Id", "Name", "Description", "IsActive" },
                values: new object[] { 101, "Technical", "Technical skills like passing and dribbling", true }
            );

            migrationBuilder.InsertData(
                table: "SportConcepts",
                columns: new[] { "Id", "Name", "Description", "ConceptCategoryId", "ConceptPhaseId", "DifficultyLevelId", "ProgressWeight", "IsProgressive", "SportId", "IsActive" },
                values: new object[,]
                {
                    { 101, "Passing", "Short and long passing accuracy", 101, 1, 2, 60, true, 101, true },
                    { 102, "Shooting", "Shooting at goal", 101, 1, 3, 70, true, 101, true },
                    { 103, "Ball Control", "First touch and ball control", 101, 3, 2, 50, true, 101, true }
                }
            );

            // Concept interpretations: map concepts to the demo team and category
            migrationBuilder.InsertData(
                table: "ConceptInterpretations",
                columns: new[] { "Id", "SportConceptId", "TeamId", "TeamCategoryId", "TeamLevelId", "InterpretedDifficultyLevelId", "DurationMultiplier", "PriorityMultiplier", "IsSuggested", "Notes" },
                values: new object[,]
                {
                    { 101, 101, null, 101, null, 2, 1.0m, 1.2m, true, "U12 should focus slightly more on passing (priority x1.2)." },
                    { 102, 102, null, 101, null, 3, 1.0m, 1.1m, true, "U12 should train shooting; lower priority than passing for this age." },
                    { 103, 103, null, null, 101, 2, 1.0m, 1.3m, true, "Level A teams should prioritize ball control." }
                }
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(table: "ConceptInterpretations", keyColumn: "Id", keyValues: new object[] { 101, 102, 103 });
            migrationBuilder.DeleteData(table: "SportConcepts", keyColumn: "Id", keyValues: new object[] { 101, 102, 103 });
            migrationBuilder.DeleteData(table: "ConceptCategories", keyColumn: "Id", keyValue: 101);

            migrationBuilder.DeleteData(table: "Teams", keyColumn: "Id", keyValue: 101);
            migrationBuilder.DeleteData(table: "TeamLevels", keyColumn: "Id", keyValue: 101);
            migrationBuilder.DeleteData(table: "TeamCategories", keyColumn: "Id", keyValue: 101);

            migrationBuilder.DeleteData(table: "Subscriptions", keyColumn: "Id", keyValue: 101);
            migrationBuilder.DeleteData(table: "SubscriptionPlans", keyColumn: "Id", keyValue: 101);
            migrationBuilder.DeleteData(table: "Sports", keyColumn: "Id", keyValue: 101);

            migrationBuilder.DeleteData(table: "Users", keyColumn: "SupabaseId", keyValue: "43ccbcfc-5fc1-47b4-a9ce-bd8ed0356c75");
        }
    }
}
