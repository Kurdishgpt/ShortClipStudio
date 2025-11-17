import {
  type User,
  type InsertUser,
  type Video,
  type InsertVideo,
  type Comment,
  type InsertComment,
  type Like,
  type InsertLike,
  users,
  videos,
  comments,
  likes,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, desc, and, lt, or, sql } from "drizzle-orm";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

export type VideoWithUser = Video & { user: User };

export interface VideosPage {
  items: VideoWithUser[];
  nextCursor: string | null;
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Video methods
  getVideo(id: string): Promise<Video | undefined>;
  getAllVideos(): Promise<Video[]>;
  getVideosByUser(userId: string): Promise<Video[]>;
  getTrendingVideos(limit?: number): Promise<Video[]>;
  getVideosPage(params: { limit: number; cursor?: string }): Promise<VideosPage>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: string, updates: Partial<Video>): Promise<Video | undefined>;
  incrementVideoViews(id: string): Promise<void>;

  // Comment methods
  getCommentsByVideo(videoId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Like methods
  getLikesByVideo(videoId: string): Promise<Like[]>;
  getLikeByUserAndVideo(userId: string, videoId: string): Promise<Like | undefined>;
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private videos: Map<string, Video>;
  private comments: Map<string, Comment>;
  private likes: Map<string, Like>;

  constructor() {
    this.users = new Map();
    this.videos = new Map();
    this.comments = new Map();
    this.likes = new Map();
    this.seedData();
  }

  private seedData() {
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

    const users: User[] = [];
    for (let i = 0; i < 100; i++) {
      const category = userCategories[i % userCategories.length];
      const user: User = {
        id: `user-${i + 1}`,
        username: `${category.prefix}_${i + 1}`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
        bio: `${category.bio} ${category.icon}`,
        followersCount: Math.floor(Math.random() * 500000) + 10000,
        followingCount: Math.floor(Math.random() * 1000) + 50,
        likesCount: Math.floor(Math.random() * 2000000) + 50000,
      };
      users.push(user);
      this.users.set(user.id, user);
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

    // Generate 5000 videos
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

      const video: Video = {
        id: `video-${i + 1}`,
        userId: user.id,
        videoUrl: videoUrl,
        thumbnailUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=video${i}`,
        caption: template.caption,
        soundName: template.sound,
        likesCount: Math.floor(Math.random() * 1000000),
        commentsCount: Math.floor(Math.random() * 50000),
        viewsCount: Math.floor(Math.random() * 5000000),
        createdAt: createdAt,
      };
      
      this.videos.set(video.id, video);
    }

    // Add some sample comments to first few videos
    const commentTexts = [
      "This is amazing!",
      "Can't stop watching this",
      "Tutorial please!",
      "Best one yet",
      "How did you do this?",
      "Incredible work",
      "This deserves more views",
      "Obsessed with this",
      "Need the full version",
      "Masterpiece",
    ];

    for (let i = 0; i < 100; i++) {
      const comment: Comment = {
        id: `comment-${i + 1}`,
        videoId: `video-${Math.floor(i / 10) + 1}`,
        userId: users[i % users.length].id,
        text: commentTexts[i % commentTexts.length],
        createdAt: new Date(Date.now() - Math.random() * 86400000),
      };
      this.comments.set(comment.id, comment);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      avatarUrl: insertUser.avatarUrl ?? null,
      bio: insertUser.bio ?? null,
      followersCount: 0,
      followingCount: 0,
      likesCount: 0,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  // Video methods
  async getVideo(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getAllVideos(): Promise<Video[]> {
    return Array.from(this.videos.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getVideosByUser(userId: string): Promise<Video[]> {
    return Array.from(this.videos.values())
      .filter((video) => video.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTrendingVideos(limit: number = 10): Promise<Video[]> {
    return Array.from(this.videos.values())
      .sort((a, b) => b.viewsCount - a.viewsCount)
      .slice(0, limit);
  }

  async getVideosPage(params: { limit: number; cursor?: string }): Promise<VideosPage> {
    const allVideos = await this.getAllVideos(); // Already sorted by createdAt DESC
    let videosToProcess = allVideos;
    
    // Apply cursor filter if provided
    if (params.cursor) {
      try {
        const [cursorCreatedAt, cursorId] = params.cursor.split("::");
        const cursorDate = new Date(cursorCreatedAt);
        
        // Filter videos: createdAt < cursorDate OR (createdAt = cursorDate AND id < cursorId)
        videosToProcess = allVideos.filter((video) => {
          const videoDate = new Date(video.createdAt);
          const videoTime = videoDate.getTime();
          const cursorTime = cursorDate.getTime();
          
          if (videoTime < cursorTime) return true;
          if (videoTime === cursorTime && video.id < cursorId) return true;
          return false;
        });
      } catch (error) {
        console.error("Invalid cursor format in MemStorage:", error);
      }
    }
    
    // Take limit + 1 to determine if there are more items
    const fetchLimit = params.limit + 1;
    const fetchedVideos = videosToProcess.slice(0, fetchLimit);
    const hasMore = fetchedVideos.length > params.limit;
    const videosForPage = fetchedVideos.slice(0, params.limit);
    
    // Generate next cursor from last video in page (before user filtering)
    let nextCursor: string | null = null;
    if (hasMore && videosForPage.length > 0) {
      const lastVideo = videosForPage[videosForPage.length - 1];
      nextCursor = `${lastVideo.createdAt.toISOString()}::${lastVideo.id}`;
    }
    
    // Populate user data
    const items: VideoWithUser[] = [];
    for (const video of videosForPage) {
      const user = await this.getUser(video.userId);
      if (user) {
        items.push({ ...video, user });
      }
    }
    
    return {
      items,
      nextCursor,
    };
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = {
      id,
      userId: insertVideo.userId,
      videoUrl: insertVideo.videoUrl,
      thumbnailUrl: insertVideo.thumbnailUrl ?? null,
      caption: insertVideo.caption ?? null,
      soundName: insertVideo.soundName ?? null,
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      createdAt: new Date(),
    };
    this.videos.set(id, video);
    return video;
  }

  async updateVideo(id: string, updates: Partial<Video>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;

    const updated = { ...video, ...updates };
    this.videos.set(id, updated);
    return updated;
  }

  async incrementVideoViews(id: string): Promise<void> {
    const video = this.videos.get(id);
    if (video) {
      video.viewsCount += 1;
      this.videos.set(id, video);
    }
  }

  // Comment methods
  async getCommentsByVideo(videoId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter((comment) => comment.videoId === videoId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);

    // Increment video comment count
    const video = this.videos.get(insertComment.videoId);
    if (video) {
      video.commentsCount += 1;
      this.videos.set(video.id, video);
    }

    return comment;
  }

  // Like methods
  async getLikesByVideo(videoId: string): Promise<Like[]> {
    return Array.from(this.likes.values()).filter((like) => like.videoId === videoId);
  }

  async getLikeByUserAndVideo(userId: string, videoId: string): Promise<Like | undefined> {
    return Array.from(this.likes.values()).find(
      (like) => like.userId === userId && like.videoId === videoId
    );
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    const id = randomUUID();
    const like: Like = {
      ...insertLike,
      id,
      createdAt: new Date(),
    };
    this.likes.set(id, like);

    // Increment video like count
    const video = this.videos.get(insertLike.videoId);
    if (video) {
      video.likesCount += 1;
      this.videos.set(video.id, video);
    }

    return like;
  }

  async deleteLike(id: string): Promise<void> {
    const like = this.likes.get(id);
    if (like) {
      this.likes.delete(id);

      // Decrement video like count
      const video = this.videos.get(like.videoId);
      if (video && video.likesCount > 0) {
        video.likesCount -= 1;
        this.videos.set(video.id, video);
      }
    }
  }
}

export class DBStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      avatarUrl: insertUser.avatarUrl ?? null,
      bio: insertUser.bio ?? null,
      followersCount: 0,
      followingCount: 0,
      likesCount: 0,
    };
    await this.db.insert(users).values(user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await this.db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Video methods
  async getVideo(id: string): Promise<Video | undefined> {
    const result = await this.db.select().from(videos).where(eq(videos.id, id)).limit(1);
    return result[0];
  }

  async getAllVideos(): Promise<Video[]> {
    return await this.db.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async getVideosByUser(userId: string): Promise<Video[]> {
    return await this.db
      .select()
      .from(videos)
      .where(eq(videos.userId, userId))
      .orderBy(desc(videos.createdAt));
  }

  async getTrendingVideos(limit: number = 10): Promise<Video[]> {
    return await this.db
      .select()
      .from(videos)
      .orderBy(desc(videos.viewsCount))
      .limit(limit);
  }

  async getVideosPage(params: { limit: number; cursor?: string }): Promise<VideosPage> {
    const { limit, cursor } = params;
    
    // Fetch one extra to determine if there's a next page
    const fetchLimit = limit + 1;
    
    let query = this.db
      .select({
        video: videos,
        user: users,
      })
      .from(videos)
      .leftJoin(users, eq(videos.userId, users.id))
      .orderBy(desc(videos.createdAt), desc(videos.id))
      .limit(fetchLimit);
    
    // Apply cursor filter if provided
    if (cursor) {
      try {
        const [cursorCreatedAt, cursorId] = cursor.split("::");
        const cursorDate = new Date(cursorCreatedAt);
        
        query = query.where(
          or(
            lt(videos.createdAt, cursorDate),
            and(
              eq(videos.createdAt, cursorDate),
              lt(videos.id, cursorId)
            )
          )
        ) as typeof query;
      } catch (error) {
        console.error("Invalid cursor format:", error);
      }
    }
    
    const results = await query;
    
    // Check if there are more items
    const hasMore = results.length > limit;
    const items = results.slice(0, limit);
    
    // Generate next cursor from last item
    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];
      if (lastItem.video && lastItem.video.createdAt) {
        nextCursor = `${lastItem.video.createdAt.toISOString()}::${lastItem.video.id}`;
      }
    }
    
    // Transform results to VideoWithUser
    const videoWithUsers: VideoWithUser[] = items
      .filter((r) => r.video && r.user)
      .map((r) => ({
        ...r.video!,
        user: r.user!,
      }));
    
    return {
      items: videoWithUsers,
      nextCursor,
    };
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = {
      id,
      userId: insertVideo.userId,
      videoUrl: insertVideo.videoUrl,
      thumbnailUrl: insertVideo.thumbnailUrl ?? null,
      caption: insertVideo.caption ?? null,
      soundName: insertVideo.soundName ?? null,
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      createdAt: new Date(),
    };
    await this.db.insert(videos).values(video);
    return video;
  }

  async updateVideo(id: string, updates: Partial<Video>): Promise<Video | undefined> {
    const result = await this.db
      .update(videos)
      .set(updates)
      .where(eq(videos.id, id))
      .returning();
    return result[0];
  }

  async incrementVideoViews(id: string): Promise<void> {
    const video = await this.getVideo(id);
    if (video) {
      await this.db
        .update(videos)
        .set({ viewsCount: video.viewsCount + 1 })
        .where(eq(videos.id, id));
    }
  }

  // Comment methods
  async getCommentsByVideo(videoId: string): Promise<Comment[]> {
    return await this.db
      .select()
      .from(comments)
      .where(eq(comments.videoId, videoId))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    await this.db.insert(comments).values(comment);

    // Increment video comment count
    const video = await this.getVideo(insertComment.videoId);
    if (video) {
      await this.updateVideo(video.id, { commentsCount: video.commentsCount + 1 });
    }

    return comment;
  }

  // Like methods
  async getLikesByVideo(videoId: string): Promise<Like[]> {
    return await this.db.select().from(likes).where(eq(likes.videoId, videoId));
  }

  async getLikeByUserAndVideo(userId: string, videoId: string): Promise<Like | undefined> {
    const result = await this.db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.videoId, videoId)))
      .limit(1);
    return result[0];
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    const id = randomUUID();
    const like: Like = {
      ...insertLike,
      id,
      createdAt: new Date(),
    };
    await this.db.insert(likes).values(like);

    // Increment video like count
    const video = await this.getVideo(insertLike.videoId);
    if (video) {
      await this.updateVideo(video.id, { likesCount: video.likesCount + 1 });
    }

    return like;
  }

  async deleteLike(id: string): Promise<void> {
    const like = await this.db.select().from(likes).where(eq(likes.id, id)).limit(1);
    if (like[0]) {
      await this.db.delete(likes).where(eq(likes.id, id));

      // Decrement video like count
      const video = await this.getVideo(like[0].videoId);
      if (video && video.likesCount > 0) {
        await this.updateVideo(video.id, { likesCount: video.likesCount - 1 });
      }
    }
  }
}

export const storage = new DBStorage();
