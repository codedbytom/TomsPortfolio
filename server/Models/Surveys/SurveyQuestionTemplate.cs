using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server.Models
{
    public class SurveyQuestionTemplate
    {
        public int Id { get; set; }
        public int QuestionNumber { get; set; }
        public string Text { get; set; } = "";
        [ForeignKey("SurveyTemplate")]
        public int SurveyTemplateId { get; set; }
        public required SurveyTemplate SurveyTemplate { get; set; } 
        public bool IsRequired { get; set; }
        public int OrderInSurvey { get; set; }
        [ForeignKey("QuestionType")]
        public int QuestionTypeID {get; set;}
        public QuestionType? QuestionType { get; set; }
        public List<AnswerOptionTemplate> AnswerOptions { get; set; } = new();
    }
}
