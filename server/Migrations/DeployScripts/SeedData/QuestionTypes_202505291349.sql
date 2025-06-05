INSERT INTO TextDemoLocal.dbo.QuestionTypes (Name,Description,InputControl,AllowOptions,IsFreeText,SortOrder) VALUES
	 (N'Rating',N'Scale of 1 to 10',N'Slider',N'0',0,1),
	 (N'Yes/No',N'Simple binary answer',N'RadioButton',N'0',0,2),
	 (N'MultipleChoice',N'Choose from list of options',N'CheckboxList',N'1',0,3),
	 (N'Text',N'Open-ended user input',N'TextBox',N'0',1,4);
