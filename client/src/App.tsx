import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNavigation } from "@/components/bottom-navigation";
import VideoFeed from "@/pages/video-feed";
import Discover from "@/pages/discover";
import Upload from "@/pages/upload";
import Inbox from "@/pages/inbox";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={VideoFeed} />
        <Route path="/discover" component={Discover} />
        <Route path="/upload" component={Upload} />
        <Route path="/inbox" component={Inbox} />
        <Route path="/profile/:userId" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <BottomNavigation />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
