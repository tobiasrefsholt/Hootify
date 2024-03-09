using Microsoft.AspNetCore.Identity.UI.Services;
using sib_api_v3_sdk.Api;
using sib_api_v3_sdk.Client;
using sib_api_v3_sdk.Model;
using Task = System.Threading.Tasks.Task;

namespace Hootify.ApplicationServices;

public class EmailService : IEmailSender
{
    private IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        Console.WriteLine(_configuration["Brevo:ApiKey"]);
        Console.WriteLine(_configuration["Brevo:SenderName"]);
        Console.WriteLine(_configuration["Brevo:SenderEmail"]);
        Console.WriteLine(email);
        Console.WriteLine(subject);
        Console.WriteLine(htmlMessage);
        try
        {
            Configuration.Default.AddApiKey("api-key", _configuration["Brevo:ApiKey"]);
            var client = new TransactionalEmailsApi();
            var recipient = new SendSmtpEmailTo(email);

            var sendSmtpEmail = new SendSmtpEmail(
                sender: new SendSmtpEmailSender(
                    _configuration["Brevo:SenderName"],
                    _configuration["Brevo:SenderEmail"]
                ),
                to: [recipient],
                subject: subject,
                htmlContent: htmlMessage
            );
            await client.SendTransacEmailAsync(sendSmtpEmail);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error sending email: {e.Message}");
        }
    }
}