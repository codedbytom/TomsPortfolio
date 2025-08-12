INSERT INTO TextDemoLocal.dbo.MessageTypes (TypeName,Description,IsActive) VALUES
	 (N'Alert',N'System alerts and manual notifications',1),
	 (N'OptIn',N'Initial opt-in message for user consent',1),
	 (N'OptOut',N'Message sent to confirm opt-out',1),
	 (N'SurveyLink',N'Message containing the survey link',1),
	 (N'SurveyResults',N'Follow-up message after survey completion',1),
	 (N'Help',N'Help Message for users to know what the service is',1);
