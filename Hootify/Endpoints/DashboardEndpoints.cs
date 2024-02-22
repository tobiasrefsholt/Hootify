using System.Security.Claims;
using Hootify.ApplicationServices;
using AppDbContext = Hootify.DbModel.AppDbContext;
using Hootify.ViewModel;
using Microsoft.AspNetCore.SignalR;

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
            }).RequireAuthorization();

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
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/questions/delete", (QuestionWithAnswer question, AppDbContext dbContext) =>
            {
                var questionService = new DashboardQuestionService(dbContext);
                questionService.Delete(question.Id);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/questions/edit", (QuestionWithAnswer question, AppDbContext dbContext) =>
            {
                var questionService = new DashboardQuestionService(dbContext);
                questionService.Update(question);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/categories/getAll", (AppDbContext dbContext) =>
            {
                var categoryService = new DashboardCategoryService(dbContext);
                return categoryService.GetAll();
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/categories/add",
                (Category category, AppDbContext dbContext, HttpContext httpContext) =>
                {
                    var categoryService = new DashboardCategoryService(dbContext);
                    var success = Guid.TryParse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier),
                        out var userId);
                    if (!success) return;
                    categoryService.Add(category, userId);
                }).RequireAuthorization();

            endpoints.MapPost("/dashboard/categories/delete", (Category category, AppDbContext dbContext) =>
            {
                var categoryService = new DashboardCategoryService(dbContext);
                categoryService.Delete(category.Id);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/categories/edit", (Category category, AppDbContext dbContext) =>
            {
                var categoryService = new DashboardCategoryService(dbContext);
                categoryService.Update(category);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/add", (Quiz quiz, AppDbContext dbContext, HttpContext httpContext) =>
            {
                var quizService = new DashboardQuizService(dbContext);
                var success = Guid.TryParse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier),
                    out var userId);
                if (!success) return;
                quizService.Add(quiz, userId);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/get", (Guid id, AppDbContext dbContext) =>
            {
                var quizService = new DashboardQuizService(dbContext);
                return quizService.Get(id);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/getAll", (AppDbContext dbContext) =>
            {
                var quizService = new DashboardQuizService(dbContext);
                return quizService.GetAll();
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/delete", (Quiz quiz, AppDbContext dbContext) =>
            {
                var quizService = new DashboardQuizService(dbContext);
                quizService.Delete(quiz.Id);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/quiz/edit", (Quiz quiz, AppDbContext dbContext) =>
            {
                var quizService = new DashboardQuizService(dbContext);
                quizService.Update(quiz);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/game/new", (GameOptions options, AppDbContext dbContext) =>
            {
                var gameService = new DashboardGameService(dbContext);
                return gameService.New(options);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/game/get/{gameId:guid}", (Guid gameId, AppDbContext dbContext) =>
            {
                var gameService = new DashboardGameService(dbContext);
                return gameService.Get(gameId);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/game/getAll", (AppDbContext dbContext) =>
            {
                var gameService = new DashboardGameService(dbContext);
                return gameService.GetAll(null);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/game/getAll/{gameState}", (GameState gameState, AppDbContext dbContext) =>
            {
                var gameService = new DashboardGameService(dbContext);
                return gameService.GetAll(gameState);
            }).RequireAuthorization();

            endpoints.MapPost("/dashboard/game/nextQuestion/{gameId:guid}",
                (Guid gameId, AppDbContext dbContext, IHubContext<GameHub, IGameHub> gameHubContext) =>
                {
                    var gameService = new DashboardGameService(dbContext);
                    return gameService.NextQuestion(gameId, gameHubContext);
                }).RequireAuthorization();
        });
    }
}