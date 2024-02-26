using Hootify;
using Hootify.ApplicationServices;
using Hootify.DbModel;
using Hootify.Endpoints;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var connectionString = builder.Configuration.GetConnectionString("MariaDB");
builder.Services.AddDbContext<AppDbContext>(dbContextOptions =>
{
    dbContextOptions
        .UseMySql(connectionString, new MariaDbServerVersion(new Version(11, 2, 2)))
        .LogTo(Console.WriteLine, LogLevel.Information)
        .EnableSensitiveDataLogging()
        .EnableDetailedErrors();
});
builder.Services.AddDbContext<AuthDbContext>(dbContextOptions =>
{
    dbContextOptions.UseMySql(connectionString, new MariaDbServerVersion(new Version(11, 2, 2)));
});
builder.Services.AddHttpContextAccessor();
builder.Services.AddAuthorization();
builder.Services.AddAuthentication();
builder.Services.AddSignalR();
builder.Services.AddScoped<PlayerService>();
builder.Services
    .AddIdentityApiEndpoints<AppUser>(options =>
    {
        // Configure identity options if needed
        //options.SignIn.RequireConfirmedEmail = true;
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<AuthDbContext>();

var app = builder.Build();
if (!string.IsNullOrEmpty(builder.Configuration["AllowedOrigins"]))
{
    var origins = builder.Configuration["AllowedOrigins"]!.Split(",");
    app.UseCors(options =>
        options.WithOrigins(origins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
    );
}

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapIdentityApi<AppUser>();
app.UseGameEndpoints();
app.UseDashboardEndpoints();

app.MapPost("/logout", async (SignInManager<AppUser> signInManager) =>
    {
        await signInManager.SignOutAsync();
        return Results.Ok();
    })
    .WithOpenApi()
    .RequireAuthorization();

app.MapHub<GameHub>("/ws");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Run();