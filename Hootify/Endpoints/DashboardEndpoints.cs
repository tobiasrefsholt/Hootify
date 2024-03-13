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
            endpoints.MapPost("/dashboard/questions/get", async (Guid id, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var questionService = new DashboardQuestionService(dbContext, httpContext);
                return await questionService.Get(id);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/questions/getAll", async (QuestionFilterOptions filterOptions, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var questionService = new DashboardQuestionService(dbContext, httpContext);
                    return await questionService.GetAll();
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
                async (QuestionWithAnswer question, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var questionService = new DashboardQuestionService(dbContext, httpContext);
                    return await questionService.Update(question);
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

            endpoints.MapPost("/dashboard/categories/edit",
                async (Category category, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var categoryService = new DashboardCategoryService(dbContext, httpContext);
                    return await categoryService.Update(category);
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/add", async (Quiz quiz, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var quizService = new DashboardQuizService(dbContext, httpContext);
                return await quizService.Add(quiz);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/get", async (Guid id, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var quizService = new DashboardQuizService(dbContext, httpContext);
                return await quizService.Get(id);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/getAll", async (AppDbContext dbContext, HttpContext httpContext) =>
            {
                var quizService = new DashboardQuizService(dbContext, httpContext);
                return await quizService.GetAll();
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/delete", async (Guid[] quizIds, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var quizService = new DashboardQuizService(dbContext, httpContext);
                return await quizService.Delete(quizIds);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/edit", async (Quiz quiz, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var quizService = new DashboardQuizService(dbContext, httpContext);
                return await quizService.Update(quiz);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/game/add", async (GameOptions gameOptions, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var service = new DashboardGameService(dbContext, httpContext);
                    return await service.New(gameOptions);
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/game/get/{gameId:guid}", async (Guid gameId, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var service = new DashboardGameService(dbContext, httpContext);
                    return await service.Get(gameId);
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/game/getAll", async (AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var service = new DashboardGameService(dbContext, httpContext);
                    return await service.GetAll(null);
                })
                .RequireAuthorization();

            endpoints.MapPost("/dashboard/game/getAll/{gameState}", async (GameState gameState, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var service = new DashboardGameService(dbContext, httpContext);
                    return await service.GetAll(gameState);
                }).RequireAuthorization();
        });
    }
}