namespace server.Models.DTO.Survey{
    public class SurveyDto
    {
        public int SurveyTemplateId { get; set; }
        public string? Title { get; set; } // Optional
        public List<SurveyQuestionDto> Questions { get; set; } = new();
    }
}