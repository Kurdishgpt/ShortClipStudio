import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertVideoSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload as UploadIcon, X, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const uploadFormSchema = insertVideoSchema.extend({
  caption: z.string().max(500, "Caption must be 500 characters or less"),
  soundName: z.string().optional(),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      userId: "user-1", // This would come from auth context
      videoUrl: "",
      caption: "",
      soundName: "",
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: UploadFormValues) => {
      return apiRequest("POST", "/api/videos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "Video uploaded!",
        description: "Your video has been posted successfully",
      });
      form.reset();
      handleRemoveVideo();
      navigate("/");
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Video must be less than 100MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveVideo = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const onSubmit = async (data: UploadFormValues) => {
    if (!selectedFile) {
      toast({
        title: "No video selected",
        description: "Please select a video to upload",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would upload the file to storage and get a URL
    // For now, we'll use the preview URL as a placeholder
    const uploadData = {
      ...data,
      videoUrl: previewUrl || "",
    };

    uploadMutation.mutate(uploadData);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

        <div className="space-y-6">
          {/* Video Upload Area */}
          {!previewUrl ? (
            <Card className="p-8">
              <div
                className="border-2 border-dashed border-border rounded-lg p-12 text-center hover-elevate cursor-pointer transition-all"
                onClick={() => fileInputRef.current?.click()}
                data-testid="upload-area"
              >
                <UploadIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select video to upload</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Or drag and drop a file
                </p>
                <p className="text-xs text-muted-foreground">
                  MP4, WebM, or OGG (max 100MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="input-video-file"
                />
              </div>
            </Card>
          ) : (
            <Card className="p-4">
              <div className="relative">
                <div className="aspect-[9/16] max-h-[70vh] mx-auto rounded-lg overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    className="w-full h-full object-contain"
                    loop
                    onClick={togglePlayPause}
                    data-testid="video-preview"
                  />
                  {!isPlaying && (
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      onClick={togglePlayPause}
                    >
                      <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="h-8 w-8 text-black fill-current ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveVideo}
                  data-testid="button-remove-video"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Video Details Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your video..."
                        className="resize-none min-h-24"
                        {...field}
                        data-testid="input-caption"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="soundName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sound/Music (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Original Sound - Username"
                        {...field}
                        data-testid="input-sound"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    form.reset();
                    handleRemoveVideo();
                  }}
                  disabled={uploadMutation.isPending}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!selectedFile || uploadMutation.isPending}
                  data-testid="button-post"
                >
                  {uploadMutation.isPending ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
