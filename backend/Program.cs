using Microsoft.EntityFrameworkCore;
using MBTIMatch.Data;
using MBTIMatch.Hubs;
using MBTIMatch.Models;
using MBTIMatch.Services;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection") ?? 
        "Host=postgres;Port=5432;Database=mbtimatch;Username=postgres;Password=postgres"));

builder.Services.AddScoped<ISafetyFilterService, SafetyFilterService>();
builder.Services.AddScoped<IMbtiMatchingService, MbtiMatchingService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowPWA", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddAuthentication().AddBearerToken();
builder.Services.AddSignalR();

var app = builder.Build();

// Auto-migrate DB + seed questions on startup (with retry and broad exception handling)
try
{
    for (int attempt = 0; attempt < 30; attempt++)
    {
        try
        {
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                await db.Database.EnsureCreatedAsync();

                try
                {
                    await db.Database.ExecuteSqlRawAsync("""
                        ALTER TABLE "Users" ALTER COLUMN "PhoneNumber" DROP NOT NULL;
                        CREATE UNIQUE INDEX IF NOT EXISTS "IX_Users_Email" ON "Users" ("Email");
                        """);
                }
                catch (Exception schemaEx)
                {
                    Console.WriteLine($"[Startup] Schema compatibility check skipped: {schemaEx.Message}");
                }

                var needsQuestionRefresh = !db.Questions.Any() ||
                    db.Questions.Count() != DbSeeder.Questions.Count ||
                    db.Questions.Any(q => q.Dimension == "CP" || q.Dimension == "TJ");

                if (needsQuestionRefresh)
                {
                    db.Answers.RemoveRange(db.Answers);
                    db.Questions.RemoveRange(db.Questions);
                    await db.SaveChangesAsync();
                    db.Questions.AddRange(DbSeeder.Questions);
                    await db.SaveChangesAsync();
                }
            }
            break; // Success
        }
        catch (PostgresException) when (attempt < 29)
        {
            await Task.Delay(TimeSpan.FromSeconds(2));
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($"[Startup] Database migration skipped: {ex.Message}");
}

app.UseHttpsRedirection();
app.UseCors("AllowPWA");
app.UseAuthentication();
app.UseAuthorization();
app.MapStaticAssets();
app.MapControllers();
app.MapHub<ChatHub>("/chatHub");

app.Run();

public partial class Program { }
