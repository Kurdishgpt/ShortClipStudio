import { storage } from "./storage";

async function addYouTubeShorts() {
  console.log("Adding 10 YouTube Shorts to database...");

  // Create a user for these videos
  const user = await storage.createUser({
    username: "youtube_curator",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=youtube",
    bio: "Curating the best YouTube Shorts"
  });

  console.log(`Created user: ${user.username} (${user.id})`);

  // Popular YouTube Shorts with real video IDs
  const youtubeShorts = [
    {
      videoId: "dQw4w9WgXcQ",
      caption: "Classic never gets old 🎵",
      soundName: "Never Gonna Give You Up",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
    },
    {
      videoId: "jNQXAC9IVRw",
      caption: "Me At The Zoo - First YouTube Video Ever! 📹",
      soundName: "Original Audio",
      thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg"
    },
    {
      videoId: "9bZkp7q19f0",
      caption: "Gangnam Style dance challenge 💃",
      soundName: "Gangnam Style",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg"
    },
    {
      videoId: "kJQP7kiw5Fk",
      caption: "Despacito vibes 🎶",
      soundName: "Despacito",
      thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg"
    },
    {
      videoId: "OPf0YbXqDm0",
      caption: "Mark Rober's Glitter Bomb 💣",
      soundName: "Tech Soundtrack",
      thumbnail: "https://img.youtube.com/vi/OPf0YbXqDm0/maxresdefault.jpg"
    },
    {
      videoId: "fC7oUOUEEi4",
      caption: "MrBeast Squid Game Recreation 🎮",
      soundName: "Dramatic Music",
      thumbnail: "https://img.youtube.com/vi/fC7oUOUEEi4/maxresdefault.jpg"
    },
    {
      videoId: "L_jWHffIx5E",
      caption: "Smarter Every Day - Science is Amazing! 🔬",
      soundName: "Educational Beat",
      thumbnail: "https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg"
    },
    {
      videoId: "FlsCjmMhFmw",
      caption: "History of the entire world, I guess 🌍",
      soundName: "Epic Timeline Music",
      thumbnail: "https://img.youtube.com/vi/FlsCjmMhFmw/maxresdefault.jpg"
    },
    {
      videoId: "uelHwf8o7_U",
      caption: "Asap Science - Cool Facts! 🧪",
      soundName: "Science Vibes",
      thumbnail: "https://img.youtube.com/vi/uelHwf8o7_U/maxresdefault.jpg"
    },
    {
      videoId: "hT_nvWreIhg",
      caption: "Charlie Bit My Finger - Classic Viral Video 😂",
      soundName: "Original Audio",
      thumbnail: "https://img.youtube.com/vi/hT_nvWreIhg/maxresdefault.jpg"
    }
  ];

  // Add each video to the database
  for (const short of youtubeShorts) {
    const video = await storage.createVideo({
      userId: user.id,
      videoUrl: `https://www.youtube.com/embed/${short.videoId}`,
      thumbnailUrl: short.thumbnail,
      caption: short.caption,
      soundName: short.soundName
    });
    
    console.log(`✓ Added: ${short.caption} (${video.id})`);
  }

  console.log("\n✅ Successfully added 10 YouTube Shorts!");
  console.log("You can now view them in your app!");
  process.exit(0);
}

addYouTubeShorts().catch((error) => {
  console.error("Error adding YouTube Shorts:", error);
  process.exit(1);
});
