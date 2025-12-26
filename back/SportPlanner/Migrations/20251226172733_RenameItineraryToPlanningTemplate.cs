using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportPlanner.Migrations
{
    /// <inheritdoc />
    public partial class RenameItineraryToPlanningTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItineraryConcept_MethodologicalItineraries_ItineraryId",
                table: "ItineraryConcept");

            migrationBuilder.DropForeignKey(
                name: "FK_ItineraryConcept_SportConcepts_SportConceptId",
                table: "ItineraryConcept");

            migrationBuilder.DropForeignKey(
                name: "FK_ItineraryRatings_MethodologicalItineraries_ItineraryId",
                table: "ItineraryRatings");

            migrationBuilder.DropForeignKey(
                name: "FK_MethodologicalItineraries_MethodologicalItineraries_ParentI~",
                table: "MethodologicalItineraries");

            migrationBuilder.DropForeignKey(
                name: "FK_MethodologicalItineraries_MethodologicalItineraries_SystemS~",
                table: "MethodologicalItineraries");

            migrationBuilder.DropForeignKey(
                name: "FK_MethodologicalItineraries_TeamCategories_TeamCategoryId",
                table: "MethodologicalItineraries");

            migrationBuilder.DropForeignKey(
                name: "FK_SportConcepts_MethodologicalItineraries_MethodologicalItine~",
                table: "SportConcepts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MethodologicalItineraries",
                table: "MethodologicalItineraries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ItineraryRatings",
                table: "ItineraryRatings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ItineraryConcept",
                table: "ItineraryConcept");

            migrationBuilder.RenameTable(
                name: "MethodologicalItineraries",
                newName: "PlanningTemplates");

            migrationBuilder.RenameTable(
                name: "ItineraryRatings",
                newName: "PlanningTemplateRatings");

            migrationBuilder.RenameTable(
                name: "ItineraryConcept",
                newName: "PlanningTemplateConcept");

            migrationBuilder.RenameColumn(
                name: "MethodologicalItineraryId",
                table: "SportConcepts",
                newName: "PlanningTemplateId");

            migrationBuilder.RenameIndex(
                name: "IX_SportConcepts_MethodologicalItineraryId",
                table: "SportConcepts",
                newName: "IX_SportConcepts_PlanningTemplateId");

            migrationBuilder.RenameColumn(
                name: "ParentItineraryId",
                table: "PlanningTemplates",
                newName: "ParentTemplateId");

            migrationBuilder.RenameIndex(
                name: "IX_MethodologicalItineraries_TeamCategoryId",
                table: "PlanningTemplates",
                newName: "IX_PlanningTemplates_TeamCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_MethodologicalItineraries_SystemSourceId",
                table: "PlanningTemplates",
                newName: "IX_PlanningTemplates_SystemSourceId");

            migrationBuilder.RenameIndex(
                name: "IX_MethodologicalItineraries_ParentItineraryId",
                table: "PlanningTemplates",
                newName: "IX_PlanningTemplates_ParentTemplateId");

            migrationBuilder.RenameIndex(
                name: "IX_MethodologicalItineraries_Code",
                table: "PlanningTemplates",
                newName: "IX_PlanningTemplates_Code");

            migrationBuilder.RenameColumn(
                name: "ItineraryId",
                table: "PlanningTemplateRatings",
                newName: "PlanningTemplateId");

            migrationBuilder.RenameIndex(
                name: "IX_ItineraryRatings_ItineraryId_UserId",
                table: "PlanningTemplateRatings",
                newName: "IX_PlanningTemplateRatings_PlanningTemplateId_UserId");

            migrationBuilder.RenameColumn(
                name: "ItineraryId",
                table: "PlanningTemplateConcept",
                newName: "PlanningTemplateId");

            migrationBuilder.RenameIndex(
                name: "IX_ItineraryConcept_SportConceptId",
                table: "PlanningTemplateConcept",
                newName: "IX_PlanningTemplateConcept_SportConceptId");

            migrationBuilder.RenameIndex(
                name: "IX_ItineraryConcept_ItineraryId",
                table: "PlanningTemplateConcept",
                newName: "IX_PlanningTemplateConcept_PlanningTemplateId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlanningTemplates",
                table: "PlanningTemplates",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlanningTemplateRatings",
                table: "PlanningTemplateRatings",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlanningTemplateConcept",
                table: "PlanningTemplateConcept",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningTemplateConcept_PlanningTemplates_PlanningTemplateId",
                table: "PlanningTemplateConcept",
                column: "PlanningTemplateId",
                principalTable: "PlanningTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningTemplateConcept_SportConcepts_SportConceptId",
                table: "PlanningTemplateConcept",
                column: "SportConceptId",
                principalTable: "SportConcepts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningTemplateRatings_PlanningTemplates_PlanningTemplateId",
                table: "PlanningTemplateRatings",
                column: "PlanningTemplateId",
                principalTable: "PlanningTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningTemplates_PlanningTemplates_ParentTemplateId",
                table: "PlanningTemplates",
                column: "ParentTemplateId",
                principalTable: "PlanningTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningTemplates_PlanningTemplates_SystemSourceId",
                table: "PlanningTemplates",
                column: "SystemSourceId",
                principalTable: "PlanningTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningTemplates_TeamCategories_TeamCategoryId",
                table: "PlanningTemplates",
                column: "TeamCategoryId",
                principalTable: "TeamCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SportConcepts_PlanningTemplates_PlanningTemplateId",
                table: "SportConcepts",
                column: "PlanningTemplateId",
                principalTable: "PlanningTemplates",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlanningTemplateConcept_PlanningTemplates_PlanningTemplateId",
                table: "PlanningTemplateConcept");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanningTemplateConcept_SportConcepts_SportConceptId",
                table: "PlanningTemplateConcept");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanningTemplateRatings_PlanningTemplates_PlanningTemplateId",
                table: "PlanningTemplateRatings");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanningTemplates_PlanningTemplates_ParentTemplateId",
                table: "PlanningTemplates");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanningTemplates_PlanningTemplates_SystemSourceId",
                table: "PlanningTemplates");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanningTemplates_TeamCategories_TeamCategoryId",
                table: "PlanningTemplates");

            migrationBuilder.DropForeignKey(
                name: "FK_SportConcepts_PlanningTemplates_PlanningTemplateId",
                table: "SportConcepts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlanningTemplates",
                table: "PlanningTemplates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlanningTemplateRatings",
                table: "PlanningTemplateRatings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlanningTemplateConcept",
                table: "PlanningTemplateConcept");

            migrationBuilder.RenameTable(
                name: "PlanningTemplates",
                newName: "MethodologicalItineraries");

            migrationBuilder.RenameTable(
                name: "PlanningTemplateRatings",
                newName: "ItineraryRatings");

            migrationBuilder.RenameTable(
                name: "PlanningTemplateConcept",
                newName: "ItineraryConcept");

            migrationBuilder.RenameColumn(
                name: "PlanningTemplateId",
                table: "SportConcepts",
                newName: "MethodologicalItineraryId");

            migrationBuilder.RenameIndex(
                name: "IX_SportConcepts_PlanningTemplateId",
                table: "SportConcepts",
                newName: "IX_SportConcepts_MethodologicalItineraryId");

            migrationBuilder.RenameColumn(
                name: "ParentTemplateId",
                table: "MethodologicalItineraries",
                newName: "ParentItineraryId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanningTemplates_TeamCategoryId",
                table: "MethodologicalItineraries",
                newName: "IX_MethodologicalItineraries_TeamCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanningTemplates_SystemSourceId",
                table: "MethodologicalItineraries",
                newName: "IX_MethodologicalItineraries_SystemSourceId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanningTemplates_ParentTemplateId",
                table: "MethodologicalItineraries",
                newName: "IX_MethodologicalItineraries_ParentItineraryId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanningTemplates_Code",
                table: "MethodologicalItineraries",
                newName: "IX_MethodologicalItineraries_Code");

            migrationBuilder.RenameColumn(
                name: "PlanningTemplateId",
                table: "ItineraryRatings",
                newName: "ItineraryId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanningTemplateRatings_PlanningTemplateId_UserId",
                table: "ItineraryRatings",
                newName: "IX_ItineraryRatings_ItineraryId_UserId");

            migrationBuilder.RenameColumn(
                name: "PlanningTemplateId",
                table: "ItineraryConcept",
                newName: "ItineraryId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanningTemplateConcept_SportConceptId",
                table: "ItineraryConcept",
                newName: "IX_ItineraryConcept_SportConceptId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanningTemplateConcept_PlanningTemplateId",
                table: "ItineraryConcept",
                newName: "IX_ItineraryConcept_ItineraryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MethodologicalItineraries",
                table: "MethodologicalItineraries",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ItineraryRatings",
                table: "ItineraryRatings",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ItineraryConcept",
                table: "ItineraryConcept",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ItineraryConcept_MethodologicalItineraries_ItineraryId",
                table: "ItineraryConcept",
                column: "ItineraryId",
                principalTable: "MethodologicalItineraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ItineraryConcept_SportConcepts_SportConceptId",
                table: "ItineraryConcept",
                column: "SportConceptId",
                principalTable: "SportConcepts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ItineraryRatings_MethodologicalItineraries_ItineraryId",
                table: "ItineraryRatings",
                column: "ItineraryId",
                principalTable: "MethodologicalItineraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MethodologicalItineraries_MethodologicalItineraries_ParentI~",
                table: "MethodologicalItineraries",
                column: "ParentItineraryId",
                principalTable: "MethodologicalItineraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MethodologicalItineraries_MethodologicalItineraries_SystemS~",
                table: "MethodologicalItineraries",
                column: "SystemSourceId",
                principalTable: "MethodologicalItineraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_MethodologicalItineraries_TeamCategories_TeamCategoryId",
                table: "MethodologicalItineraries",
                column: "TeamCategoryId",
                principalTable: "TeamCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SportConcepts_MethodologicalItineraries_MethodologicalItine~",
                table: "SportConcepts",
                column: "MethodologicalItineraryId",
                principalTable: "MethodologicalItineraries",
                principalColumn: "Id");
        }
    }
}
