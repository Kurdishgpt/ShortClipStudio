import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Video, User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play } from "lucide-react";

interface VideoWithUser extends Video {
  user?: User;
}

export default function Profile() {
  const [, params] = useRoute("/profile/:userId");
  const userId = params?.userId;

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users", userId],
    enabled: !!userId,
  });

  const { data: videos = [], isLoading: videosLoading } = useQuery<VideoWithUser[]>({
    queryKey: ["/api/videos/user", userId],
    enabled: !!userId,
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold" data-testid="text-username">
              @{user.username}
            </h1>
            {user.bio && (
              <p className="text-sm text-muted-foreground mt-2 max-w-md" data-testid="text-bio">
                {user.bio}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 text-center">
            <div>
              <div className="text-xl font-bold" data-testid="text-following-count">
                {user.followingCount || 0}
              </div>
              <div className="text-xs text-muted-foreground">Following</div>
            </div>
            <div>
              <div className="text-xl font-bold" data-testid="text-followers-count">
                {user.followersCount || 0}
              </div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div>
              <div className="text-xl font-bold" data-testid="text-likes-count">
                {user.likesCount || 0}
              </div>
              <div className="text-xs text-muted-foreground">Likes</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full max-w-sm">
            <Button className="flex-1" variant="default" data-testid="button-follow">
              Follow
            </Button>
            <Button className="flex-1" variant="outline" data-testid="button-message">
              Message
            </Button>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="videos" data-testid="tab-videos">
              Videos
            </TabsTrigger>
            <TabsTrigger value="liked" data-testid="tab-liked">
              Liked
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-4">
            {videosLoading ? (
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[9/16] rounded-md" />
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No videos yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="aspect-[9/16] relative rounded-md overflow-hidden bg-muted hover-elevate cursor-pointer"
                    data-testid={`video-thumbnail-${video.id}`}
                  >
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.caption || "Video"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                    )}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs">
                      <Play className="h-3 w-3 fill-current" />
                      <span className="font-semibold">{video.viewsCount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked" className="mt-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Liked videos appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
