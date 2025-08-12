using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class Seed_MessageTemplates_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Contacts",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastActiveTime",
                value: new DateTime(2025, 8, 11, 16, 18, 40, 377, DateTimeKind.Utc).AddTicks(4730));

            migrationBuilder.Sql(@"
            MERGE dbo.MessageTemplates As Target
            Using (VALUES 
                (2,N'Tom Built It: {Contact Name},  you have subscribed to our SMS demo. Message frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel.',N'Used for the initial opt in message'),
                (4,N'Tom Built It: Thanks for participating! Here is your survey: {url}',N'Sent out for text messages with a survey link'),
                (5,N'Tom Built It: {Contact Name}, thank you for your submission. Here is your results: {url}',N'Used to show the results of a survey'),
                (6,N'Tom Built It: This is part of the Text Demo Survey System. Send STOP to unsubscribe',N'Help message if a user needs more information'),
                (3,N'Tom Built It: You have successfully unsubscribed from the Text Demo',N'Message to users if they choose to opt-out of the demo')
            ) As source (MessageTypeId,TemplateText,Description)
            ON target.MessageTypeId = source.MessageTypeId
            WHEN MATCHED AND target.Description <> source.Description THEN
                UPDATE SET
                    target.Description = source.Description
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (MessageTypeId,TemplateText,Description) 
                VALUES
                    (source.MessageTypeId, source.TemplateText, source.Description);
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
                value: new DateTime(2025, 8, 10, 19, 43, 39, 981, DateTimeKind.Utc).AddTicks(3900));
        }
    }
}
