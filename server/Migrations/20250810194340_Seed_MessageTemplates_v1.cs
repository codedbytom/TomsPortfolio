using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class Seed_MessageTemplates_v1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastActiveTime",
                value: new DateTime(2025, 8, 10, 19, 43, 39, 981, DateTimeKind.Utc).AddTicks(3900));

            migrationBuilder.Sql(@"
            MERGE dbo.MessageTypes As Target
            Using (VALUES
                    (N'Alert',N'System alerts and manual notifications',1),
                    (N'OptIn',N'Initial opt-in message for user consent',1),
                    (N'OptOut',N'Message sent to confirm opt-out',1),
                    (N'SurveyLink',N'Message containing the survey link',1),
                    (N'SurveyResults',N'Follow-up message after survey completion',1),
                    (N'Help',N'Help Message for users to know what the service is',1)
                ) AS source (TypeName,Description,IsActive)
                ON target.TypeName = source.TypeName
                WHEN MATCHED AND target.Description <> source.Description THEN
                    UPDATE SET
                        target.Description = source.Description
                WHEN NOT MATCHED BY TARGET THEN

                INSERT (TypeName,Description,IsActive) 
                VALUES
                    (source.TypeName, source.Description, source.IsActive);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastActiveTime",
                value: new DateTime(2025, 6, 2, 13, 59, 7, 995, DateTimeKind.Utc).AddTicks(5470));
        }
    }
}
