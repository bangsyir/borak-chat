import { useState } from "react";
import {
  MessageSquare,
  Users,
  Search,
  Settings,
  Plus,
  Medal,
  Lock,
  Mail,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarMenuSkeleton,
} from "~/components/ui/sidebar";
import { Input } from "~/components/ui/input";
import { Button, buttonVariants } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import { Link, NavLink, useLocation } from "react-router";
import { NavUser } from "./chat-nav-user";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { useChatContext } from "./chat-provider";
//
// type Friend = {
//   id: string;
//   name: string;
//   avatar: string;
//   isOnline: boolean;
//   lastSeen: string;
// };
//
// type Room = {
//   publicId: string;
//   name: string;
//   totalMember: string;
//   isPrivate: boolean;
// };

export function AppSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { friends, friendsLoading, rooms, roomsLoading } = useChatContext();
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <Medal className="h-5 w-5" />
            <h1 className="text-xl font-bold">Borak Inc</h1>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0">
        {/* Navigation Tabs */}
        <div className="flex border-b border-border">
          <NavLink
            to="/direct-message"
            className={cn(
              "flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors",
              location.pathname.includes("/direct-message")
                ? "bg-accent text-accent-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            <MessageSquare className="h-4 w-4" />
            DMs
          </NavLink>
          <NavLink
            to="/rooms"
            className={cn(
              "flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors",
              location.pathname.includes("/rooms")
                ? "bg-accent text-accent-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            <Users className="h-4 w-4" />
            Rooms
          </NavLink>
        </div>

        {/* Content based on active tab */}
        {location.pathname.includes("direct-message") && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between px-4 py-2">
              <span>Friends ({filteredFriends.length})</span>
              <div className="flex items-center gap-1">
                <Link
                  to={"#"}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "icon",
                      className: "hover:text-gray-500",
                    }),
                  )}
                >
                  <Mail className="w-4 h-4" />
                </Link>
                <AddFriendDialog />
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {friendsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton />
                    </SidebarMenuItem>
                  ))
                ) : (
                  <ScrollArea>
                    {filteredFriends.map((friend) => (
                      <SidebarMenuItem key={friend.id}>
                        <NavLink to={`/direct-message/${friend.id}`}>
                          {({ isActive }) => (
                            <SidebarMenuButton
                              className={cn(
                                "h-auto p-3 justify-start",
                                isActive && "bg-accent text-accent-foreground",
                              )}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className="relative">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={friend.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {friend.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div
                                    className={cn(
                                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                                      friend.isOnline
                                        ? "bg-green-500"
                                        : "bg-gray-400",
                                    )}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {friend.name}
                                  </p>
                                  <p
                                    className={cn(
                                      `text-xs truncate ${isActive ? "text-background" : "text-muted-foreground"}`,
                                    )}
                                  >
                                    {friend.isOnline
                                      ? "Online"
                                      : `Last seen ${friend.lastSeen}`}
                                  </p>
                                </div>
                              </div>
                            </SidebarMenuButton>
                          )}
                        </NavLink>
                      </SidebarMenuItem>
                    ))}
                  </ScrollArea>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {location.pathname.includes("rooms") && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between px-4 py-2">
              <span>Rooms ({filteredRooms.length})</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {roomsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton />
                    </SidebarMenuItem>
                  ))
                ) : (
                  <ScrollArea>
                    {filteredRooms.map((room) => (
                      <SidebarMenuItem key={room.publicId}>
                        <NavLink to={`/rooms/${room.publicId}`}>
                          {({ isActive }) => (
                            <SidebarMenuButton
                              className={cn(
                                "h-auto p-3 justify-start",
                                isActive && "bg-accent text-accent-foreground",
                              )}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className="flex-shrink-0 h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-primary" />
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex min-w-0 items-center justify-between gap-2">
                                        <p className="text-sm font-medium truncate flex-1">
                                          {room.name.length > 15
                                            ? room.name.slice(0, 15) + "..."
                                            : room.name}
                                        </p>
                                        {room.isPrivate && (
                                          <Lock className="h-4 w-4 text-secondary" />
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        {room.totalMember} members
                                      </p>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{room.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </SidebarMenuButton>
                          )}
                        </NavLink>
                      </SidebarMenuItem>
                    ))}
                  </ScrollArea>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

function AddFriendDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="hover:text-gray-500">
            <Plus className="h-3 w-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Friends</DialogTitle>
            <DialogDescription>Let's connect to the world</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="userId">User Id</Label>
              <Input id="userId" name="userId" defaultValue="KJKJS3HKJ" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
