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

                var surveyResponse = new SurveyResponse
                {
                    SurveyTemplateId = 1, // Fixed ID for demo survey
                    ContactId = submission.ContactId,
                    StartedAt = submission.StartDateTime,
                    CompletedAt = DateTime.UtcNow,
                    Answers = submission.Answers
                };
                
                foreach (var a in surveyResponse.Answers)
                {
                    Console.WriteLine($"Answer QID: {a.SurveyQuestionTemplateId}");
                }
                // Save the response
                await _surveyService.SaveSurveyResponseAsync(surveyResponse);

                // Generate and send follow-up message
                //var followUpMessage = GenerateFollowUpMessage(submission);
                if (submission.ContactId != 0)
                {
                    var contact = submission.ContactId;
                    await _messageService.SendMessageAsync(new server.Models.Message
                    {
                        ContactId = contact,
                        //Content = followUpMessage,
                        SentAt = DateTime.UtcNow
                    });
                }

                return Ok(new { message = "Survey submitted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to submit survey", details = ex.Message });
            }
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
        public int ContactId { get; set; }
        public string? EncodedGuidID { get; set; }
        public List<SurveyResponseAnswer>? Answers { get; set; }
    }

    public class SurveyComments
    {
        public string Rating { get; set; } = "";
        public string Recommendation { get; set; } = "";
        public string Likes { get; set; } = "";
        public string Suggestions { get; set; } = "";
    }
} 