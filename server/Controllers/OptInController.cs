using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.data;
using server.Models;
using server.Services;
using server.Helpers;
using Microsoft.Extensions.Options;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OptInController : ControllerBase
    {
        private readonly ILogger<OptInController> _logger;
        private readonly AppDbContext _context;
        private readonly IMessagingService _messagingService;
        private readonly IGuidEncoderService _guidEncoder;

        private readonly string _apiUrl;

        public OptInController(
            ILogger<OptInController> logger,
            AppDbContext context,
            IMessagingService messagingService,
            IGuidEncoderService guidEncoder,
            IOptions<AppSettings> appSettings)
        {
            _logger = logger;
            _context = context;
            _messagingService = messagingService;
            _guidEncoder = guidEncoder;
            _apiUrl = appSettings.Value.PublicApiUrl == null ? "" : appSettings.Value.PublicApiUrl;
        }

        /// <summary>
        /// Adds a new contact who opts in for SMS messages.
        /// </summary>
        /// <param name="contact">The contact to add.</param>
        /// <returns>The created contact.</returns>
        [HttpPost("AddContact")]
        [ProducesResponseType(typeof(Contact), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Contact>> AddContact(Contact contact)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Trim both name and phone number
                contact.Name = contact.Name?.Trim();
                contact.PhoneNumber = PhoneNumberHelper.Normalize(contact.PhoneNumber);
                if (!PhoneNumberHelper.IsValid(contact.PhoneNumber) || string.IsNullOrWhiteSpace(contact.Name))
                {
                    return BadRequest("Invalid phone number format. Must be in E.164 format (e.g., +12025551234) or a name must be provided");
                }

                // Check for existing contact with this phone number
                var existingContact = await _context.Contacts
                    .FirstOrDefaultAsync(c => c.PhoneNumber == contact.PhoneNumber);
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();
                
                if (existingContact == null)
                {
                    // New contact
                    contact.OptInTime = DateTime.UtcNow;
                    contact.LastActiveTime = DateTime.UtcNow;
                    await _context.Contacts.AddAsync(contact);
                    await _context.SaveChangesAsync();
                    
                    await _context.SmsOptInAudits.AddAsync(CreateSmsOptInAudit(contact, ipAddress ?? "", userAgent ?? ""));
                    await _context.SaveChangesAsync();
                    return CreatedAtAction(nameof(AddContact), new { id = contact.Id }, contact);
                }
                else
                {
                    // Update existing contact's name and ensure they're active
                    existingContact.Name = contact.Name;
                    existingContact.IsActive = true;
                    existingContact.LastActiveTime = DateTime.UtcNow;
                    existingContact.OptOutTime = DateTime.MinValue; // Reset opt-out if they were opted out
                    await _context.SmsOptInAudits.AddAsync(CreateSmsOptInAudit(existingContact, ipAddress ?? "", userAgent ?? ""));
                    await _context.SaveChangesAsync();
                    return Ok(existingContact);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding contact");
                return StatusCode(500, "An error occurred while adding the contact");
            }
        }
        private SmsOptInAudit CreateSmsOptInAudit(Contact contact, string ipAddress, string userAgent)
        {
            return new SmsOptInAudit
            {
                PhoneNumber = contact.PhoneNumber,
                ContactId = contact.Id,
                OptinTime = DateTime.UtcNow,
                IPAddress = ipAddress,
                UserAgent = userAgent,
                WasSuccessful = true
            };
        }

        /// <summary>
        /// Retrieves all opted-in contacts.
        /// </summary>
        /// <returns>List of opted-in contacts.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Contact>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            try
            {
                var contacts = await _context.Contacts.ToListAsync();
                return Ok(contacts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving contacts");
                return StatusCode(500, "An error occurred while retrieving contacts");
            }
        }
        [HttpGet("LoadMessage")]
        public async Task<IActionResult> LoadMessage()
        {
            var messageTemplate =  await _context.MessageTemplates
                            .Where(mt => mt.MessageTypeId == (int)MessageTypeEnum.OptIn)
                            .FirstOrDefaultAsync();
            return Ok(messageTemplate);
        }
        /// <summary>
        /// Sends a text message to a contact
        /// </summary>
        /// <param name="phoneNumber">The phone number to send to</param>
        /// <param name="messageContent">The message content</param>
        /// <returns>Status of the message send</returns>
        [HttpPost("SendText")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SendText([FromBody] SendTextRequest request)
        {
            try
            {   
                // Check if this phone number has opted in                
                if (await _messagingService.IsContactOptedIn(request.PhoneNumber) == false)
                {
                    return BadRequest("This phone number has not opted in to receive messages");
                }

                //Make sure the person is not trying to spam.
                if (await _messagingService.MessageSendPreCheck(request.PhoneNumber) >= 3)
                {
                    return BadRequest("Too many messages sent recently. Please try again later.");
                }
                
                var contact = await _context.Contacts.FirstOrDefaultAsync(c => c.PhoneNumber == "+" + request.PhoneNumber);
                
                // Create a new survey response
                var surveyResponse = new SurveyResponse
                {
                    SurveyTemplateId = 1, // Fixed ID for demo survey
                    ContactId = contact?.Id ?? 0,
                    // CompletedAt will be null until they complete the survey
                };

                // Save the survey response first
                await _context.SurveyResponses.AddAsync(surveyResponse);
                await _context.SaveChangesAsync();

                // Create message record
                var optInMessage = new Message
                {
                    PhoneNumber = request.PhoneNumber,
                    Content = request.MessageContent,
                    SentAt = DateTime.UtcNow,
                    ContactId = contact?.Id,
                    MessageTypeID = (int)MessageTypeEnum.OptIn,
                    SurveyResponseId = surveyResponse.Id
                };

                var surveyMessage = (Message)optInMessage.Clone();
                surveyMessage.Content = await _context.MessageTemplates
                                                .Where(mt => mt.MessageTypeId == (int)MessageTypeEnum.SurveyLink)
                                                .Select(mt => mt.TemplateText)
                                                .FirstOrDefaultAsync() ?? string.Empty;

                string domain = HttpContext.Request.Host.ToString();

                //Need to do a preview-survey.html to generate the smart preview
                //in text messages
                if (domain.Contains("localhost"))
                {
                    surveyMessage.Url = $"/text-demo/survey/{_guidEncoder.EncodeGuidToBase64(surveyResponse.ResponseGuid)}"; // Use the service

                }
                else
                {
                    surveyMessage.Url = $"/preview-survey.html?guid={_guidEncoder.EncodeGuidToBase64(surveyResponse.ResponseGuid)}";
                }

                var fullUrl = $"{_apiUrl}{surveyMessage.Url}"; // Use the service
                surveyMessage.Content = surveyMessage.Content.Replace("{url}", fullUrl);
                surveyMessage.MessageTypeID = (int)MessageTypeEnum.SurveyLink;
                
                try
                {
                    // Send the message
                    await _messagingService.SendMessageAsync(optInMessage);
                    await Task.Delay(TimeSpan.FromSeconds(3));
                    await _messagingService.SendMessageAsync(surveyMessage);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error sending message via Vonage");
                    optInMessage.ErrorMessage = ex.Message;
                    // Don't throw here, we want to save the error message
                }

                if (!string.IsNullOrEmpty(optInMessage.ErrorMessage))
                {
                    return StatusCode(500, new { error = "Message failed to send", details = optInMessage.ErrorMessage });
                }

                return Ok(new { message = "Text message sent successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SendText endpoint");
                return StatusCode(500, "An error occurred while sending the text message");
            }
        }
        /// <summary>
        /// Test for Postman verifying if the server is reachable
        /// </summary>
        /// <returns></returns>
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new { message = "pong", timestamp = DateTime.UtcNow });
        }

        public class SendTextRequest
        {
            public string PhoneNumber { get; set; } = "";
            public string MessageContent { get; set; } = "";
        }
    }
}