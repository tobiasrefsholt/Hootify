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
            endpoints.MapPost("/dashboard/questions/get", (Guid id, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var questionService = new DashboardQuestionService(dbContext, httpContext);
                return questionService.Get(id);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/questions/getAll",
                (QuestionFilterOptions filterOptions, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var questionService = new DashboardQuestionService(dbContext, httpContext);
                    return questionService.GetAll();
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/questions/add",
                async (AddQuestion question, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var questionService = new DashboardQuestionService(dbContext, httpContext);
                    return await questionService.Add(new AddQuestion[] { question });
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/questions/addMultiple",
                async (AddQuestion[] questions, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var questionService = new DashboardQuestionService(dbContext, httpContext);
                    return await questionService.Add(questions);
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/questions/delete",
                async (Guid[] questionIds, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var questionService = new DashboardQuestionService(dbContext, httpContext);
                    return await questionService.Delete(questionIds);
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/questions/edit",
                (QuestionWithAnswer question, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var questionService = new DashboardQuestionService(dbContext, httpContext);
                    questionService.Update(question);
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/categories/getAll", async (AppDbContext dbContext, HttpContext httpContext) =>
            {
                var categoryService = new DashboardCategoryService(dbContext, httpContext);
                return await categoryService.GetAll();
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/categories/add",
                async (Category category, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var categoryService = new DashboardCategoryService(dbContext, httpContext);
                    return await categoryService.Add(category);
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/categories/delete",
                async (Guid[] categoryIds, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var categoryService = new DashboardCategoryService(dbContext, httpContext);
                    return await categoryService.Delete(categoryIds);
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/categories/edit", async (Category category, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var categoryService = new DashboardCategoryService(dbContext, httpContext);
                    return await categoryService.Update(category);
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/add", (Quiz quiz, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var quizService = new DashboardQuizService(dbContext, httpContext);
                var success = Guid.TryParse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier),
                    out var userId);
                if (!success) return;
                quizService.Add(quiz);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/get", (Guid id, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var quizService = new DashboardQuizService(dbContext, httpContext);
                return quizService.Get(id);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/getAll", (AppDbContext dbContext, HttpContext httpContext) =>
            {
                var quizService = new DashboardQuizService(dbContext, httpContext);
                return quizService.GetAll();
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/delete", (Quiz quiz, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var quizService = new DashboardQuizService(dbContext, httpContext);
                return quizService.Delete(quiz.Id);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/edit", (Quiz quiz, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var quizService = new DashboardQuizService(dbContext, httpContext);
                return quizService.Update(quiz);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/game/add",
                (GameOptions gameOptions, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var service = new DashboardGameService(dbContext, httpContext);
                    return service.New(gameOptions);
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/game/get/{gameId:guid}",
                (Guid gameId, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var service = new DashboardGameService(dbContext, httpContext);
                    return service.Get(gameId);
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/game/getAll", (AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var service = new DashboardGameService(dbContext, httpContext);
                    return service.GetAll(null);
                })
                .RequireAuthorization();

            endpoints.MapPost("/dashboard/game/getAll/{gameState}",
                (GameState gameState, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var service = new DashboardGameService(dbContext, httpContext);
                    return service.GetAll(gameState);
                }).RequireAuthorization();
        });
    }
}