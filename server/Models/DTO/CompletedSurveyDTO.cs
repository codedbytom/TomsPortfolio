using server.Models.Surveys;

namespace server.Models.DTO{
    public class CompletedSurveyDTO
    {
        public int SurveyTemplateId { get; set; }
        public string Title { get; set; } // Optional
        public List<SurveyResponseAnswer> SubmittedAnswers { get; set; }
    }
}