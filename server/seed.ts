import { DBStorage } from "./storage";

async function seed() {
  console.log("Starting database seed...");
  const storage = new DBStorage();

  try {
    // Create diverse user base
    const userCategories = [
      { prefix: "anime", bio: "Anime enthusiast & AMV creator", icon: "🎌" },
      { prefix: "gamer", bio: "Pro gamer & streamer", icon: "🎮" },
      { prefix: "comedy", bio: "Making people laugh daily", icon: "😂" },
      { prefix: "movie", bio: "Film buff & reviewer", icon: "🎬" },
      { prefix: "music", bio: "Music producer & DJ", icon: "🎵" },
      { prefix: "dance", bio: "Professional dancer", icon: "💃" },
      { prefix: "chef", bio: "Cooking delicious content", icon: "🍳" },
      { prefix: "travel", bio: "Exploring the world", icon: "✈️" },
      { prefix: "sports", bio: "Sports highlights & commentary", icon: "⚽" },
      { prefix: "tech", bio: "Tech reviews & tutorials", icon: "💻" },
      { prefix: "art", bio: "Digital artist & creator", icon: "🎨" },
      { prefix: "fitness", bio: "Fitness coach & motivation", icon: "💪" },
      { prefix: "pets", bio: "Cute animal moments", icon: "🐾" },
      { prefix: "magic", bio: "Magic tricks & illusions", icon: "🎩" },
      { prefix: "science", bio: "Science experiments & facts", icon: "🔬" },
    ];

    console.log("Creating 100 users...");
    const users = [];
    for (let i = 0; i < 100; i++) {
      const category = userCategories[i % userCategories.length];
      const user = await storage.createUser({
        username: `${category.prefix}_${i + 1}`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
        bio: `${category.bio} ${category.icon}`,
      });

      // Update counts
      await storage.updateUser(user.id, {
        followersCount: Math.floor(Math.random() * 500000) + 10000,
        followingCount: Math.floor(Math.random() * 1000) + 50,
        likesCount: Math.floor(Math.random() * 2000000) + 50000,
      });

      users.push(user);
      if ((i + 1) % 20 === 0) {
        console.log(`Created ${i + 1}/100 users`);
      }
    }

    // Video URLs from public sources
    const videoUrls = [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    ];

    // Video categories with captions and sounds
    const videoTemplates = [
      // Anime
      { caption: "Epic anime fight scene compilation", sound: "Anime OST Mix", category: "anime" },
      { caption: "Top 10 anime moments that made us cry", sound: "Emotional Piano", category: "anime" },
      { caption: "Anime transformation scenes be like", sound: "Power Up Theme", category: "anime" },
      { caption: "When the main character gets serious", sound: "Epic Battle Music", category: "anime" },
      { caption: "Best anime opening of all time?", sound: "Anime OP Cover", category: "anime" },
      
      // Gaming
      { caption: "Insane clutch in ranked!", sound: "Victory Theme", category: "gaming" },
      { caption: "When you finally beat that boss", sound: "Boss Battle Music", category: "gaming" },
      { caption: "Epic gaming moments compilation", sound: "Game Soundtrack", category: "gaming" },
      { caption: "Speedrun world record attempt", sound: "Intense Gaming Music", category: "gaming" },
      { caption: "Pro player highlights", sound: "Electronic Beat", category: "gaming" },
      
      // Comedy/Funny
      { caption: "You won't stop laughing at this", sound: "Comedy Sound Effect", category: "comedy" },
      { caption: "Pranking my friend gone wrong", sound: "Funny Background Music", category: "comedy" },
      { caption: "Expectation vs Reality", sound: "Comedic Timing", category: "comedy" },
      { caption: "When life gives you lemons", sound: "Silly Music", category: "comedy" },
      { caption: "Epic fail compilation", sound: "Funny Moments Mix", category: "comedy" },
      
      // Movies
      { caption: "Best movie plot twists explained", sound: "Cinematic Score", category: "movies" },
      { caption: "Behind the scenes movie magic", sound: "Film Score", category: "movies" },
      { caption: "Top action scenes of 2024", sound: "Epic Movie Theme", category: "movies" },
      { caption: "Movie theories that blow your mind", sound: "Mystery Music", category: "movies" },
      { caption: "Iconic movie quotes recreation", sound: "Classic Film Score", category: "movies" },
      
      // Music
      { caption: "New beat drop is fire", sound: "Original Mix", category: "music" },
      { caption: "Making music from everyday sounds", sound: "Creative Beat", category: "music" },
      { caption: "Guitar solo that will give you chills", sound: "Live Performance", category: "music" },
      { caption: "Remix of your favorite song", sound: "EDM Remix", category: "music" },
      { caption: "Singing challenge gone right", sound: "Vocal Cover", category: "music" },
      
      // Dance
      { caption: "New choreography! What do you think?", sound: "Dance Mix", category: "dance" },
      { caption: "Dance battle highlights", sound: "Hip Hop Beat", category: "dance" },
      { caption: "Learn this dance in 30 seconds", sound: "Tutorial Track", category: "dance" },
      { caption: "When the beat drops perfectly", sound: "Drop Mix", category: "dance" },
      { caption: "Freestyle dance session", sound: "Freestyle Beat", category: "dance" },
      
      // Cooking
      { caption: "5-minute meal that tastes amazing", sound: "Cooking Vibes", category: "cooking" },
      { caption: "Secret ingredient revealed", sound: "Kitchen Beats", category: "cooking" },
      { caption: "Cooking hack you need to try", sound: "Chef's Choice", category: "cooking" },
      { caption: "Making the perfect dessert", sound: "Sweet Music", category: "cooking" },
      { caption: "Street food adventure", sound: "Food Vlog Music", category: "cooking" },
      
      // Travel
      { caption: "Hidden gem nobody talks about", sound: "Adventure Music", category: "travel" },
      { caption: "Best view I've ever seen", sound: "Wanderlust Vibes", category: "travel" },
      { caption: "Travel tips that save money", sound: "Journey Mix", category: "travel" },
      { caption: "Trying local food for the first time", sound: "Explorer Theme", category: "travel" },
      { caption: "Bucket list destination unlocked", sound: "Travel Beats", category: "travel" },
      
      // Sports
      { caption: "Unbelievable sports moment", sound: "Victory Anthem", category: "sports" },
      { caption: "Training routine that works", sound: "Workout Music", category: "sports" },
      { caption: "Game winning play analysis", sound: "Sports Commentary", category: "sports" },
      { caption: "Athlete motivation speech", sound: "Inspiring Track", category: "sports" },
      { caption: "Skills training tutorial", sound: "Training Beat", category: "sports" },
      
      // Tech
      { caption: "New tech you need to see", sound: "Tech Review Music", category: "tech" },
      { caption: "Gadget unboxing and first impressions", sound: "Unboxing Beat", category: "tech" },
      { caption: "Tech tip that changed everything", sound: "Tutorial Theme", category: "tech" },
      { caption: "Comparing the latest phones", sound: "Review Music", category: "tech" },
      { caption: "Future of technology explained", sound: "Futuristic Sound", category: "tech" },
    ];

    console.log("Creating 5000 videos...");
    const baseDate = new Date("2024-01-01T00:00:00Z");
    
    for (let i = 0; i < 5000; i++) {
      const template = videoTemplates[i % videoTemplates.length];
      const user = users[i % users.length];
      const videoUrl = videoUrls[i % videoUrls.length];
      
      // Create varied timestamps over the past year
      const daysAgo = Math.floor(Math.random() * 365);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date(baseDate);
      createdAt.setDate(createdAt.getDate() + daysAgo);
      createdAt.setHours(createdAt.getHours() + hoursAgo);
      createdAt.setMinutes(createdAt.getMinutes() + minutesAgo);

      const video = await storage.createVideo({
        userId: user.id,
        videoUrl: videoUrl,
        thumbnailUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=video${i}`,
        caption: template.caption,
        soundName: template.sound,
      });

      // Update with realistic engagement metrics
      await storage.updateVideo(video.id, {
        likesCount: Math.floor(Math.random() * 1000000),
        commentsCount: Math.floor(Math.random() * 50000),
        viewsCount: Math.floor(Math.random() * 5000000),
        createdAt: createdAt,
      });

      if ((i + 1) % 500 === 0) {
        console.log(`Created ${i + 1}/5000 videos`);
      }
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
