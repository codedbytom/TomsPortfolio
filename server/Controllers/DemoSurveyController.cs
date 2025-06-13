using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using Microsoft.EntityFrameworkCore;
using server.data;
using Vonage.Common;
using server.Models.Surveys;
using server.Models.DTO.Survey;
using Vonage.Meetings.DeleteTheme;
using Microsoft.Extensions.Options;
using server.Models.DTO;
using Jose;

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
        private readonly string _apiUrl;

        public DemoSurveyController(
            ISurveyService surveyService,
            IMessagingService messageService,
            AppDbContext context,
            IGuidEncoderService guidEncoderService,
            IOptions<AppSettings> options)
        {
            _surveyService = surveyService;
            _messageService = messageService;
            _context = context;
            _guidEncoderService = guidEncoderService;
            _apiUrl = options.Value.PublicApiUrl ?? "";
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitDemoSurvey([FromBody] DemoSurveySubmission submission)
        {
            try
            {
                // Create survey responses
                var surveyResponse = await _context.SurveyResponses
                                        .Where(sr => sr.ResponseGuid == _guidEncoderService.DecodeBase64ToGuid(submission.EncodedGuidID ?? ""))
                                        .FirstOrDefaultAsync();

                if (surveyResponse == null) return StatusCode(500, "Survey Response Doesn't Exist");

                surveyResponse.CompletedAt = DateTime.UtcNow;
                if(submission.Answers != null) // Add the answers, if null, just submit a blank survey
                    surveyResponse.Answers = _surveyService.MapSurveyRADTO(submission.Answers, surveyResponse.Id);

                await _context.SaveChangesAsync();

                return Ok(new { message = "Survey submitted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to submit survey", details = ex.Message });
            }
        }

        [HttpGet("Completed/{surveyResponseID}")]
        public async Task<IActionResult> SendCompletionText(string surveyResponseID)
        {
            Guid surveyResponseGuid = _guidEncoderService.DecodeBase64ToGuid(surveyResponseID);
            var surveyReponse = await _context.SurveyResponses
                                        .Include(sr => sr.Contact)
                                        .Where(sr => sr.ResponseGuid == surveyResponseGuid)
                                        .FirstOrDefaultAsync();

            var messageTemplateText = await _context.MessageTemplates
                                        .Where(mt => mt.MessageTypeId == (int)MessageTypeEnum.SurveyResults)
                                        .Select(mt => mt.TemplateText)
                                        .FirstOrDefaultAsync();

            if (surveyReponse == null || messageTemplateText == null) return NotFound();

            string domain = HttpContext.Request.Host.ToString();
            var baseString = string.Empty;
            //Need to do a preview-survey.html to generate the smart preview
            //in text messages
            if (domain.Contains("localhost") == false)
            {
                baseString = $"{_apiUrl}/preview-results.html?guid={surveyResponseID}";
            }
            else
            {
                baseString = $"{_apiUrl}/text-demo/survey/results/{surveyResponseID}"; // Use the service
            }
            
            var content = messageTemplateText?.Replace("{url}", baseString) ?? "Thank you for participating";
            content = content?.Replace("{Contact Name}", surveyReponse?.Contact?.Name) ?? "";

            var completionText = new Models.Message
            {
                PhoneNumber = surveyReponse?.Contact?.PhoneNumber ?? "",
                Content = content,
                ContactId = surveyReponse?.Contact?.Id,
                MessageTypeID = (int)MessageTypeEnum.SurveyResults,
                SurveyResponseId = surveyReponse?.Id,
                SentAt = DateTime.UtcNow
            };

            await _messageService.SendMessageAsync(completionText);

            return Ok(new { message = "Thank you for submitting the survey" });
        }

        [HttpGet("results/{surveyResponseID}")]
        public async Task<IActionResult> GetCompletedResults(string surveyResponseID)
        {
            Guid surveyResponseGuid = _guidEncoderService.DecodeBase64ToGuid(surveyResponseID);

            var surveyReponse = await _context.SurveyResponses
                                    .Include(sr => sr.Contact)
                                    .Include(sr => sr.Answers)
                                    .ThenInclude(a => a.AnswerOptionTemplate)
                                    .Include(sr => sr.SurveyTemplate)
                                    .ThenInclude(st => st.Questions)
                                    .ThenInclude(aot => aot.AnswerOptions)
                                    .Where(sr => sr.ResponseGuid == surveyResponseGuid)
                                    .FirstOrDefaultAsync();

            if (surveyReponse == null || surveyReponse.Answers == null)
                return NotFound();

            var questionGroups = surveyReponse.Answers
            .GroupBy(a => a.SurveyQuestionTemplateId)
            .ToList();
    
            var questions = questionGroups.Select(q =>{
                var firstAnswer = q.First();
                return new SurveyQuestionDto
                {
                    Id = firstAnswer.SurveyQuestionTemplateId,
                    Text = firstAnswer.SurveyQuestionTemplate?.Text ?? string.Empty,
                    QuestionTypeID = firstAnswer.SurveyQuestionTemplate?.QuestionTypeID ?? 0,
                    AnswerOptions = q.Select(a => new SurveyAnswerDTO
                    {
                        Comment = a.Comment,
                        Id = a.Id,
                        Text = a.AnswerOptionTemplate?.Text ?? string.Empty,
                        FreeTextAnswer = a.FreeTextAnswer
                    }).ToList()
                };
            }).ToList();
            var completedSurveyDTO = new CompletedSurveyDTO
            {
                SurveyTemplateId = surveyReponse.SurveyTemplateId,
                Title = $"Feedback From: {surveyReponse?.Contact?.Name}" ?? "Sample Survey",
                Questions = questions
            };
            return Ok(completedSurveyDTO);
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
                Questions = template.Questions.Select(q => new SurveyQuestionDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    QuestionTypeID = q.QuestionTypeID,
                    AnswerOptions = q.AnswerOptions.Select(a => new SurveyAnswerDTO
                    {
                        Id = a.Id,
                        Text = a.Text,
                        Value = a.Value
                    }).ToList()
                }).ToList()
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
    }

    public class DemoSurveySubmission
    {
        public string? StartDateTime { get; set; }
        public string? EncodedGuidID { get; set; }
        public List<SurveyAnswerDTO>? Answers { get; set; }
    }
} 