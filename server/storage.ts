import {
  type User,
  type InsertUser,
  type Video,
  type InsertVideo,
  type Comment,
  type InsertComment,
  type Like,
  type InsertLike,
} from "@shared/schema";
import { randomUUID } from "crypto";

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
    // Create sample users
    const user1: User = {
      id: "user-1",
      username: "sarah_dance",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      bio: "Professional dancer & choreographer 💃",
      followersCount: 125000,
      followingCount: 342,
      likesCount: 890000,
    };

    const user2: User = {
      id: "user-2",
      username: "chef_marco",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=marco",
      bio: "Cooking up delicious content 🍳",
      followersCount: 89000,
      followingCount: 156,
      likesCount: 567000,
    };

    const user3: User = {
      id: "user-3",
      username: "travel_maya",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya",
      bio: "Exploring the world one video at a time ✈️",
      followersCount: 203000,
      followingCount: 421,
      likesCount: 1200000,
    };

    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);

    // Create sample videos with string dates for proper JSON serialization
    const video1: Video = {
      id: "video-1",
      userId: user1.id,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=video1",
      caption: "New dance routine! What do you think? 💫",
      soundName: "Original Sound - sarah_dance",
      likesCount: 45200,
      commentsCount: 2,
      viewsCount: 234000,
      createdAt: new Date("2024-01-15T10:30:00Z"),
    };

    const video2: Video = {
      id: "video-2",
      userId: user2.id,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=video2",
      caption: "Easy 5-minute pasta recipe 🍝",
      soundName: "Cooking Vibes Mix",
      likesCount: 32100,
      commentsCount: 0,
      viewsCount: 189000,
      createdAt: new Date("2024-01-14T15:20:00Z"),
    };

    const video3: Video = {
      id: "video-3",
      userId: user3.id,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=video3",
      caption: "Sunset in Santorini 🌅 This place is magical!",
      soundName: "Summer Breeze",
      likesCount: 67800,
      commentsCount: 0,
      viewsCount: 456000,
      createdAt: new Date("2024-01-13T18:45:00Z"),
    };

    const video4: Video = {
      id: "video-4",
      userId: user1.id,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnailUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=video4",
      caption: "Tutorial time! Learn this move step by step 🔥",
      soundName: "Beat Drop Mix",
      likesCount: 28900,
      commentsCount: 0,
      viewsCount: 145000,
      createdAt: new Date("2024-01-12T12:00:00Z"),
    };

    this.videos.set(video1.id, video1);
    this.videos.set(video2.id, video2);
    this.videos.set(video3.id, video3);
    this.videos.set(video4.id, video4);

    // Create sample comments
    const comment1: Comment = {
      id: "comment-1",
      videoId: video1.id,
      userId: user2.id,
      text: "Amazing moves! 🔥",
      createdAt: new Date("2024-01-15T11:00:00Z"),
    };

    const comment2: Comment = {
      id: "comment-2",
      videoId: video1.id,
      userId: user3.id,
      text: "Can you do a tutorial for this?",
      createdAt: new Date("2024-01-15T11:30:00Z"),
    };

    this.comments.set(comment1.id, comment1);
    this.comments.set(comment2.id, comment2);
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
      ...insertUser,
      id,
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

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = {
      ...insertVideo,
      id,
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

export const storage = new MemStorage();
