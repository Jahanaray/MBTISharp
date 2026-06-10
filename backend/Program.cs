using Microsoft.EntityFrameworkCore;
using MBTIMatch.Data;
using MBTIMatch.Hubs;
using MBTIMatch.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ISafetyFilterService, SafetyFilterService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowPWA", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://mbtimatch.app")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddAuthentication().AddBearerToken();
builder.Services.AddSignalR();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("AllowPWA");
app.UseAuthentication();
app.UseAuthorization();
app.MapStaticAssets();
app.MapControllers();
app.MapHub<ChatHub>("/chatHub");

app.Run();

public partial class Program { }
