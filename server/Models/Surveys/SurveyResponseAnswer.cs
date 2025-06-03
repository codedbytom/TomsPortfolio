using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Surveys
{
    public class SurveyResponseAnswer
    {
        public int Id { get; set; }

        [ForeignKey("SurveyResponse")]
        public int SurveyResponseId { get; set; }
        public SurveyResponse? SurveyResponse { get; set; }

        [ForeignKey("SurveyQuestionTemplate")]
        public int SurveyQuestionTemplateId { get; set; }
        public SurveyQuestionTemplate? SurveyQuestionTemplate { get; set; }
        
        [ForeignKey("AnswerOptionTemplate")]
        public int? AnswerOptionTemplateId { get; set; }
        public AnswerOptionTemplate? AnswerOptionTemplate { get; set; } = null;

        // Optional free text response (used for open-ended or fill-in-the-blank)
        public string? FreeTextAnswer { get; set; }
        public string? Comment { get; set; }
        public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;
    }
}