import { MessageSquare } from "lucide-react";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Outlet, useLocation } from "react-router";

export function ChatArea() {
  const location = useLocation();
  if (
    location.pathname === "/direct-message" ||
    location.pathname === "/rooms"
  ) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2 className="font-semibold">ChatApp</h2>
          </div>
          <ModeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Welcome to ChatApp</h3>
              <p className="text-muted-foreground">
                Select a friend or join a room to start chatting. Your
                conversations will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
