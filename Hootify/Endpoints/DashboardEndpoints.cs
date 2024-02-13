using System.Security.Claims;
using Hootify.ApplicationServices;
using AppDbContext = Hootify.DbModel.AppDbContext;
using Hootify.ViewModel;

namespace Hootify.Endpoints;

public static class DashboardEndpoints
{
    public static IApplicationBuilder UseDashboardEndpoints(this IApplicationBuilder builder)
    {
        return builder.UseEndpoints(endpoints =>
        {
            endpoints.MapPost("/dashboard/getQuestions",
                (QuestionFilterOptions filterOptions, AppDbContext dbContext) =>
                {
                    var questionService = new DashboardQuestionService(dbContext);
                    return questionService.GetAll();
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/addQuestion", (QuestionWithAnswer question, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var questionService = new DashboardQuestionService(dbContext);
                var success = Guid.TryParse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId);
                if (!success) return;
                questionService.Add(question, userId);
            });

            endpoints.MapPost("/dashboard/deleteQuestion", (QuestionWithAnswer question, AppDbContext dbContext) =>
            {
                var questionService = new DashboardQuestionService(dbContext);
                questionService.Delete(question.Id);
            });

            endpoints.MapPost("/dashboard/editQuestion", (QuestionWithAnswer question, AppDbContext dbContext) =>
            {
                var questionService = new DashboardQuestionService(dbContext);
                questionService.Update(question);
            });
            
            endpoints.MapPost("/dashboard/getCategories", (AppDbContext dbContext) =>
            {
                var categoryService = new DashboardCategoryService(dbContext);
                return categoryService.GetAll();
            });
            
            endpoints.MapPost("/dashboard/addCategory", (Category category, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var categoryService = new DashboardCategoryService(dbContext);
                var success = Guid.TryParse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId);
                if (!success) return;
                categoryService.Add(category, userId);
            });
            
            endpoints.MapPost("/dashboard/deleteCategory", (Category category, AppDbContext dbContext) =>
            {
                var categoryService = new DashboardCategoryService(dbContext);
                categoryService.Delete(category.Id);
            });
            
            endpoints.MapPost("/dashboard/editCategory", (Category category, AppDbContext dbContext) =>
            {
                var categoryService = new DashboardCategoryService(dbContext);
                categoryService.Update(category);
            });

            endpoints.MapPost("/dashboard/createQuiz", (Quiz quiz, AppDbContext dbContext) =>
            {
                /*var quizService = new DashboardQuizService(dbContext);
                quizService.Add(quiz);*/
            });
        });
    }
}