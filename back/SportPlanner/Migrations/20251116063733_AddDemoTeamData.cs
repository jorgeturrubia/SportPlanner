using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class AddDemoTeamData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Insert a demo user (idempotent)
            migrationBuilder.Sql(@$"
                INSERT INTO "Users" ("SupabaseId", "Email", "Name", "CreatedAt")
                VALUES ('43ccbcfc-5fc1-47b4-a9ce-bd8ed0356c75', 'demo@example.com', 'Demo User', '{DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ")}')
                ON CONFLICT ("SupabaseId") DO NOTHING;
            ");

            // Demo sport
            migrationBuilder.Sql(@$"
                INSERT INTO "Sports" ("Id", "Name", "Slug", "Description", "IsActive", "CreatedAt", "UpdatedAt")
                VALUES (101, 'DemoSport', 'demo-sport', 'Demo sport used by local seed data', TRUE, '{DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ")}', '{DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ")}')
                ON CONFLICT ("Id") DO NOTHING;
            ");

            // Subscription plan
            migrationBuilder.Sql(@$"
                INSERT INTO "SubscriptionPlans" ("Id","Name","Level","Price","MaxTeams","MaxMembersPerTeam","Features","IsActive","CreatedAt","UpdatedAt")
                VALUES (101,'Demo Plan',0,0,10,25,'Demo plan for seeded data',TRUE,'{DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ")}','{DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ")}')
                ON CONFLICT ("Id") DO NOTHING;
            ");

            // Active subscription for demo user & sport
            migrationBuilder.Sql(@$"
                INSERT INTO "Subscriptions" ("Id","UserSupabaseId","OrganizationId","PlanId","SportId","StartDate","EndDate","IsActive","Status","AutoRenew","CreatedAt","UpdatedAt")
                VALUES (101,'43ccbcfc-5fc1-47b4-a9ce-bd8ed0356c75',NULL,101,101,'{DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ")}',NULL,TRUE,1,FALSE,'{DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ")}','{DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ")}')
                ON CONFLICT ("Id") DO NOTHING;
            ");

            // Team category and level
            migrationBuilder.Sql(@$"
                INSERT INTO "TeamCategories" ("Id","Name","MinAge","MaxAge","Description","IsActive")
                VALUES (101,'U12',10,12,'Under 12 demo category',TRUE)
                ON CONFLICT ("Id") DO NOTHING;
            ");

            migrationBuilder.Sql(@$"
                INSERT INTO "TeamLevels" ("Id","Name","Rank","Description","IsActive")
                VALUES (101,'A',3,'Top demo level A',TRUE)
                ON CONFLICT ("Id") DO NOTHING;
            ");

            // Create a demo team
            migrationBuilder.Sql(@$"
                INSERT INTO "Teams" ("Id","Name","OwnerUserSupabaseId","OrganizationId","SubscriptionId","SportId","TeamCategoryId","TeamLevelId","IsActive","CreatedAt","UpdatedAt")
                VALUES (101,'Demo Team','43ccbcfc-5fc1-47b4-a9ce-bd8ed0356c75',NULL,101,101,101,101,TRUE,'{DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ")}','{DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ")}')
                ON CONFLICT ("Id") DO NOTHING;
            ");

            // Concept categories and concepts for demo sport
            migrationBuilder.Sql(@$"
                INSERT INTO "ConceptCategories" ("Id","Name","Description","IsActive")
                VALUES (101,'Technical','Technical skills like passing and dribbling',TRUE)
                ON CONFLICT ("Id") DO NOTHING;
            ");

            migrationBuilder.Sql(@$"
                INSERT INTO "SportConcepts" ("Id","Name","Description","ConceptCategoryId","ConceptPhaseId","DifficultyLevelId","ProgressWeight","IsProgressive","SportId","IsActive") VALUES
                (101,'Passing','Short and long passing accuracy',101,1,2,60,TRUE,101,TRUE),
                (102,'Shooting','Shooting at goal',101,1,3,70,TRUE,101,TRUE),
                (103,'Ball Control','First touch and ball control',101,3,2,50,TRUE,101,TRUE)
                ON CONFLICT ("Id") DO NOTHING;
            ");

            // Concept interpretations: map concepts to the demo team and category
            migrationBuilder.Sql(@$"
                INSERT INTO "ConceptInterpretations" ("Id","SportConceptId","TeamId","TeamCategoryId","TeamLevelId","InterpretedDifficultyLevelId","DurationMultiplier","PriorityMultiplier","IsSuggested","Notes") VALUES
                (101,101,NULL,101,NULL,2,1.0,1.2,TRUE,'U12 should focus slightly more on passing (priority x1.2).'),
                (102,102,NULL,101,NULL,3,1.0,1.1,TRUE,'U12 should train shooting; lower priority than passing for this age.'),
                (103,103,NULL,NULL,101,2,1.0,1.3,TRUE,'Level A teams should prioritize ball control.')
                ON CONFLICT ("Id") DO NOTHING;
            ");
        }

        /// <inheritdoc />
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
