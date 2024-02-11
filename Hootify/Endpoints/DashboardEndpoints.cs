using Hootify.ViewModel;

namespace Hootify.Controllers;

public static class DashboardEndpoints
{
    public static IApplicationBuilder UseDashboardEndpoints( this IApplicationBuilder builder )
    {
        return builder.UseEndpoints(endpoints =>
        {
            endpoints.MapPost("/dashboard/getQuestions", (QuestionFilterOptions filterOptions) =>
            {
                
            });
            
            endpoints.MapPost("/dashboard/addQuestion", (Question question) =>
            {
                
            });

            endpoints.MapPost("/dashboard/deleteQuestion", (Question question) =>
            {
                
            });
            
            endpoints.MapPost("/dashboard/editQuestion", (Question question) =>
            {
                
            });
            
            endpoints.MapPost("/dashboard/createQuiz", (Quiz quiz) =>
            {
                
            });
        });
    }
    
}