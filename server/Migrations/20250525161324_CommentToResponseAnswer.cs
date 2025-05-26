using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class CommentToResponseAnswer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "SurveyResponseAnswers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastActiveTime",
                value: new DateTime(2025, 5, 25, 16, 13, 24, 712, DateTimeKind.Utc).AddTicks(1730));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "SurveyResponseAnswers");

            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastActiveTime",
                value: new DateTime(2025, 5, 9, 14, 4, 34, 346, DateTimeKind.Utc).AddTicks(8790));
        }
    }
}
