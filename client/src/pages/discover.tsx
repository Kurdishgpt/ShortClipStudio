import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Video, User } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, TrendingUp, Play } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface VideoWithUser extends Video {
  user?: User;
}

const trendingCategories = [
  "Dance",
  "Comedy",
  "Music",
  "Art",
  "Food",
  "Travel",
  "Gaming",
  "Fashion",
  "Fitness",
  "Pets",
];

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: videos = [], isLoading } = useQuery<VideoWithUser[]>({
    queryKey: ["/api/videos"],
  });

  const { data: trendingVideos = [] } = useQuery<VideoWithUser[]>({
    queryKey: ["/api/videos/trending"],
  });

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = searchQuery
      ? video.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.user?.username.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search videos, users, sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 h-11 rounded-full bg-muted/50 border-0"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-6">
        {/* Trending Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Trending Now</h2>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-32 rounded-lg flex-shrink-0" />
                ))
              ) : trendingVideos.length > 0 ? (
                trendingVideos.slice(0, 10).map((video) => (
                  <div
                    key={video.id}
                    className="h-40 w-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted relative hover-elevate cursor-pointer"
                    data-testid={`trending-video-${video.id}`}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center gap-1 text-white text-xs">
                        <Play className="h-3 w-3 fill-current" />
                        <span className="font-semibold">{video.viewsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-muted-foreground">
                  No trending videos yet
                </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Categories</h2>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              {trendingCategories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className="cursor-pointer px-4 py-1.5 hover-elevate"
                  onClick={() =>
                    setSelectedCategory(selectedCategory === category ? null : category)
                  }
                  data-testid={`category-${category.toLowerCase()}`}
                >
                  {category}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Video Grid */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            {searchQuery ? "Search Results" : "All Videos"}
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="aspect-[9/16] rounded-lg" />
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? "No videos found" : "No videos available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="aspect-[9/16] rounded-lg overflow-hidden bg-muted relative hover-elevate cursor-pointer"
                  data-testid={`video-card-${video.id}`}
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
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="text-xs font-semibold line-clamp-2 mb-1">
                      {video.caption || "No caption"}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="truncate">@{video.user?.username || "user"}</span>
                      <div className="flex items-center gap-1">
                        <Play className="h-3 w-3 fill-current" />
                        <span>{video.viewsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
