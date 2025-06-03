namespace server.Models.DTO.Survey {
    public class SurveyQuestionDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int QuestionTypeID { get; set; } // e.g., "Text", "YesNo", "Rating"
        public bool IsRequired { get; set; }
        public int OrderInSurvey { get; set; }
        public List<SurveyAnswerDTO>? AnswerOptions { get; set; } // Only for Multiple Choice
    }   
}