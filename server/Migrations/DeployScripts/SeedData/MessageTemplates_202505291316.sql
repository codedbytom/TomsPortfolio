INSERT INTO dbo.MessageTemplates (MessageTypeId,TemplateText,Description) VALUES
	 (2,N'Tom Built It: {Contact Name},  you have subscribed to our SMS demo. Message frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel.',N'Used for the initial opt in message'),
	 (4,N'Tom Built It: Thanks for participating! Here is your survey: {url}',N'Sent out for text messages with a survey link');
