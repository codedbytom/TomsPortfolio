using Microsoft.EntityFrameworkCore;
using server.Models;
using server.data;
using server.Models.Surveys;
using server.Models.DTO.Survey;

namespace server.Services
{
    public class SurveyService : ISurveyService
    {
        private readonly AppDbContext _context;

        public SurveyService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SaveSurveyResponseAsync(SurveyResponse response)
        {
            _context.SurveyResponses.Add(response);
            await _context.SaveChangesAsync();
        }

        public List<SurveyResponseAnswer> MapSurveyRADTO(List<SurveyAnswerDTO> surveyAnswerDTOs, int surveyResponseID)
        {
            return surveyAnswerDTOs.Select(a => new SurveyResponseAnswer
            {
                SurveyResponseId = surveyResponseID,
                SurveyQuestionTemplateId = a.SurveyQuestionTemplateId,
                AnswerOptionTemplateId = a.AnswerOptionTemplateId ?? null,
                FreeTextAnswer = a.FreeTextAnswer,
                Comment = a.Comment

            }).ToList();
        }

        public async Task<List<SurveyResponse>> GetSurveyResponsesAsync(int surveyTemp)
        {
            return await _context.SurveyResponses
                .Include(sr => sr.Answers)
                .Where(sr => sr.SurveyTemplateId == 0)
                .ToListAsync();
        }
    }
} 