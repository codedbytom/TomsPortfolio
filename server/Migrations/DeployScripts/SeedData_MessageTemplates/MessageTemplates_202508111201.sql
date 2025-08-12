INSERT INTO TextDemoLocal.dbo.MessageTemplates (MessageTypeId,TemplateText,Description) VALUES
	 (2,N'Tom Built It: {Contact Name},  you have subscribed to our SMS demo. Message frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel.',N'Used for the initial opt in message'),
	 (4,N'Tom Built It: Thanks for participating! Here is your survey: {url}',N'Sent out for text messages with a survey link'),
	 (5,N'Tom Built It: {Contact Name}, thank you for your submission. Here is your results: {url}',N'Used to show the results of a survey'),
	 (6,N'Tom Built It: This is part of the Text Demo Survey System. Send STOP to unsubscribe',N'Help message if a user needs more information'),
	 (3,N'Tom Built It: You have successfully unsubscribed from the Text Demo',N'Message to users if they choose to opt-out of the demo');
