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
            endpoints.MapPost("/dashboard/questions/get", (Guid id, AppDbContext dbContext) =>
            {
                var questionService = new DashboardQuestionService(dbContext);
                return questionService.Get(id);
            });

            endpoints.MapPost("/dashboard/questions/getAll",
                (QuestionFilterOptions filterOptions, AppDbContext dbContext) =>
                {
                    var questionService = new DashboardQuestionService(dbContext);
                    return questionService.GetAll();
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/questions/add",
                (QuestionWithAnswer question, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var questionService = new DashboardQuestionService(dbContext);
                    var success = Guid.TryParse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier),
                        out var userId);
                    if (!success) return;
                    questionService.Add(question, userId);
                });

            endpoints.MapPost("/dashboard/questions/delete", (QuestionWithAnswer question, AppDbContext dbContext) =>
            {
                var questionService = new DashboardQuestionService(dbContext);
                questionService.Delete(question.Id);
            });

            endpoints.MapPost("/dashboard/questions/edit", (QuestionWithAnswer question, AppDbContext dbContext) =>
            {
                var questionService = new DashboardQuestionService(dbContext);
                questionService.Update(question);
            });

            endpoints.MapPost("/dashboard/categories/getAll", (AppDbContext dbContext) =>
            {
                var categoryService = new DashboardCategoryService(dbContext);
                return categoryService.GetAll();
            });

            endpoints.MapPost("/dashboard/categories/add",
                (Category category, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var categoryService = new DashboardCategoryService(dbContext);
                    var success = Guid.TryParse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier),
                        out var userId);
                    if (!success) return;
                    categoryService.Add(category, userId);
                });

            endpoints.MapPost("/dashboard/categories/delete", (Category category, AppDbContext dbContext) =>
            {
                var categoryService = new DashboardCategoryService(dbContext);
                categoryService.Delete(category.Id);
            });

            endpoints.MapPost("/dashboard/categories/edit", (Category category, AppDbContext dbContext) =>
            {
                var categoryService = new DashboardCategoryService(dbContext);
                categoryService.Update(category);
            });

            endpoints.MapPost("/dashboard/quiz/add", (Quiz quiz, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var quizService = new DashboardQuizService(dbContext);
                var success = Guid.TryParse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier),
                    out var userId);
                if (!success) return;
                quizService.Add(quiz, userId);
            });
            
            endpoints.MapPost("/dashboard/quiz/get", (Guid id, AppDbContext dbContext) =>
            {
                var quizService = new DashboardQuizService(dbContext);
                return quizService.Get(id);
            });

            endpoints.MapPost("/dashboard/quiz/getAll", (AppDbContext dbContext) =>
            {
                var quizService = new DashboardQuizService(dbContext);
                return quizService.GetAll();
            });

            endpoints.MapPost("/dashboard/quiz/delete", (Quiz quiz, AppDbContext dbContext) =>
            {
                var quizService = new DashboardQuizService(dbContext);
                quizService.Delete(quiz.Id);
            });

            endpoints.MapPost("/dashboard/quiz/edit", (Quiz quiz, AppDbContext dbContext) =>
            {
                var quizService = new DashboardQuizService(dbContext);
                quizService.Update(quiz);
            });
        });
    }
}