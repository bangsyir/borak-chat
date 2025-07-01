import { MessageSquare } from "lucide-react";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Outlet, useLocation } from "react-router";

export function ChatWelcome() {
  const location = useLocation();
  if (
    location.pathname === "/direct-message" ||
    location.pathname === "/rooms"
  ) {
    return (
      <div className="flex h-screen flex-1 flex-col">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border p-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2 className="font-semibold">ChatApp</h2>
          </div>
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-md space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-8 w-8 text-primary" />
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
