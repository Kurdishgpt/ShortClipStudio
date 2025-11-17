import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Video, User } from "@shared/schema";
import { Heart, MessageCircle, Share2, Music, VolumeX, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentSection } from "@/components/comment-section";
import { useToast } from "@/hooks/use-toast";

interface VideoWithUser extends Video {
  user?: User;
}

export default function VideoFeed() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  
  const { data: videos = [], isLoading } = useQuery<VideoWithUser[]>({
    queryKey: ["/api/videos"],
  });

  const likeMutation = useMutation({
    mutationFn: async (videoId: string) => {
      return apiRequest("POST", "/api/likes", {
        videoId,
        userId: "user-1", // In a real app, this would come from auth context
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to like video",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);
      
      if (newIndex !== currentVideoIndex && newIndex < videos.length) {
        setCurrentVideoIndex(newIndex);
        
        videoRefs.current.forEach((video, index) => {
          if (video) {
            if (index === newIndex) {
              video.play().catch(() => {});
              setIsPlaying(true);
            } else {
              video.pause();
            }
          }
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [currentVideoIndex, videos.length]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      currentVideo.play().catch(() => {});
    }
  }, [currentVideoIndex]);

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleLike = (videoId: string) => {
    likeMutation.mutate(videoId);
  };

  const handleComment = (videoId: string) => {
    setSelectedVideoId(videoId);
    setShowComments(true);
  };

  const handleShare = (videoId: string) => {
    console.log("Share video:", videoId);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center space-y-2 px-4">
          <Music className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">No videos yet</h2>
          <p className="text-sm text-muted-foreground">Be the first to upload a video!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory bg-background"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="h-screen w-full snap-start relative flex items-center justify-center"
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={video.videoUrl}
              loop
              muted={muted}
              playsInline
              className="h-full w-full object-cover"
              onClick={() => handleVideoClick(index)}
              data-testid={`video-player-${video.id}`}
            />

            {/* Video Information - Bottom Left */}
            <div className="absolute bottom-24 left-4 right-20 z-10 text-white space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={video.user?.avatarUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {video.user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-base" data-testid={`text-username-${video.id}`}>
                  @{video.user?.username || "user"}
                </span>
              </div>

              {video.caption && (
                <p className="text-sm line-clamp-2" data-testid={`text-caption-${video.id}`}>
                  {video.caption}
                </p>
              )}

              {video.soundName && (
                <div className="flex items-center gap-2 text-sm">
                  <Music className="h-4 w-4" />
                  <span className="truncate">{video.soundName}</span>
                </div>
              )}
            </div>

            {/* Video Controls - Right Side */}
            <div className="absolute right-4 bottom-24 z-10 flex flex-col items-center gap-6">
              <button
                onClick={() => handleLike(video.id)}
                className="flex flex-col items-center gap-1 text-white hover-elevate active-elevate-2 rounded-full p-2"
                data-testid={`button-like-${video.id}`}
              >
                <div className="h-12 w-12 flex items-center justify-center">
                  <Heart className="h-8 w-8" />
                </div>
                <span className="text-xs font-semibold" data-testid={`text-likes-${video.id}`}>
                  {video.likesCount || 0}
                </span>
              </button>

              <button
                onClick={() => handleComment(video.id)}
                className="flex flex-col items-center gap-1 text-white hover-elevate active-elevate-2 rounded-full p-2"
                data-testid={`button-comment-${video.id}`}
              >
                <div className="h-12 w-12 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <span className="text-xs font-semibold" data-testid={`text-comments-${video.id}`}>
                  {video.commentsCount || 0}
                </span>
              </button>

              <button
                onClick={() => handleShare(video.id)}
                className="flex flex-col items-center gap-1 text-white hover-elevate active-elevate-2 rounded-full p-2"
                data-testid={`button-share-${video.id}`}
              >
                <div className="h-12 w-12 flex items-center justify-center">
                  <Share2 className="h-8 w-8" />
                </div>
                <span className="text-xs font-semibold">Share</span>
              </button>

              <button
                onClick={() => setMuted(!muted)}
                className="flex flex-col items-center gap-1 text-white hover-elevate active-elevate-2 rounded-full p-2"
                data-testid="button-mute-toggle"
              >
                <div className="h-8 w-8 flex items-center justify-center">
                  {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showComments && selectedVideoId && (
        <CommentSection
          videoId={selectedVideoId}
          onClose={() => {
            setShowComments(false);
            setSelectedVideoId(null);
          }}
        />
      )}
    </>
  );
}
