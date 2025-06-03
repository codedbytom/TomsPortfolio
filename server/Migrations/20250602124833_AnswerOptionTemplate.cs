using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AnswerOptionTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastActiveTime",
                value: new DateTime(2025, 6, 2, 12, 48, 33, 77, DateTimeKind.Utc).AddTicks(830));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastActiveTime",
                value: new DateTime(2025, 6, 2, 2, 35, 15, 669, DateTimeKind.Utc).AddTicks(4000));
        }
    }
}
