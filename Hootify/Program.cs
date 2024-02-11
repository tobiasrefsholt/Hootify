using Hootify.Controllers;
using Hootify.DbModel;
using Hootify.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var connectionString = builder.Configuration.GetConnectionString("MariaDB");
builder.Services.AddDbContext<AppDbContext>(dbContextOptions =>
{
    dbContextOptions
        .UseMySql(connectionString,
            new MariaDbServerVersion(new Version(11, 2, 2)))
        .LogTo(Console.WriteLine, LogLevel.Information)
        .EnableSensitiveDataLogging()
        .EnableDetailedErrors();
});
builder.Services.AddAuthorizationBuilder();
builder.Services
    .AddIdentityApiEndpoints<AppUser>(options =>
    {
        // Configure identity options if needed
        options.SignIn.RequireConfirmedEmail = true;
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<AppDbContext>();

var app = builder.Build();
app.UseRouting();
app.MapIdentityApi<AppUser>();
app.UseGameEndpoints();
app.UseDashboardEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Run();