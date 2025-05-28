using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using Microsoft.EntityFrameworkCore;
using server.data;
using Vonage.Common;
using server.Models.Surveys;
using server.Models.DTO;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DemoSurveyController : ControllerBase
    {
        private readonly ISurveyService _surveyService;
        private readonly IMessagingService _messageService;
        private readonly AppDbContext _context;
        private readonly IGuidEncoderService _guidEncoderService;

        public DemoSurveyController(ISurveyService surveyService, IMessagingService messageService, AppDbContext context, IGuidEncoderService guidEncoderService)
        {
            _surveyService = surveyService;
            _messageService = messageService;
            _context = context;
            _guidEncoderService = guidEncoderService;
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitDemoSurvey([FromBody] DemoSurveySubmission submission)
        {
            try
            {
                // Create survey responses
                var surveyResponse = _context.SurveyResponses
                                        .Where(sr => sr.ResponseGuid == _guidEncoderService.DecodeBase64ToGuid(submission.EncodedGuidID))
                                        .FirstOrDefault();

                if (surveyResponse == null) return StatusCode(500, "Survey Response Doesn't Exist");

                surveyResponse.CompletedAt = DateTime.UtcNow;
                surveyResponse.Answers = submission.Answers;

                //Save the response
                await _context.SaveChangesAsync();

                return Ok(new { message = "Survey submitted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to submit survey", details = ex.Message });
            }
        }

        [HttpGet("CompletedSurvey")]
        public async Task<IActionResult> SendCompletionText(string encodedGuidID)
        {
            Guid surveyResponseGuid = _guidEncoderService.DecodeBase64ToGuid(encodedGuidID);
            var surveyReponse = await _context.SurveyResponses
                                        .Include(sr => sr.Contact)
                                        .Where(sr => sr.ResponseGuid == surveyResponseGuid)
                                        .FirstOrDefaultAsync();

            if(surveyReponse == null) return NotFound();


            return Ok(new { message = "Thank you for submitting the survey" });
        }

        [HttpGet("{surveyResponseID}")]
        public async Task<IActionResult> GetSurvey(string surveyResponseID)
        {
            Guid surveyResponseGuid = _guidEncoderService.DecodeBase64ToGuid(surveyResponseID);
            var surveyReponse = await _context.SurveyResponses
                                        .Where(sr => sr.ResponseGuid == surveyResponseGuid)
                                        .FirstOrDefaultAsync();

            if(surveyReponse == null) return NotFound();

            var template = await _context.SurveyTemplates
                .Include(s => s.Questions)
                .ThenInclude(q => q.AnswerOptions) // Get the answers
                .FirstOrDefaultAsync(s => s.Id == surveyReponse.SurveyTemplateId);

            if (template == null) return NotFound();

            var dto = new SurveyDto
            {
                SurveyTemplateId = template.Id,
                Title = template.SurveyName,
                Questions = template.Questions
            };

            return Ok(dto);
        }

        [HttpGet("questions")]
        public async Task<IActionResult> GetSurveyQuestions()
        {
            try
            {
                var questions = await _context.QuestionTemplates
                    .Include(q => q.AnswerOptions)
                    .OrderBy(q => q.OrderInSurvey)
                    .ToListAsync();

                return Ok(questions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to fetch survey questions", details = ex.Message });
            }
        }

        private string GenerateFollowUpMessage(DemoSurveySubmission submission)
        {
            return string.Empty;
        }
    }

    public class DemoSurveySubmission
    {
        public DateTime StartDateTime { get; set; }
        public string? EncodedGuidID { get; set; }
        public List<SurveyResponseAnswer>? Answers { get; set; }
    }
} 