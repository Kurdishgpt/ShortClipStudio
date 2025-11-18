import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Video, User } from "@shared/schema";
import { Heart, MessageCircle, Share2, Music, VolumeX, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentSection } from "@/components/comment-section";
import { useToast } from "@/hooks/use-toast";

interface VideoWithUser extends Video {
  user?: User;
}

interface VideosPage {
  items: VideoWithUser[];
  nextCursor: string | null;
}

export default function VideoFeed() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | HTMLIFrameElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const isYouTubeEmbed = (url: string) => {
    return url.includes('youtube.com/embed');
  };

  const { toast } = useToast();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<VideosPage>({
    queryKey: ["/api/videos"],
    queryFn: async ({ pageParam = undefined }) => {
      const params = new URLSearchParams({ limit: "10" });
      if (pageParam) {
        params.append("cursor", pageParam as string);
      }
      const response = await fetch(`/api/videos?${params}`);
      if (!response.ok) throw new Error("Failed to fetch videos");
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  const videos = data?.pages.flatMap((page) => page.items) ?? [];

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
        
        videoRefs.current.forEach((element, index) => {
          if (element && element instanceof HTMLVideoElement) {
            if (index === newIndex) {
              element.play().catch(() => {});
              setIsPlaying(true);
            } else {
              element.pause();
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
    const currentElement = videoRefs.current[currentVideoIndex];
    if (currentElement && currentElement instanceof HTMLVideoElement) {
      currentElement.play().catch(() => {});
    }
  }, [currentVideoIndex]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const loadMore = loadMoreRef.current;
    if (!loadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMore);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleVideoClick = (index: number) => {
    const element = videoRefs.current[index];
    if (element && element instanceof HTMLVideoElement) {
      if (element.paused) {
        element.play();
        setIsPlaying(true);
      } else {
        element.pause();
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
            className="h-screen w-full snap-start relative flex items-center justify-center bg-black"
          >
            {isYouTubeEmbed(video.videoUrl) ? (
              <iframe
                ref={(el) => (videoRefs.current[index] = el)}
                src={`${video.videoUrl}?autoplay=${index === currentVideoIndex ? 1 : 0}&mute=${muted ? 1 : 0}&loop=1&controls=0&modestbranding=1&playsinline=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
                data-testid={`video-player-${video.id}`}
              />
            ) : (
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={video.videoUrl}
                loop
                muted={muted}
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
                onClick={() => handleVideoClick(index)}
                data-testid={`video-player-${video.id}`}
              />
            )}

            {/* Video Information - Bottom Left */}
            <div className="absolute bottom-24 left-4 right-20 z-10 text-white space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={video.user?.avatarUrl || undefined} />
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

        {/* Infinite Scroll Trigger */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="h-screen w-full snap-start flex items-center justify-center bg-background"
          >
            {isFetchingNextPage ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading more videos...</p>
              </div>
            ) : (
              <Button onClick={() => fetchNextPage()} variant="outline" size="lg" data-testid="button-load-more">
                Load More Videos
              </Button>
            )}
          </div>
        )}
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
