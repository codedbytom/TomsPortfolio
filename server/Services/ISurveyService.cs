using server.Models;
using server.Models.DTO.Survey;
using server.Models.Surveys;

namespace server.Services
{
    public interface ISurveyService
    {
        Task SaveSurveyResponseAsync(SurveyResponse response);
        Task<List<SurveyResponse>> GetSurveyResponsesAsync(int surveyId);
        List<SurveyResponseAnswer> MapSurveyRADTO(List<SurveyAnswerDTO> surveyAnswerDTOs, int surveyResponseID);
    }
} 