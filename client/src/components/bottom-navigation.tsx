import { Home, Search, PlusCircle, Bell, User } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function BottomNavigation() {
  const [location, navigate] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/", testId: "nav-home" },
    { icon: Search, label: "Discover", path: "/discover", testId: "nav-discover" },
    { icon: PlusCircle, label: "Create", path: "/upload", testId: "nav-upload", isCreate: true },
    { icon: Bell, label: "Inbox", path: "/inbox", testId: "nav-inbox" },
    { icon: User, label: "Profile", path: "/profile/me", testId: "nav-profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border h-16 safe-area-bottom">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          if (item.isCreate) {
            return (
              <Button
                key={item.path}
                size="icon"
                onClick={() => navigate(item.path)}
                className="h-12 w-12 rounded-full"
                data-testid={item.testId}
              >
                <Icon className="h-6 w-6" />
              </Button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 hover-elevate rounded-lg transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
              data-testid={item.testId}
            >
              <Icon
                className={`h-6 w-6 ${isActive ? "fill-current" : ""}`}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
