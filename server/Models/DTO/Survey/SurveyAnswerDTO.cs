namespace server.Models.DTO.Survey {
    public class SurveyAnswerDTO
    {
        public int Id { get; set; }
        public int SurveyQuestionTemplateId { get; set; }
        public int? AnswerOptionTemplateId { get; set; }
        public DateTime AnsweredAt { get; set; }
        public string? FreeTextAnswer { get; set; }
        public string Text { get; set; } = string.Empty;
        public string? Value { get; set; }
        public string? Comment { get; set; }
    }   
}