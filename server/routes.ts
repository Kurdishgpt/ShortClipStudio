import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertVideoSchema,
  insertCommentSchema,
  insertLikeSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Video endpoints
  app.get("/api/videos", async (req, res) => {
    try {
      // Check if pagination parameters are provided
      const limitParam = req.query.limit ? parseInt(req.query.limit as string) : null;
      const cursor = req.query.cursor as string | undefined;
      
      // Use paginated endpoint if limit is specified
      if (limitParam !== null) {
        const limit = Math.min(Math.max(limitParam, 1), 50); // Clamp between 1 and 50
        const result = await storage.getVideosPage({ limit, cursor });
        return res.json(result);
      }
      
      // Fallback to old behavior for backward compatibility
      const videos = await storage.getAllVideos();
      
      // Populate user data for each video
      const videosWithUsers = await Promise.all(
        videos.map(async (video) => {
          const user = await storage.getUser(video.userId);
          return { ...video, user };
        })
      );
      
      res.json(videosWithUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/trending", async (_req, res) => {
    try {
      const videos = await storage.getTrendingVideos(10);
      
      // Populate user data for each video
      const videosWithUsers = await Promise.all(
        videos.map(async (video) => {
          const user = await storage.getUser(video.userId);
          return { ...video, user };
        })
      );
      
      res.json(videosWithUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending videos" });
    }
  });

  app.get("/api/videos/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const videos = await storage.getVideosByUser(userId);
      
      // Populate user data for each video
      const videosWithUsers = await Promise.all(
        videos.map(async (video) => {
          const user = await storage.getUser(video.userId);
          return { ...video, user };
        })
      );
      
      res.json(videosWithUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const video = await storage.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      // Increment view count
      await storage.incrementVideoViews(id);
      
      // Get updated video with user data
      const updatedVideo = await storage.getVideo(id);
      const user = await storage.getUser(video.userId);
      
      res.json({ ...updatedVideo, user });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const result = insertVideoSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }

      const video = await storage.createVideo(result.data);
      const user = await storage.getUser(video.userId);
      
      res.status(201).json({ ...video, user });
    } catch (error) {
      res.status(500).json({ error: "Failed to create video" });
    }
  });

  // User endpoints
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }

      // Check if username already exists
      const existing = await storage.getUserByUsername(result.data.username);
      if (existing) {
        return res.status(400).json({ error: "Username already taken" });
      }

      const user = await storage.createUser(result.data);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Comment endpoints
  app.get("/api/comments/:videoId", async (req, res) => {
    try {
      const { videoId } = req.params;
      const comments = await storage.getCommentsByVideo(videoId);
      
      // Populate user data for each comment
      const commentsWithUsers = await Promise.all(
        comments.map(async (comment) => {
          const user = await storage.getUser(comment.userId);
          return { ...comment, user };
        })
      );
      
      res.json(commentsWithUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const result = insertCommentSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }

      const comment = await storage.createComment(result.data);
      const user = await storage.getUser(comment.userId);
      
      res.status(201).json({ ...comment, user });
    } catch (error) {
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Like endpoints
  app.post("/api/likes", async (req, res) => {
    try {
      const result = insertLikeSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }

      // Check if user already liked this video
      const existing = await storage.getLikeByUserAndVideo(
        result.data.userId,
        result.data.videoId
      );

      if (existing) {
        return res.status(400).json({ error: "Already liked" });
      }

      const like = await storage.createLike(result.data);
      res.status(201).json(like);
    } catch (error) {
      res.status(500).json({ error: "Failed to create like" });
    }
  });

  app.delete("/api/likes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteLike(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete like" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
