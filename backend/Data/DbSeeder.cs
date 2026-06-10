using Microsoft.EntityFrameworkCore;
using MBTIMatch.Models;

namespace MBTIMatch.Data;

public static class DbSeeder
{
    public static void SeedQuestions(ModelBuilder builder)
    {
        var questions = new List<Question>
        {
            // EI Dimension (3 questions)
            new Question { Id = 1, Text = "At a party, do you interact with many people or just a few?", Dimension = "EI", OptionA = "Interact with many", OptionB = "Interact with a few", WeightA = 1, WeightB = 0 },
            new Question { Id = 2, Text = "Do you get energized by being around lots of people?", Dimension = "EI", OptionA = "Yes", OptionB = "No", WeightA = 1, WeightB = 0 },
            new Question { Id = 3, Text = "Do you prefer to call ahead or send a last-minute text?", Dimension = "EI", OptionA = "Call ahead", OptionB = "Last-minute text", WeightA = 1, WeightB = 0 },

            // SN Dimension (3 questions)
            new Question { Id = 4, Text = "Are you more interested in what is actual or what is possible?", Dimension = "SN", OptionA = "What is actual", OptionB = "What is possible", WeightA = 1, WeightB = 0 },
            new Question { Id = 5, Text = "In reading, do you prefer fact or fiction?", Dimension = "SN", OptionA = "Fact", OptionB = "Fiction", WeightA = 1, WeightB = 0 },
            new Question { Id = 6, Text = "Do you see what is obvious or miss the obvious?", Dimension = "SN", OptionA = "See what is obvious", OptionB = "Miss the obvious", WeightA = 1, WeightB = 0 },

            // TJ Dimension (3 questions)
            new Question { Id = 7, Text = "Are you more comfortable making or taking decisions?", Dimension = "TJ", OptionA = "Making", OptionB = "Taking", WeightA = 1, WeightB = 0 },
            new Question { Id = 8, Text = "Is it worse to have no principles or to be rigidly bound by them?", Dimension = "TJ", OptionA = "No principles", OptionB = "Rigidly bound", WeightA = 1, WeightB = 0 },
            new Question { Id = 9, Text = "Are you more likely to let events occur or take control?", Dimension = "TJ", OptionA = "Take control", OptionB = "Let events occur", WeightA = 1, WeightB = 0 },

            // CP Dimension (3 questions)
            new Question { Id = 10, Text = "Do you prefer to work with a deadline or spontaneously?", Dimension = "CP", OptionA = "With a deadline", OptionB = "Spontaneously", WeightA = 1, WeightB = 0 },
            new Question { Id = 11, Text = "Do you tend to look for facts first or impressions second?", Dimension = "CP", OptionA = "Facts first", OptionB = "Impressions first", WeightA = 1, WeightB = 0 },
            new Question { Id = 12, Text = "Are you more drawn to convincing or touching?", Dimension = "CP", OptionA = "Touching", OptionB = "Convincing", WeightA = 1, WeightB = 0 },

            // Cross-dimensional (3 questions)
            new Question { Id = 13, Text = "Do you prefer a planned daily routine or an unplanned one?", Dimension = "CP", OptionA = "Planned", OptionB = "Unplanned", WeightA = 1, WeightB = 0 },
            new Question { Id = 14, Text = "Are you more comfortable with working alone or in a group?", Dimension = "EI", OptionA = "In a group", OptionB = "Alone", WeightA = 1, WeightB = 0 },
            new Question { Id = 15, Text = "Do you value truth more than tact?", Dimension = "TJ", OptionA = "Truth", OptionB = "Tact", WeightA = 1, WeightB = 0 }
        };

        builder.Entity<Question>().HasData(questions);
    }
}
