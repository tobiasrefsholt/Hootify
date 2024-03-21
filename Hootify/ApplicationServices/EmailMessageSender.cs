using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace Hootify.ApplicationServices;

public class EmailMessageSender<TUser> : IEmailSender<TUser> where TUser : class
{
    private IEmailSender _emailSender;

    public EmailMessageSender(IEmailSender emailSender)
    {
        _emailSender = emailSender;
    }

    public Task SendConfirmationLinkAsync(TUser user, string email, string confirmationLink)
    {
        return _emailSender.SendEmailAsync(
            email,
            "Confirm your email",
            "Please confirm your account by <a href='" + confirmationLink + "'>clicking here</a>."
        );
    }

    public Task SendPasswordResetLinkAsync(TUser user, string email, string resetLink)
    {
        return _emailSender.SendEmailAsync(
            email,
            "Password reset",
            "Please reset your password by <a href='" + resetLink + "'>clicking here</a>."
        );
    }

    public Task SendPasswordResetCodeAsync(TUser user, string email, string resetCode)
    {
        return _emailSender.SendEmailAsync(email, "Password reset", resetCode);
    }
}