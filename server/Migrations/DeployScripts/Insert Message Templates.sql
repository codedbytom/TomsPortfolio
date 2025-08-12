SELECT TOP (1000) [Id]
      ,[TypeName]
      ,[Description]
      ,[IsActive]
  FROM [dbo].[MessageTypes]

select * from dbo.MessageTemplates

  Insert into dbo.MessageTemplates (MessageTypeId, TemplateText, Description)
  VALUES
  (2, 'Tom Built It: {Contact Name},  you have subscribed to our SMS demo. Message frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to cancel.', 'Used for the initial opt in message')
  
  Insert into dbo.MessageTemplates (MessageTypeId, TemplateText, Description)
  VALUES
  (4, 'Tom Built It: Thanks for participating! Here is your survey: {url}', 'Sent out for text messages with a survey link')

  INSERT INTO dbo.MessageTemplates (MessageTypeId, TemplateText, Description)
  VALUES
  (5, 'You are receiving messages from TomBuiltIt Demo. Text STOP to unsubscribe.')