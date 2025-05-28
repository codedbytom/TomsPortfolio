using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class SurveyResponseMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDateTime",
                table: "SurveyResponses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "SurveyResponseId",
                table: "Messages",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastActiveTime",
                value: new DateTime(2025, 5, 28, 17, 43, 28, 105, DateTimeKind.Utc).AddTicks(9820));

            migrationBuilder.CreateIndex(
                name: "IX_Messages_SurveyResponseId",
                table: "Messages",
                column: "SurveyResponseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_SurveyResponses_SurveyResponseId",
                table: "Messages",
                column: "SurveyResponseId",
                principalTable: "SurveyResponses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_SurveyResponses_SurveyResponseId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_SurveyResponseId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "CreatedDateTime",
                table: "SurveyResponses");

            migrationBuilder.DropColumn(
                name: "SurveyResponseId",
                table: "Messages");

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastActiveTime",
                value: new DateTime(2025, 5, 25, 16, 13, 24, 712, DateTimeKind.Utc).AddTicks(1730));
        }
    }
}
