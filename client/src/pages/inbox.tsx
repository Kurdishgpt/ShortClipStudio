import { Bell } from "lucide-react";

export default function Inbox() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        
        <div className="flex flex-col items-center justify-center py-20">
          <Bell className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No notifications yet</h2>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            When you get likes, comments, or new followers, they'll appear here
          </p>
        </div>
      </div>
    </div>
  );
}
