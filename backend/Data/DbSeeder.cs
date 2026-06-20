using Microsoft.EntityFrameworkCore;
using MBTIMatch.Models;

namespace MBTIMatch.Data;

public static class DbSeeder
{
    public static readonly List<Question> Questions = new()
    {
        new Question { Id = 1, Text = "After a long week, what recharges you faster?", Dimension = "EI", OptionA = "Meeting friends and talking it out", OptionB = "Quiet time with your own thoughts", WeightA = 1, WeightB = 1 },
        new Question { Id = 2, Text = "In a group project, where do you naturally land?", Dimension = "EI", OptionA = "Starting the conversation and moving people along", OptionB = "Thinking deeply before adding your best idea", WeightA = 1, WeightB = 1 },
        new Question { Id = 3, Text = "When your phone rings unexpectedly, your first instinct is:", Dimension = "EI", OptionA = "Answer and see what is happening", OptionB = "Let it ring, then text back", WeightA = 1, WeightB = 1 },
        new Question { Id = 4, Text = "When learning something new, you prefer:", Dimension = "SN", OptionA = "Concrete examples and practical steps", OptionB = "Patterns, theories, and possibilities", WeightA = 1, WeightB = 1 },
        new Question { Id = 5, Text = "Which compliment feels more like you?", Dimension = "SN", OptionA = "You notice every important detail", OptionB = "You see connections nobody else sees", WeightA = 1, WeightB = 1 },
        new Question { Id = 6, Text = "Planning a trip, you focus first on:", Dimension = "SN", OptionA = "Budget, route, weather, and bookings", OptionB = "The vibe, hidden gems, and what it could become", WeightA = 1, WeightB = 1 },
        new Question { Id = 7, Text = "When making a hard choice, you trust:", Dimension = "TF", OptionA = "Clear logic and fair principles", OptionB = "People's feelings and personal values", WeightA = 1, WeightB = 1 },
        new Question { Id = 8, Text = "In an argument, you are more likely to:", Dimension = "TF", OptionA = "Point out what is inconsistent", OptionB = "Try to keep the relationship intact", WeightA = 1, WeightB = 1 },
        new Question { Id = 9, Text = "A good decision should be:", Dimension = "TF", OptionA = "Objective, efficient, and honest", OptionB = "Kind, humane, and meaningful", WeightA = 1, WeightB = 1 },
        new Question { Id = 10, Text = "Your ideal weekend has:", Dimension = "JP", OptionA = "A plan you can actually follow", OptionB = "Room for whatever sounds good later", WeightA = 1, WeightB = 1 },
        new Question { Id = 11, Text = "Deadlines make you feel:", Dimension = "JP", OptionA = "Focused because the target is clear", OptionB = "Restricted because the options shrink", WeightA = 1, WeightB = 1 },
        new Question { Id = 12, Text = "Your workspace is usually:", Dimension = "JP", OptionA = "Organized enough that things have a place", OptionB = "A creative ecosystem only you understand", WeightA = 1, WeightB = 1 },
        new Question { Id = 13, Text = "When plans change suddenly, you usually:", Dimension = "JP", OptionA = "Need a minute to rebuild the plan", OptionB = "Adapt quickly and see what opens up", WeightA = 1, WeightB = 1 },
        new Question { Id = 14, Text = "At a party where you know only one person, you:", Dimension = "EI", OptionA = "Find a circle and introduce yourself", OptionB = "Stick near familiar energy until you warm up", WeightA = 1, WeightB = 1 },
        new Question { Id = 15, Text = "Your brain gets more excited by:", Dimension = "SN", OptionA = "What is proven and usable right now", OptionB = "What might be possible if the rules changed", WeightA = 1, WeightB = 1 },
        new Question { Id = 16, Text = "If a friend asks for advice, you first offer:", Dimension = "TF", OptionA = "The cleanest solution", OptionB = "Emotional support and context", WeightA = 1, WeightB = 1 },
        new Question { Id = 17, Text = "Your calendar is best described as:", Dimension = "JP", OptionA = "A promise to future you", OptionB = "A suggestion with ambition", WeightA = 1, WeightB = 1 },
        new Question { Id = 18, Text = "In conversation, you enjoy:", Dimension = "EI", OptionA = "Thinking out loud with others", OptionB = "Polishing your thought before sharing", WeightA = 1, WeightB = 1 },
        new Question { Id = 19, Text = "When solving problems, you start with:", Dimension = "SN", OptionA = "Known facts and constraints", OptionB = "The big picture and possible paths", WeightA = 1, WeightB = 1 },
        new Question { Id = 20, Text = "Being honest means:", Dimension = "TF", OptionA = "Saying the truth directly", OptionB = "Saying the truth with care", WeightA = 1, WeightB = 1 }
    };

    public static void SeedQuestions(ModelBuilder builder)
    {
        builder.Entity<Question>().HasData(Questions);
    }
}
